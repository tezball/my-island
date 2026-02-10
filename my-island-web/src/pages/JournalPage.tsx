import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import clsx from 'clsx';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import { discoveryService } from '../services/discoveryService';
import type { Poi, UserPoiVisit, VisitStatus, VisitStats, PoiCategory } from '../types/discovery';

const IRELAND_CENTER: L.LatLngExpression = [53.5, -8.0];
const IRELAND_BOUNDS: L.LatLngBoundsExpression = [
    [51.0, -11.5],
    [55.8, -4.5],
];

const CATEGORY_ICONS: Record<string, string> = {
    TRAIL: 'hiking', LANDMARK: 'landscape', BEACH: 'beach_access', WATERFALL: 'water',
    CASTLE: 'castle', MOUNTAIN: 'terrain', LAKE: 'water', ISLAND: 'sailing',
    HERITAGE: 'account_balance', VIEWPOINT: 'visibility',
};

const CATEGORY_LABELS: Record<string, string> = {
    TRAIL: 'Trail', LANDMARK: 'Landmark', BEACH: 'Beach', WATERFALL: 'Waterfall',
    CASTLE: 'Castle', MOUNTAIN: 'Mountain', LAKE: 'Lake', ISLAND: 'Island',
    HERITAGE: 'Heritage', VIEWPOINT: 'Viewpoint',
};

const DIFFICULTY_COLORS: Record<string, string> = {
    EASY: 'bg-green-100 text-green-700',
    MODERATE: 'bg-amber-100 text-amber-700',
    DIFFICULT: 'bg-orange-100 text-orange-700',
    STRENUOUS: 'bg-red-100 text-red-700',
};

type FilterTab = 'all' | 'planned' | 'visited' | 'unvisited';

function getMarkerColor(visitStatus: VisitStatus | null): string {
    if (visitStatus === 'VISITED') return '#22c55e';
    if (visitStatus === 'PLANNED') return '#f59e0b';
    return '#9ca3af';
}

function FitAllMarkers({ pois }: { pois: Poi[] }) {
    const map = useMap();
    useEffect(() => {
        if (pois.length === 0) return;
        const bounds = L.latLngBounds(pois.map(p => [p.latitude, p.longitude]));
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 9 });
    }, [pois, map]);
    return null;
}

export const JournalPage: React.FC = () => {
    const { user } = useAuth();
    const [pois, setPois] = useState<Poi[]>([]);
    const [visits, setVisits] = useState<UserPoiVisit[]>([]);
    const [stats, setStats] = useState<VisitStats>({ visited: 0, planned: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    const [listOpen, setListOpen] = useState(false);
    const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const poisData = await discoveryService.getAllPois();
                setPois(poisData);

                if (user) {
                    const [visitsData, statsData] = await Promise.all([
                        discoveryService.getUserVisits(),
                        discoveryService.getVisitStats(),
                    ]);
                    setVisits(visitsData);
                    setStats(statsData);
                }
            } catch (error) {
                console.error('Failed to fetch journal data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const visitMap = useMemo(() => {
        const map = new Map<string, UserPoiVisit>();
        for (const v of visits) {
            map.set(v.poiId, v);
        }
        return map;
    }, [visits]);

    const filteredPois = useMemo(() => {
        return pois.filter(p => {
            const visit = visitMap.get(p.id);
            if (activeTab === 'visited') return visit?.status === 'VISITED';
            if (activeTab === 'planned') return visit?.status === 'PLANNED';
            if (activeTab === 'unvisited') return !visit;
            return true;
        });
    }, [pois, visitMap, activeTab]);

    const handleUpdateVisit = useCallback(async (poiId: string, status: VisitStatus) => {
        try {
            const visit = await discoveryService.updateVisit(poiId, status);
            setVisits(prev => {
                const filtered = prev.filter(v => v.poiId !== poiId);
                return [...filtered, visit];
            });
            setStats(prev => {
                const oldVisit = visitMap.get(poiId);
                const newStats = { ...prev };
                if (oldVisit?.status === 'VISITED') newStats.visited--;
                if (oldVisit?.status === 'PLANNED') newStats.planned--;
                if (status === 'VISITED') newStats.visited++;
                if (status === 'PLANNED') newStats.planned++;
                return newStats;
            });
        } catch (error) {
            console.error('Failed to update visit:', error);
        }
    }, [visitMap]);

    const handleRemoveVisit = useCallback(async (poiId: string) => {
        try {
            await discoveryService.removeVisit(poiId);
            const oldVisit = visitMap.get(poiId);
            setVisits(prev => prev.filter(v => v.poiId !== poiId));
            setStats(prev => {
                const newStats = { ...prev };
                if (oldVisit?.status === 'VISITED') newStats.visited--;
                if (oldVisit?.status === 'PLANNED') newStats.planned--;
                return newStats;
            });
        } catch (error) {
            console.error('Failed to remove visit:', error);
        }
    }, [visitMap]);

    const toggleNotes = (poiId: string) => {
        setExpandedNotes(prev => {
            const next = new Set(prev);
            if (next.has(poiId)) next.delete(poiId);
            else next.add(poiId);
            return next;
        });
    };

    if (!user) {
        return (
            <main className="flex-1 flex flex-col items-center justify-center min-h-screen p-4 bg-background-light dark:bg-background-dark">
                <span className="material-symbols-outlined text-6xl text-cyan-400 mb-4">explore</span>
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Travel Journal</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">Sign in to track your adventures across Ireland.</p>
                <Link to="/signin" className="rounded-xl bg-primary px-6 py-3 font-bold text-white">Sign In</Link>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="flex-1 flex items-center justify-center h-[calc(100vh-64px-80px)] bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
                    <p className="text-sm text-gray-500">Loading your journal...</p>
                </div>
            </main>
        );
    }

    const progressPct = stats.total > 0 ? Math.round((stats.visited / stats.total) * 100) : 0;

    return (
        <main className="relative flex-1 h-[calc(100vh-64px-80px)] w-full">
            {/* Full-page map */}
            <MapContainer
                center={IRELAND_CENTER}
                zoom={7}
                scrollWheelZoom={true}
                className="absolute inset-0 z-0"
                zoomControl={false}
                maxBounds={IRELAND_BOUNDS}
                maxBoundsViscosity={1.0}
                minZoom={6}
                zoomSnap={0.25}
                zoomDelta={0.5}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitAllMarkers pois={filteredPois} />
                {filteredPois.map(p => {
                    const visit = visitMap.get(p.id);
                    const color = getMarkerColor(visit?.status ?? null);
                    return (
                        <CircleMarker
                            key={p.id}
                            center={[p.latitude, p.longitude]}
                            radius={8}
                            pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 2 }}
                        >
                            <Popup>
                                <div className="min-w-[180px]">
                                    <h3 className="font-bold text-sm text-gray-900">{p.name}</h3>
                                    <p className="text-xs text-cyan-600 flex items-center gap-0.5 mt-0.5">
                                        <span className="material-symbols-outlined text-xs">{CATEGORY_ICONS[p.category] || 'explore'}</span>
                                        {CATEGORY_LABELS[p.category] || p.category}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">{[p.town, p.county].filter(Boolean).join(', ')}</p>
                                    {p.difficulty && (
                                        <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded mt-1 ${DIFFICULTY_COLORS[p.difficulty] || ''}`}>
                                            {p.difficulty}{p.distanceKm != null ? ` \u00b7 ${p.distanceKm} km` : ''}
                                        </span>
                                    )}
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 mt-1"
                                    >
                                        <span className="material-symbols-outlined text-xs">directions</span>
                                        Directions
                                    </a>
                                    <div className="flex gap-1 mt-2 pt-1.5 border-t border-gray-100">
                                        {visit?.status === 'VISITED' ? (
                                            <button
                                                onClick={() => handleRemoveVisit(p.id)}
                                                className="text-[10px] px-2 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition-colors"
                                            >
                                                Visited
                                            </button>
                                        ) : visit?.status === 'PLANNED' ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateVisit(p.id, 'VISITED')}
                                                    className="text-[10px] px-2 py-1 rounded bg-amber-100 text-amber-700 font-semibold hover:bg-green-100 hover:text-green-700 transition-colors"
                                                >
                                                    Planned
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveVisit(p.id)}
                                                    className="text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-500 font-semibold hover:bg-gray-200 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateVisit(p.id, 'PLANNED')}
                                                    className="text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-600 font-semibold hover:bg-amber-100 hover:text-amber-700 transition-colors"
                                                >
                                                    Plan
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateVisit(p.id, 'VISITED')}
                                                    className="text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-600 font-semibold hover:bg-green-100 hover:text-green-700 transition-colors"
                                                >
                                                    Visited
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            {/* Top-left title badge */}
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 dark:bg-[#1a2632]/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 flex items-center gap-2 border border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-cyan-500 text-lg">explore</span>
                <span className="font-bold text-sm text-[#111418] dark:text-white">Travel Journal</span>
            </div>

            {/* Top-right legend */}
            <div className="absolute top-4 right-4 z-[1000] bg-white/90 dark:bg-[#1a2632]/90 backdrop-blur-sm rounded-lg shadow-lg p-2.5 text-xs flex flex-col gap-1 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Visited</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-gray-700 dark:text-gray-300">Planned</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Unvisited</span>
                </div>
            </div>

            {/* Bottom panel: stats + filters + expandable list */}
            <div
                className={clsx(
                    'absolute bottom-0 left-0 right-0 z-[1000] bg-white dark:bg-[#1a2632] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col',
                    'rounded-t-2xl border-t border-gray-200 dark:border-gray-700',
                    listOpen ? 'max-h-[70vh]' : 'max-h-auto',
                )}
            >
                {/* Drag handle */}
                <button
                    onClick={() => setListOpen(v => !v)}
                    className="w-full flex flex-col items-center pt-2 pb-1 cursor-pointer"
                >
                    <span className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                </button>

                {/* Stats row */}
                <div className="px-4 pb-2 flex items-center gap-3">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            <span className="text-sm font-bold text-[#111418] dark:text-white">{stats.visited}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <span className="text-sm font-bold text-[#111418] dark:text-white">{stats.planned}</span>
                        </div>
                        <span className="text-xs text-gray-400">of {stats.total}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-gray-500">{progressPct}%</span>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="px-4 pb-3 flex gap-1.5">
                    {(['all', 'planned', 'visited', 'unvisited'] as FilterTab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                'px-3 py-1 rounded-full text-xs font-semibold transition-colors',
                                activeTab === tab
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
                            )}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                    <button
                        onClick={() => setListOpen(v => !v)}
                        className="ml-auto flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">
                            {listOpen ? 'expand_more' : 'expand_less'}
                        </span>
                        {listOpen ? 'Map' : 'List'}
                    </button>
                </div>

                {/* Expandable list */}
                {listOpen && (
                    <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
                        {filteredPois.length === 0 ? (
                            <p className="text-center text-gray-400 py-6 text-sm">No places match this filter.</p>
                        ) : (
                            filteredPois.map(p => {
                                const visit = visitMap.get(p.id);
                                return (
                                    <div
                                        key={p.id}
                                        className="bg-gray-50 dark:bg-[#1e2d3d] rounded-xl p-3 border border-gray-100 dark:border-gray-800"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-sm text-[#111418] dark:text-white truncate">{p.name}</h3>
                                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                    <span className="text-xs text-cyan-600 flex items-center gap-0.5">
                                                        <span className="material-symbols-outlined text-xs">{CATEGORY_ICONS[p.category] || 'explore'}</span>
                                                        {CATEGORY_LABELS[p.category as PoiCategory] || p.category}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {[p.town, p.county].filter(Boolean).join(', ')}
                                                    </span>
                                                    {p.difficulty && (
                                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[p.difficulty] || ''}`}>
                                                            {p.difficulty}
                                                        </span>
                                                    )}
                                                    {p.distanceKm != null && (
                                                        <span className="text-xs text-gray-400">{p.distanceKm} km</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                {visit?.status === 'VISITED' ? (
                                                    <button
                                                        onClick={() => handleRemoveVisit(p.id)}
                                                        className="text-[10px] px-2 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition-colors"
                                                    >
                                                        Visited
                                                    </button>
                                                ) : visit?.status === 'PLANNED' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateVisit(p.id, 'VISITED')}
                                                            className="text-[10px] px-2 py-1 rounded bg-amber-100 text-amber-700 font-semibold hover:bg-green-100 hover:text-green-700 transition-colors"
                                                        >
                                                            Planned
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveVisit(p.id)}
                                                            className="text-[10px] px-1.5 py-1 rounded bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-xs">close</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateVisit(p.id, 'PLANNED')}
                                                            className="text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-600 font-semibold hover:bg-amber-100 hover:text-amber-700 transition-colors"
                                                        >
                                                            Plan
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateVisit(p.id, 'VISITED')}
                                                            className="text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-600 font-semibold hover:bg-green-100 hover:text-green-700 transition-colors"
                                                        >
                                                            Visited
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {visit && (
                                            <button
                                                onClick={() => toggleNotes(p.id)}
                                                className="text-[10px] text-gray-400 hover:text-gray-600 mt-1 flex items-center gap-0.5"
                                            >
                                                <span className="material-symbols-outlined text-xs">
                                                    {expandedNotes.has(p.id) ? 'expand_less' : 'expand_more'}
                                                </span>
                                                {visit.notes ? 'Notes' : 'Add notes'}
                                            </button>
                                        )}
                                        {expandedNotes.has(p.id) && visit && (
                                            <div className="mt-1.5">
                                                <textarea
                                                    className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 resize-none"
                                                    rows={2}
                                                    placeholder="Add a note..."
                                                    defaultValue={visit.notes || ''}
                                                    onBlur={(e) => {
                                                        const newNotes = e.target.value;
                                                        if (newNotes !== (visit.notes || '')) {
                                                            discoveryService.updateVisit(p.id, visit.status, newNotes);
                                                            setVisits(prev => prev.map(v =>
                                                                v.poiId === p.id ? { ...v, notes: newNotes } : v
                                                            ));
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};
