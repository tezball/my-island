import React from 'react';
import clsx from 'clsx';
import { useSupplierOnboarding } from '../../context/SupplierOnboardingContext';
import type { AccommodationType } from '../../context/SupplierOnboardingContext';

interface PropertyTypeStepProps {
    onNext: () => void;
}

const ACCOMMODATION_TYPES: Array<{
    type: AccommodationType;
    label: string;
    description: string;
    emoji: string;
    imageUrl: string;
}> = [
    {
        type: 'tent',
        label: 'Tent Pitches',
        description: 'Traditional camping spots for tents',
        emoji: '🏕️',
        imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=400',
    },
    {
        type: 'touring',
        label: 'Touring Pitches',
        description: 'Pitches for caravans, campervans, and motorhomes',
        emoji: '🚐',
        imageUrl: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=400',
    },
    {
        type: 'glamping',
        label: 'Glamping',
        description: 'Bell tents, yurts, pods, or safari tents',
        emoji: '⛺',
        imageUrl: 'https://images.unsplash.com/photo-1618767689160-da3fb810aad7?auto=format&fit=crop&q=80&w=400',
    },
    {
        type: 'cabin',
        label: 'Cabins & Lodges',
        description: 'Wooden cabins, lodges, or tiny homes',
        emoji: '🏠',
        imageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=400',
    },
    {
        type: 'mobile-home',
        label: 'Mobile Homes',
        description: 'Static caravans with full amenities',
        emoji: '🏡',
        imageUrl: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&q=80&w=400',
    },
];

export const PropertyTypeStep: React.FC<PropertyTypeStepProps> = ({ onNext }) => {
    const { state, updateState } = useSupplierOnboarding();

    const toggleType = (type: AccommodationType) => {
        const current = state.selectedAccommodationTypes;
        if (current.includes(type)) {
            updateState({
                selectedAccommodationTypes: current.filter(t => t !== type),
                // Reset lot count for deselected type
                lotCounts: { ...state.lotCounts, [type]: 0 },
            });
        } else {
            updateState({
                selectedAccommodationTypes: [...current, type],
            });
        }
    };

    const handleContinue = () => {
        if (state.selectedAccommodationTypes.length > 0) {
            onNext();
        }
    };

    const isSelected = (type: AccommodationType) => state.selectedAccommodationTypes.includes(type);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                    What do you offer?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Select all accommodation types available at your property
                </p>

                {/* Mobile-first: vertical list, expands to grid on larger screens */}
                <div className="space-y-3">
                    {ACCOMMODATION_TYPES.map(at => {
                        const selected = isSelected(at.type);
                        return (
                            <button
                                key={at.type}
                                onClick={() => toggleType(at.type)}
                                className={clsx(
                                    'w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all active:scale-[0.98]',
                                    selected
                                        ? 'bg-primary/10 ring-2 ring-primary'
                                        : 'bg-white dark:bg-[#1a2632] ring-1 ring-black/5 dark:ring-white/10 hover:ring-primary/50'
                                )}
                            >
                                {/* Image thumbnail */}
                                <div
                                    className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0"
                                    style={{ backgroundImage: `url("${at.imageUrl}")` }}
                                />

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{at.emoji}</span>
                                        <span className="text-base font-semibold text-[#111418] dark:text-white">
                                            {at.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                        {at.description}
                                    </p>
                                </div>

                                {/* Checkbox indicator */}
                                <div
                                    className={clsx(
                                        'w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition-all',
                                        selected
                                            ? 'bg-primary'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                    )}
                                >
                                    {selected && (
                                        <span className="material-symbols-outlined text-white text-base">
                                            check
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Selection count badge */}
                {state.selectedAccommodationTypes.length > 0 && (
                    <div className="mt-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            {state.selectedAccommodationTypes.length} type{state.selectedAccommodationTypes.length > 1 ? 's' : ''} selected
                        </span>
                    </div>
                )}
            </div>

            <div className="sticky bottom-0 pt-4 pb-6 bg-gradient-to-t from-background-light dark:from-[#101922] to-transparent -mx-6 px-6">
                <button
                    onClick={handleContinue}
                    disabled={state.selectedAccommodationTypes.length === 0}
                    className="w-full rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};
