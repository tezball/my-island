import React from 'react';
import type { LotsDetailResponse } from '../../../services/ownerService';

interface LotsDetailTableProps {
    data: LotsDetailResponse;
}

const TYPE_LABELS: Record<string, string> = {
    'tent': 'Tent Pitch',
    'touring': 'Touring Pitch',
    'glamping': 'Glamping',
    'cabin': 'Cabin & Lodge',
    'mobile-home': 'Mobile Home',
};

const TYPE_ICONS: Record<string, string> = {
    'tent': 'camping',
    'touring': 'rv_hookup',
    'glamping': 'cottage',
    'cabin': 'cabin',
    'mobile-home': 'home',
};

const StatusBadge: React.FC<{ isAvailable: boolean }> = ({ isAvailable }) => {
    return isAvailable ? (
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Available
        </span>
    ) : (
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Occupied
        </span>
    );
};

export const LotsDetailTable: React.FC<LotsDetailTableProps> = ({ data }) => {
    if (data.lots.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">grid_view</span>
                <p>No lots found</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-[#111418] dark:text-white">{data.summary.total}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Lots</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">{data.summary.available}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Available</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-400">{data.summary.unavailable}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Occupied</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400">{Object.keys(data.summary.byType).length}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Types</p>
                </div>
            </div>

            {/* By Type Breakdown */}
            <div className="mb-4 sm:mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">By Type</h3>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(data.summary.byType).map(([type, count]) => (
                        <div
                            key={type}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg"
                        >
                            <span className="material-symbols-outlined text-sm text-gray-500">
                                {TYPE_ICONS[type] || 'home'}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {TYPE_LABELS[type] || type}
                            </span>
                            <span className="text-sm font-semibold text-[#111418] dark:text-white">
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
                {data.lots.map((lot) => (
                    <div
                        key={lot.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-[#111418] dark:text-white truncate">{lot.name}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-sm">
                                        {TYPE_ICONS[lot.type] || 'home'}
                                    </span>
                                    {TYPE_LABELS[lot.type] || lot.type}
                                </div>
                            </div>
                            <StatusBadge isAvailable={lot.isAvailable} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-primary">
                                €{lot.pricePerNight}/night
                            </span>
                        </div>
                        {lot.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {lot.amenities.slice(0, 3).map((amenity, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                                {lot.amenities.length > 3 && (
                                    <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                                        +{lot.amenities.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Price/Night</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Amenities</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.lots.map((lot) => (
                            <tr
                                key={lot.id}
                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                <td className="py-3 px-4">
                                    <p className="font-medium text-[#111418] dark:text-white">{lot.name}</p>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-sm">
                                            {TYPE_ICONS[lot.type] || 'home'}
                                        </span>
                                        {TYPE_LABELS[lot.type] || lot.type}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="font-semibold text-primary">€{lot.pricePerNight}</span>
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge isAvailable={lot.isAvailable} />
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex flex-wrap gap-1">
                                        {lot.amenities.slice(0, 3).map((amenity, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                        {lot.amenities.length > 3 && (
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                                                +{lot.amenities.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
