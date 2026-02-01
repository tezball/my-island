import React from 'react';
import clsx from 'clsx';
import { useSupplierOnboarding } from '../../context/SupplierOnboardingContext';
import type { AccommodationType } from '../../context/SupplierOnboardingContext';

interface ReviewLaunchStepProps {
    onBack: () => void;
    onSubmit: () => void;
    isLoading: boolean;
}

const LOT_TYPE_INFO: Record<AccommodationType, { label: string; icon: string }> = {
    tent: { label: 'Tent Pitches', icon: '🏕️' },
    touring: { label: 'Touring Pitches', icon: '🚐' },
    glamping: { label: 'Glamping', icon: '⛺' },
    cabin: { label: 'Cabins & Lodges', icon: '🏠' },
    'mobile-home': { label: 'Mobile Homes', icon: '🏡' },
};

const AMENITY_LABELS: Record<string, string> = {
    wifi: 'WiFi',
    showers: 'Showers',
    toilets: 'Toilets',
    kitchen: 'Shared Kitchen',
    laundry: 'Laundry',
    store: 'Camp Store',
    playground: 'Playground',
    fishing: 'Fishing',
    hiking: 'Hiking Trails',
    pets: 'Pet Friendly',
    bbq: 'BBQ Area',
    'fire-pit': 'Fire Pit',
    electric: 'Electric Hookup',
    water: 'Water Hookup',
    'picnic-table': 'Picnic Table',
    shade: 'Shaded Pitch',
};

export const ReviewLaunchStep: React.FC<ReviewLaunchStepProps> = ({ onBack, onSubmit, isLoading }) => {
    const { state } = useSupplierOnboarding();

    // Only show types that were selected and have lots configured
    const activeLotTypes = state.selectedAccommodationTypes.filter(
        type => state.lotCounts[type] > 0
    );

    const totalLots = activeLotTypes.reduce((sum, type) => sum + state.lotCounts[type], 0);

    // Generate property type label from selected types
    const getPropertyTypeLabel = () => {
        if (state.selectedAccommodationTypes.length === 0) return 'Property';
        if (state.selectedAccommodationTypes.length === 1) {
            return LOT_TYPE_INFO[state.selectedAccommodationTypes[0]].label.replace(/s$/, '');
        }
        return 'Mixed Property';
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-4">
                <div className="text-center pb-2">
                    <div className="inline-flex size-14 items-center justify-center rounded-full bg-primary/10 mb-3">
                        <span className="material-symbols-outlined text-3xl text-primary">rocket_launch</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-1">
                        Ready to Launch!
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Review your property details
                    </p>
                </div>

                {/* Cover Image */}
                {state.coverImageUrl && (
                    <div className="rounded-xl overflow-hidden">
                        <img
                            src={state.coverImageUrl}
                            alt="Property cover"
                            className="w-full h-32 object-cover"
                        />
                    </div>
                )}

                {/* Property Info */}
                <div className="rounded-xl bg-white dark:bg-[#1a2632] p-4 ring-1 ring-black/5 dark:ring-white/10">
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-0.5">
                        {state.propertyName || 'Your Property'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {state.town}, Co. {state.county}
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <span className="material-symbols-outlined text-sm">home_work</span>
                        {getPropertyTypeLabel()}
                    </span>
                </div>

                {/* Accommodation Types */}
                <div className="rounded-xl bg-white dark:bg-[#1a2632] p-4 ring-1 ring-black/5 dark:ring-white/10">
                    <h4 className="text-sm font-bold text-[#111418] dark:text-white mb-3">
                        Accommodation ({totalLots} lots)
                    </h4>
                    <div className="space-y-2">
                        {activeLotTypes.map(type => {
                            const info = LOT_TYPE_INFO[type];
                            const count = state.lotCounts[type];
                            const price = state.typePricing?.[type] ?? state.basePricePerNight;
                            return (
                                <div key={type} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">{info.icon}</span>
                                        <span className="text-sm text-[#111418] dark:text-white">
                                            {info.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {count} lots
                                        </span>
                                        <span className="text-sm font-semibold text-primary">
                                            €{price}/night
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Amenities */}
                {(state.campsiteAmenities.length > 0 || state.lotAmenities.length > 0) && (
                    <div className="rounded-xl bg-white dark:bg-[#1a2632] p-4 ring-1 ring-black/5 dark:ring-white/10">
                        <h4 className="text-sm font-bold text-[#111418] dark:text-white mb-2">
                            Amenities
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {[...state.campsiteAmenities, ...state.lotAmenities].map(id => (
                                <span
                                    key={id}
                                    className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300"
                                >
                                    {AMENITY_LABELS[id] || id}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Description */}
                {state.description && (
                    <div className="rounded-xl bg-white dark:bg-[#1a2632] p-4 ring-1 ring-black/5 dark:ring-white/10">
                        <h4 className="text-sm font-bold text-[#111418] dark:text-white mb-1">
                            Description
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                            {state.description}
                        </p>
                    </div>
                )}
            </div>

            <div className="sticky bottom-0 pt-4 pb-6 bg-gradient-to-t from-background-light dark:from-[#101922] to-transparent -mx-6 px-6">
                <div className="flex gap-3">
                    <button
                        onClick={onBack}
                        disabled={isLoading}
                        className="flex-1 rounded-xl bg-gray-100 dark:bg-gray-800 py-4 px-4 text-center text-base font-bold text-[#111418] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-[0.99] transition-all disabled:opacity-50"
                    >
                        Back
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={isLoading}
                        className={clsx(
                            'flex-[2] rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-lg shadow-primary/25',
                            isLoading && 'opacity-75 cursor-not-allowed'
                        )}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </span>
                        ) : (
                            'Launch My Property'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
