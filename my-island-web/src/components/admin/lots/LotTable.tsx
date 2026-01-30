import React from 'react';
import type { Lot } from '../../../services/adminService';

interface LotTableProps {
    lots: Lot[];
    selectedIds: Set<string>;
    onSelect: (id: string, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
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

export const LotTable: React.FC<LotTableProps> = ({
    lots,
    selectedIds,
    onSelect,
    onSelectAll,
    onEdit,
    onDelete
}) => {
    const allSelected = lots.length > 0 && lots.every(lot => selectedIds.has(lot.id));
    const isIndeterminate = lots.some(lot => selectedIds.has(lot.id)) && !allSelected;

    return (
        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="w-12 px-6 py-4 text-left">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        ref={input => {
                                            if (input) input.indeterminate = isIndeterminate;
                                        }}
                                        onChange={(e) => onSelectAll(e.target.checked)}
                                        className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </label>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Accommodation
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {lots.map((lot) => (
                            <tr
                                key={lot.id}
                                className={`group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${selectedIds.has(lot.id) ? 'bg-primary/5 dark:bg-primary/10' : ''
                                    }`}
                            >
                                <td className="px-6 py-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(lot.id)}
                                            onChange={(e) => onSelect(lot.id, e.target.checked)}
                                            className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                        />
                                    </label>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-[#111418] dark:text-white">
                                            {lot.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[200px]">
                                            {lot.description}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                                        {TYPE_LABELS[lot.type]}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${lot.isAvailable
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${lot.isAvailable ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                        {lot.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-[#111418] dark:text-white">
                                        €{lot.pricePerNight}
                                        <span className="text-gray-500 dark:text-gray-400 font-normal text-sm">/night</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(lot)}
                                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => onDelete(lot.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Empty State specific to table context if needed */}
        </div>
    );
};
