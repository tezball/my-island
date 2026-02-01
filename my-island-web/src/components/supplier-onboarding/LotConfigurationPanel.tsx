import React from 'react';
import { LotTypeCounter } from './LotTypeCounter';
import type { LotCounts, AccommodationType } from '../../context/SupplierOnboardingContext';

interface LotConfigurationPanelProps {
    lotCounts: LotCounts;
    selectedTypes: AccommodationType[];
    onChange: (lotCounts: LotCounts) => void;
}

const LOT_TYPES: Array<{
    type: AccommodationType;
    label: string;
    icon: string;
    presets: number[];
}> = [
    {
        type: 'tent',
        label: 'Tent Pitches',
        icon: '🏕️',
        presets: [5, 10, 15, 20, 30],
    },
    {
        type: 'touring',
        label: 'Touring Pitches',
        icon: '🚐',
        presets: [5, 10, 15],
    },
    {
        type: 'glamping',
        label: 'Glamping',
        icon: '⛺',
        presets: [2, 5, 10],
    },
    {
        type: 'cabin',
        label: 'Cabins & Lodges',
        icon: '🏠',
        presets: [2, 5, 10],
    },
    {
        type: 'mobile-home',
        label: 'Mobile Homes',
        icon: '🏡',
        presets: [2, 5, 10],
    },
];

export const LotConfigurationPanel: React.FC<LotConfigurationPanelProps> = ({ lotCounts, selectedTypes, onChange }) => {
    const handleTypeChange = (type: keyof LotCounts, count: number) => {
        onChange({
            ...lotCounts,
            [type]: count,
        });
    };

    // Filter to only show selected types
    const filteredLotTypes = LOT_TYPES.filter(lt => selectedTypes.includes(lt.type));

    const totalLots = selectedTypes.reduce((sum, type) => sum + lotCounts[type], 0);

    return (
        <div className="space-y-4">
            {filteredLotTypes.map(lotType => (
                <LotTypeCounter
                    key={lotType.type}
                    type={lotType.type}
                    label={lotType.label}
                    icon={lotType.icon}
                    count={lotCounts[lotType.type]}
                    presets={lotType.presets}
                    onChange={(count) => handleTypeChange(lotType.type, count)}
                />
            ))}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-base font-semibold text-gray-600 dark:text-gray-300">Total Lots</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary tabular-nums">{totalLots}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">lots</span>
                </div>
            </div>

            {totalLots === 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                    Configure at least one lot to continue.
                </p>
            )}
        </div>
    );
};
