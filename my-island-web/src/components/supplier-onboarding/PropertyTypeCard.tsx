import React from 'react';
import clsx from 'clsx';
import type { AccommodationType } from '../../context/SupplierOnboardingContext';

interface PropertyTypeCardProps {
    type: AccommodationType;
    label: string;
    description: string;
    icon: string;
    imageUrl: string;
    isSelected: boolean;
    onSelect: () => void;
}

export const PropertyTypeCard: React.FC<PropertyTypeCardProps> = ({
    label,
    description,
    icon,
    imageUrl,
    isSelected,
    onSelect,
}) => {
    return (
        <button
            onClick={onSelect}
            className={clsx(
                'group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#1a2632] text-left transition-all active:scale-[0.98]',
                isSelected
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'ring-1 ring-black/5 dark:ring-white/10 hover:ring-primary/50 hover:shadow-md'
            )}
        >
            {isSelected && (
                <div className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-full bg-primary shadow-md">
                    <span className="material-symbols-outlined text-[18px] font-bold text-white">check</span>
                </div>
            )}
            <div
                className="aspect-[16/10] w-full bg-cover bg-center"
                style={{ backgroundImage: `url("${imageUrl}")` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
            <div className="flex flex-col p-4">
                <div className="flex items-center gap-2 mb-1">
                    <span
                        className={clsx(
                            'material-symbols-outlined text-xl',
                            isSelected ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                        )}
                    >
                        {icon}
                    </span>
                    <span className="text-base font-bold text-[#111418] dark:text-white">{label}</span>
                </div>
                <span
                    className={clsx(
                        'text-sm leading-relaxed',
                        isSelected ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                    )}
                >
                    {description}
                </span>
            </div>
        </button>
    );
};
