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

interface ExploreFilterPanelProps {
    filters: ExploreFilters;
    onChange: (filters: ExploreFilters) => void;
    counties: string[];
    isOpen: boolean;
    onToggle: () => void;
    campsiteCount: number;
    supplierCount: number;
}

export const ExploreFilterPanel: React.FC<ExploreFilterPanelProps> = ({
    filters, onChange, counties, isOpen, onToggle, campsiteCount, supplierCount,
}) => {
    const update = (partial: Partial<ExploreFilters>) => onChange({ ...filters, ...partial });

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={onToggle}
                className="absolute top-4 left-4 z-[1000] bg-white dark:bg-[#1a2632] shadow-lg rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
            >
                <span className="material-symbols-outlined text-lg">
                    {isOpen ? 'close' : 'tune'}
                </span>
                {isOpen ? 'Close' : 'Filters'}
            </button>

            {/* Panel */}
            <div
                className={clsx(
                    'absolute z-[1000] bg-white dark:bg-[#1a2632] shadow-xl transition-all duration-300 overflow-y-auto',
                    // Desktop: left sidebar
                    'md:top-0 md:left-0 md:h-full md:w-80 md:rounded-r-xl md:border-r md:border-gray-200 md:dark:border-gray-700',
                    // Mobile: bottom sheet
                    'max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:rounded-t-xl max-md:border-t max-md:border-gray-200 max-md:dark:border-gray-700 max-md:max-h-[60vh]',
                    isOpen ? 'translate-x-0 max-md:translate-y-0' : 'md:-translate-x-full max-md:translate-y-full',
                )}
            >
                <div className="p-4 pt-14 md:pt-16 flex flex-col gap-4">
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

                    {/* Reset filters */}
                    <button
                        onClick={() => onChange({
                            showCampsites: true, showSuppliers: true,
                            propertyType: '', supplierCategory: '', county: '', searchText: '',
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
