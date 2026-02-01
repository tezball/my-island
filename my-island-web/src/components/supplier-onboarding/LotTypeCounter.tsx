import React from 'react';
import clsx from 'clsx';
import { LotGridPreview } from './LotGridPreview';

type LotType = 'tent' | 'touring' | 'glamping' | 'cabin' | 'mobile-home';

interface LotTypeCounterProps {
    type: LotType;
    label: string;
    icon: string;
    count: number;
    presets: number[];
    onChange: (count: number) => void;
}

const TYPE_COLORS: Record<LotType, string> = {
    tent: 'text-emerald-600 dark:text-emerald-400',
    touring: 'text-blue-600 dark:text-blue-400',
    glamping: 'text-purple-600 dark:text-purple-400',
    cabin: 'text-amber-600 dark:text-amber-400',
    'mobile-home': 'text-rose-600 dark:text-rose-400',
};

export const LotTypeCounter: React.FC<LotTypeCounterProps> = ({
    type,
    label,
    icon,
    count,
    presets,
    onChange,
}) => {
    const handleDecrement = () => {
        if (count > 0) {
            onChange(count - 1);
        }
    };

    const handleIncrement = () => {
        onChange(count + 1);
    };

    const handlePresetClick = (preset: number) => {
        onChange(preset);
    };

    return (
        <div className="rounded-xl bg-white dark:bg-[#1a2632] p-4 ring-1 ring-black/5 dark:ring-white/10">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={clsx('text-2xl', TYPE_COLORS[type])}>{icon}</span>
                    <span className="text-base font-semibold text-[#111418] dark:text-white">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDecrement}
                        disabled={count === 0}
                        className={clsx(
                            'flex size-9 items-center justify-center rounded-full transition-all',
                            count === 0
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                : 'bg-gray-100 dark:bg-gray-700 text-[#111418] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95'
                        )}
                    >
                        <span className="material-symbols-outlined text-xl">remove</span>
                    </button>
                    <span className="w-10 text-center text-xl font-bold text-[#111418] dark:text-white tabular-nums">
                        {count}
                    </span>
                    <button
                        onClick={handleIncrement}
                        className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">add</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
                {presets.map(preset => (
                    <button
                        key={preset}
                        onClick={() => handlePresetClick(preset)}
                        className={clsx(
                            'px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95',
                            count === preset
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        )}
                    >
                        {preset}
                    </button>
                ))}
            </div>

            <LotGridPreview type={type} count={count} maxDisplay={15} />
        </div>
    );
};
