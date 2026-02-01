import React, { useState } from 'react';
import clsx from 'clsx';
import type { LotCounts, AccommodationType } from '../../context/SupplierOnboardingContext';

interface PricingConfiguratorProps {
    basePricePerNight: number;
    typePricing?: Record<string, number>;
    lotCounts: LotCounts;
    selectedTypes: AccommodationType[];
    onBasePriceChange: (price: number) => void;
    onTypePricingChange: (pricing: Record<string, number> | undefined) => void;
}

const LOT_TYPE_LABELS: Record<AccommodationType, { label: string; icon: string }> = {
    tent: { label: 'Tent Pitches', icon: '🏕️' },
    touring: { label: 'Touring Pitches', icon: '🚐' },
    glamping: { label: 'Glamping', icon: '⛺' },
    cabin: { label: 'Cabins & Lodges', icon: '🏠' },
    'mobile-home': { label: 'Mobile Homes', icon: '🏡' },
};

export const PricingConfigurator: React.FC<PricingConfiguratorProps> = ({
    basePricePerNight,
    typePricing,
    lotCounts,
    selectedTypes,
    onBasePriceChange,
    onTypePricingChange,
}) => {
    const [usePerTypePricing, setUsePerTypePricing] = useState(!!typePricing);

    const handleTogglePerTypePricing = () => {
        if (usePerTypePricing) {
            setUsePerTypePricing(false);
            onTypePricingChange(undefined);
        } else {
            setUsePerTypePricing(true);
            const initialPricing: Record<string, number> = {};
            selectedTypes.forEach(type => {
                initialPricing[type] = basePricePerNight;
            });
            onTypePricingChange(initialPricing);
        }
    };

    const handleTypePriceChange = (type: string, price: number) => {
        if (!typePricing) return;
        onTypePricingChange({
            ...typePricing,
            [type]: price,
        });
    };

    return (
        <div className="space-y-4">
            <div className="rounded-xl bg-white dark:bg-[#1a2632] p-4 ring-1 ring-black/5 dark:ring-white/10">
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                    Base Price Per Night
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-500 dark:text-gray-400">€</span>
                    <input
                        type="number"
                        min="1"
                        value={basePricePerNight}
                        onChange={(e) => onBasePriceChange(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24 text-2xl font-bold text-[#111418] dark:text-white bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-primary outline-none text-center tabular-nums"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">/night</span>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    You can adjust individual lot prices later.
                </p>
            </div>

            {selectedTypes.length > 1 && (
                <div className="rounded-xl bg-white dark:bg-[#1a2632] p-4 ring-1 ring-black/5 dark:ring-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 mr-3">
                            <h4 className="text-sm font-semibold text-[#111418] dark:text-white">
                                Different prices per type?
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Set different base prices for each type
                            </p>
                        </div>
                        <button
                            onClick={handleTogglePerTypePricing}
                            className={clsx(
                                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0',
                                usePerTypePricing ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                            )}
                        >
                            <span
                                className={clsx(
                                    'inline-block size-4 transform rounded-full bg-white shadow-sm transition-transform',
                                    usePerTypePricing ? 'translate-x-6' : 'translate-x-1'
                                )}
                            />
                        </button>
                    </div>

                    {usePerTypePricing && typePricing && (
                        <div className="space-y-2.5 pt-3 border-t border-gray-200 dark:border-gray-700">
                            {selectedTypes.map(type => {
                                const config = LOT_TYPE_LABELS[type];
                                return (
                                    <div key={type} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">{config.icon}</span>
                                            <span className="text-sm font-medium text-[#111418] dark:text-white">
                                                {config.label}
                                            </span>
                                            {lotCounts[type] > 0 && (
                                                <span className="text-xs text-gray-400">
                                                    ({lotCounts[type]})
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-gray-500">€</span>
                                            <input
                                                type="number"
                                                min="1"
                                                value={typePricing[type] || basePricePerNight}
                                                onChange={(e) =>
                                                    handleTypePriceChange(type, Math.max(1, parseInt(e.target.value) || 1))
                                                }
                                                className="w-16 px-2 py-1 text-base font-semibold text-[#111418] dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary text-center tabular-nums"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
