import React from 'react';
import clsx from 'clsx';
import type { ExploreFilters } from '../../types/explore';
import type { OfferCategory } from '../../types/supplier';

const PROPERTY_TYPES = [
    { value: '', label: 'All Property Types' },
    { value: 'CAMPSITE', label: 'Campsite' },
    { value: 'GLAMPING', label: 'Glamping' },
    { value: 'CARAVAN_PARK', label: 'Caravan Park' },
    { value: 'MIXED', label: 'Mixed' },
];

const SUPPLIER_CATEGORIES: { value: '' | OfferCategory; label: string }[] = [
    { value: '', label: 'All Categories' },
    { value: 'FOOD', label: 'Food & Drink' },
    { value: 'ACTIVITIES', label: 'Activities' },
    { value: 'GEAR', label: 'Camping Gear' },
    { value: 'ATTRACTIONS', label: 'Attractions' },
    { value: 'TRANSPORT', label: 'Transport' },
];

const POI_CATEGORIES = [
    { value: '', label: 'All POI Types' },
    { value: 'TRAIL', label: 'Trails' },
    { value: 'LANDMARK', label: 'Landmarks' },
    { value: 'BEACH', label: 'Beaches' },
    { value: 'WATERFALL', label: 'Waterfalls' },
    { value: 'CASTLE', label: 'Castles' },
    { value: 'MOUNTAIN', label: 'Mountains' },
    { value: 'LAKE', label: 'Lakes' },
    { value: 'ISLAND', label: 'Islands' },
    { value: 'HERITAGE', label: 'Heritage' },
    { value: 'VIEWPOINT', label: 'Viewpoints' },
];

interface ExploreFilterPanelProps {
    filters: ExploreFilters;
    onChange: (filters: ExploreFilters) => void;
    counties: string[];
    isOpen: boolean;
    onToggle: () => void;
    campsiteCount: number;
    supplierCount: number;
    poiCount: number;
}

export const ExploreFilterPanel: React.FC<ExploreFilterPanelProps> = ({
    filters, onChange, counties, isOpen, onToggle, campsiteCount, supplierCount, poiCount,
}) => {
    const update = (partial: Partial<ExploreFilters>) => onChange({ ...filters, ...partial });

    return (
        <>
            {/* Toggle button — pinned to left side */}
            <button
                onClick={onToggle}
                className={clsx(
                    'absolute top-4 z-[1001] bg-white dark:bg-[#1a2632] shadow-lg rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600',
                    isOpen ? 'left-[calc(20rem+1rem)]' : 'left-4',
                )}
            >
                <span className="material-symbols-outlined text-lg">
                    {isOpen ? 'close' : 'tune'}
                </span>
                {isOpen ? 'Close' : 'Filters'}
            </button>

            {/* Backdrop — mobile only */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[999] bg-black/30 md:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Slide-in panel from left */}
            <div
                className={clsx(
                    'absolute top-0 left-0 z-[1000] h-full w-80 bg-white dark:bg-[#1a2632] shadow-xl border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="p-4 pt-14 flex flex-col gap-4">
                    {/* Search */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={filters.searchText}
                            onChange={(e) => update({ searchText: e.target.value })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                        />
                    </div>

                    {/* Show/Hide toggles */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Show on map</label>
                        <button
                            onClick={() => update({ showCampsites: !filters.showCampsites })}
                            className={clsx(
                                'flex items-center gap-3 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                                filters.showCampsites
                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700'
                                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400',
                            )}
                        >
                            <span className="w-3 h-3 rounded-full bg-emerald-500" />
                            Campsites
                            <span className="ml-auto text-xs">{campsiteCount}</span>
                        </button>
                        <button
                            onClick={() => update({ showSuppliers: !filters.showSuppliers })}
                            className={clsx(
                                'flex items-center gap-3 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                                filters.showSuppliers
                                    ? 'border-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700'
                                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400',
                            )}
                        >
                            <span className="w-3 h-3 rounded-full bg-purple-500" />
                            Suppliers
                            <span className="ml-auto text-xs">{supplierCount}</span>
                        </button>
                        <button
                            onClick={() => update({ showPois: !filters.showPois })}
                            className={clsx(
                                'flex items-center gap-3 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                                filters.showPois
                                    ? 'border-cyan-300 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700'
                                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400',
                            )}
                        >
                            <span className="w-3 h-3 rounded-full bg-cyan-500" />
                            Points of Interest
                            <span className="ml-auto text-xs">{poiCount}</span>
                        </button>
                    </div>

                    {/* County filter */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">County</label>
                        <select
                            value={filters.county}
                            onChange={(e) => update({ county: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                        >
                            <option value="">All Counties</option>
                            {counties.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Property type filter (campsites) */}
                    {filters.showCampsites && (
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">Property Type</label>
                            <select
                                value={filters.propertyType}
                                onChange={(e) => update({ propertyType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                            >
                                {PROPERTY_TYPES.map(pt => (
                                    <option key={pt.value} value={pt.value}>{pt.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Supplier category filter */}
                    {filters.showSuppliers && (
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">Supplier Category</label>
                            <select
                                value={filters.supplierCategory}
                                onChange={(e) => update({ supplierCategory: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                            >
                                {SUPPLIER_CATEGORIES.map(sc => (
                                    <option key={sc.value} value={sc.value}>{sc.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* POI category filter */}
                    {filters.showPois && (
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">POI Category</label>
                            <select
                                value={filters.poiCategory}
                                onChange={(e) => update({ poiCategory: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                            >
                                {POI_CATEGORIES.map(pc => (
                                    <option key={pc.value} value={pc.value}>{pc.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Reset filters */}
                    <button
                        onClick={() => onChange({
                            showCampsites: true, showSuppliers: true, showPois: true,
                            propertyType: '', supplierCategory: '', poiCategory: '', county: '', searchText: '',
                        })}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline self-start"
                    >
                        Reset all filters
                    </button>
                </div>
            </div>
        </>
    );
};
