import React from 'react';
import type { Lot } from '../../../services/adminService';

interface LotCardProps {
    lot: Lot;
    isSelected: boolean;
    onSelect: (id: string, selected: boolean) => void;
    onEdit: (lot: Lot) => void;
    onDelete: (id: string) => void;
}

const TYPE_LABELS: Record<Lot['type'], string> = {
    tent: 'Tent',
    rv: 'RV',
    cabin: 'Cabin',
    lodge: 'Lodge',
    'mobile-home': 'Mobile-Home'
};

export const LotCard: React.FC<LotCardProps> = ({
    lot,
    isSelected,
    onSelect,
    onEdit,
    onDelete
}) => {
    return (
        <div className={`bg-white dark:bg-[#1a2632] rounded-xl border-2 transition-all overflow-hidden ${
            isSelected
                ? 'border-primary shadow-lg'
                : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
        }`}>
            {/* Image with selection checkbox */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={lot.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={lot.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />

                {/* Price badge */}
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 px-2.5 py-1 rounded-lg shadow-sm">
                    <span className="text-sm font-bold text-primary">€{lot.pricePerNight}</span>
                    <span className="text-xs text-gray-500">/night</span>
                </div>

                {/* Selection checkbox */}
                <div className="absolute top-3 left-3">
                    <label className="flex items-center justify-center w-6 h-6 bg-white dark:bg-gray-900 rounded-md shadow-sm cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-primary">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => onSelect(lot.id, e.target.checked)}
                            className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
                        />
                    </label>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-[#111418] dark:text-white truncate">{lot.name}</h3>
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${
                        lot.isAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`} title={lot.isAvailable ? 'Available' : 'Unavailable'} />
                </div>

                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded mb-2">
                    {TYPE_LABELS[lot.type]}
                </span>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                    {lot.description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={() => onEdit(lot)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Edit lot"
                    >
                        <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button
                        onClick={() => onDelete(lot.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete lot"
                    >
                        <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
