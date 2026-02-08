import React from 'react';
import type { Lot } from '../../types/booking';
import clsx from 'clsx';

interface OwnerLotsTableProps {
    lots: Lot[];
    onEdit: (lot: Lot) => void;
    onDelete: (lot: Lot) => void;
}

const LOT_TYPE_INFO: Record<string, { label: string; icon: string; color: string }> = {
    tent: { label: 'Tent Pitch', icon: '🏕️', color: 'bg-emerald-100 text-emerald-700' },
    touring: { label: 'Touring Pitch', icon: '🚐', color: 'bg-blue-100 text-blue-700' },
    glamping: { label: 'Glamping', icon: '⛺', color: 'bg-purple-100 text-purple-700' },
    cabin: { label: 'Cabin & Lodge', icon: '🏠', color: 'bg-amber-100 text-amber-700' },
    'mobile-home': { label: 'Mobile Home', icon: '🏠', color: 'bg-rose-100 text-rose-700' },
};

export const OwnerLotsTable: React.FC<OwnerLotsTableProps> = ({ lots, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Price</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Amenities</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lots.map((lot) => {
                            const typeInfo = LOT_TYPE_INFO[lot.type] || LOT_TYPE_INFO.tent;
                            return (
                                <tr
                                    key={lot.id}
                                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors last:border-0"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={lot.imageUrl || 'https://placehold.co/400x300/e2e8f0/1e293b?text=No+Image'}
                                                alt={lot.name}
                                                className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-700"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://placehold.co/400x300/e2e8f0/1e293b?text=No+Image';
                                                }}
                                            />
                                            <div>
                                                <p className="font-semibold text-[#111418] dark:text-white">{lot.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[200px]">{lot.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={clsx(
                                            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
                                            typeInfo.color.replace('text-', 'bg-opacity-20 text-')
                                        )}>
                                            <span>{typeInfo.icon}</span>
                                            {typeInfo.label}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="font-semibold text-[#111418] dark:text-white">€{lot.pricePerNight}</span>
                                        <span className="text-xs text-gray-500 font-normal">/night</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={clsx(
                                            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
                                            lot.isAvailable
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        )}>
                                            <span className={clsx('w-1.5 h-1.5 rounded-full', lot.isAvailable ? 'bg-green-500' : 'bg-red-500')}></span>
                                            {lot.isAvailable ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {lot.lotAmenities?.slice(0, 2).map((amenity, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                            {(lot.lotAmenities?.length || 0) > 2 && (
                                                <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                                    +{(lot.lotAmenities?.length || 0) - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => onEdit(lot)}
                                                className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Edit Lot"
                                            >
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Delete "${lot.name}"? This cannot be undone.`)) {
                                                        onDelete(lot);
                                                    }
                                                }}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Lot"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {lots.length === 0 && (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">grid_view</span>
                    <p className="text-gray-500 dark:text-gray-400">No lots found matching your filters</p>
                </div>
            )}
        </div>
    );
};
