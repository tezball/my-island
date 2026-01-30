import React from 'react';
import type { Lot } from '../../../services/adminService';

interface LotFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    typeFilter: Lot['type'] | 'all';
    onTypeChange: (type: Lot['type'] | 'all') => void;
    statusFilter: 'all' | 'available' | 'unavailable';
    onStatusChange: (status: 'all' | 'available' | 'unavailable') => void;
    totalCount: number;
    filteredCount: number;
}

const LOT_TYPES: { value: Lot['type'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'tent', label: 'Tent' },
    { value: 'rv', label: 'RV' },
    { value: 'cabin', label: 'Cabin' },
    { value: 'lodge', label: 'Lodge' },
    { value: 'mobile-home', label: 'Mobile Home' }
];

const STATUS_OPTIONS: { value: 'all' | 'available' | 'unavailable'; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' }
];

export const LotFilters: React.FC<LotFiltersProps> = ({
    searchQuery,
    onSearchChange,
    typeFilter,
    onTypeChange,
    statusFilter,
    onStatusChange,
    totalCount,
    filteredCount
}) => {
    return (
        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search lots..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                </div>

                {/* Type Filter */}
                <div className="w-full md:w-44">
                    <select
                        value={typeFilter}
                        onChange={(e) => onTypeChange(e.target.value as Lot['type'] | 'all')}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                        {LOT_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="w-full md:w-44">
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value as 'all' | 'available' | 'unavailable')}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                        {STATUS_OPTIONS.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredCount} of {totalCount} lots
            </div>
        </div>
    );
};
