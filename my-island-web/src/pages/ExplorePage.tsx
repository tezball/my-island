import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { campsiteService, type CampsiteProfile } from '../services/campsiteService';
import { supplierService, type Supplier } from '../services/supplierService';
import { ExploreMap } from '../components/explore/ExploreMap';
import { ExploreFilterPanel } from '../components/explore/ExploreFilterPanel';
import type { ExploreFilters, MapMarker } from '../types/explore';
import { campsiteToMarker, supplierToMarker } from '../types/explore';

export const ExplorePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const initialCounty = searchParams.get('county') || '';
    const initialType = searchParams.get('type') || '';

    const [campsites, setCampsites] = useState<CampsiteProfile[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [counties, setCounties] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterOpen, setFilterOpen] = useState(false);

    const [filters, setFilters] = useState<ExploreFilters>({
        showCampsites: true,
        showSuppliers: !initialType, // hide suppliers if a property type filter was passed
        propertyType: initialType,
        supplierCategory: '',
        county: initialCounty,
        searchText: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [campsitesData, countiesData, suppliersData] = await Promise.all([
                    campsiteService.getAllCampsites(),
                    campsiteService.getCounties(),
                    supplierService.getAllSuppliers().catch(() => []),
                ]);
                setCampsites(campsitesData);
                setCounties(countiesData);
                setSuppliers(suppliersData);
            } catch (error) {
                console.error('Failed to fetch explore data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const markers = useMemo<MapMarker[]>(() => {
        const result: MapMarker[] = [];

        if (filters.showCampsites) {
            for (const c of campsites) {
                const m = campsiteToMarker(c);
                if (!m) continue;
                if (filters.county && m.county !== filters.county) continue;
                if (filters.propertyType && m.propertyType !== filters.propertyType) continue;
                if (filters.searchText) {
                    const q = filters.searchText.toLowerCase();
                    if (!m.name.toLowerCase().includes(q) && !m.county.toLowerCase().includes(q) && !m.town.toLowerCase().includes(q)) continue;
                }
                result.push(m);
            }
        }

        if (filters.showSuppliers) {
            for (const s of suppliers) {
                const m = supplierToMarker(s);
                if (!m) continue;
                if (filters.county && m.county !== filters.county) continue;
                if (filters.supplierCategory && m.category !== filters.supplierCategory) continue;
                if (filters.searchText) {
                    const q = filters.searchText.toLowerCase();
                    if (!m.name.toLowerCase().includes(q) && !(m.county || '').toLowerCase().includes(q) && !(m.town || '').toLowerCase().includes(q)) continue;
                }
                result.push(m);
            }
        }

        return result;
    }, [campsites, suppliers, filters]);

    const campsiteCount = useMemo(() =>
        markers.filter(m => m.type === 'campsite').length
    , [markers]);

    const supplierCount = useMemo(() =>
        markers.filter(m => m.type === 'supplier').length
    , [markers]);

    return (
        <main className="relative flex-1 h-[calc(100vh-64px-80px)] w-full">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                        <p className="text-sm text-gray-500">Loading explore map...</p>
                    </div>
                </div>
            ) : (
                <>
                    <ExploreMap markers={markers} className="absolute inset-0 z-0" />
                    <ExploreFilterPanel
                        filters={filters}
                        onChange={setFilters}
                        counties={counties}
                        isOpen={filterOpen}
                        onToggle={() => setFilterOpen(v => !v)}
                        campsiteCount={campsiteCount}
                        supplierCount={supplierCount}
                    />
                    {/* Legend */}
                    <div className="absolute bottom-4 right-4 z-[1000] bg-white dark:bg-[#1a2632] rounded-lg shadow-lg p-3 text-xs flex flex-col gap-1.5 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-gray-700 dark:text-gray-300">Campsites ({campsiteCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-purple-500" />
                            <span className="text-gray-700 dark:text-gray-300">Suppliers ({supplierCount})</span>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};
