import React from 'react';
import clsx from 'clsx';
import { PricingConfigurator } from '../../components/supplier-onboarding';
import { useSupplierOnboarding } from '../../context/SupplierOnboardingContext';

interface AmenitiesPricingStepProps {
    onNext: () => void;
    onBack: () => void;
}

const CAMPSITE_AMENITIES = [
    { id: 'wifi', label: 'WiFi', icon: 'wifi' },
    { id: 'showers', label: 'Showers', icon: 'shower' },
    { id: 'toilets', label: 'Toilets', icon: 'wc' },
    { id: 'kitchen', label: 'Shared Kitchen', icon: 'kitchen' },
    { id: 'laundry', label: 'Laundry', icon: 'local_laundry_service' },
    { id: 'store', label: 'Camp Store', icon: 'store' },
    { id: 'playground', label: 'Playground', icon: 'toys' },
    { id: 'fishing', label: 'Fishing', icon: 'phishing' },
    { id: 'hiking', label: 'Hiking Trails', icon: 'hiking' },
    { id: 'pets', label: 'Pet Friendly', icon: 'pets' },
    { id: 'bbq', label: 'BBQ Area', icon: 'outdoor_grill' },
    { id: 'fire-pit', label: 'Communal Fire Pit', icon: 'local_fire_department' },
];

const LOT_AMENITIES = [
    { id: 'electric', label: 'Electric Hookup', icon: 'bolt' },
    { id: 'water', label: 'Water Hookup', icon: 'water_drop' },
    { id: 'picnic-table', label: 'Picnic Table', icon: 'table_restaurant' },
    { id: 'fire-pit', label: 'Private Fire Pit', icon: 'local_fire_department' },
    { id: 'bbq', label: 'Private BBQ', icon: 'outdoor_grill' },
    { id: 'shade', label: 'Shaded Pitch', icon: 'park' },
];

export const AmenitiesPricingStep: React.FC<AmenitiesPricingStepProps> = ({ onNext, onBack }) => {
    const { state, updateState } = useSupplierOnboarding();

    const toggleCampsiteAmenity = (id: string) => {
        const current = state.campsiteAmenities;
        if (current.includes(id)) {
            updateState({ campsiteAmenities: current.filter(a => a !== id) });
        } else {
            updateState({ campsiteAmenities: [...current, id] });
        }
    };

    const toggleLotAmenity = (id: string) => {
        const current = state.lotAmenities;
        if (current.includes(id)) {
            updateState({ lotAmenities: current.filter(a => a !== id) });
        } else {
            updateState({ lotAmenities: [...current, id] });
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                        Amenities & Pricing
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Select what's available and set your pricing
                    </p>
                </div>

                <div>
                    <h3 className="text-base font-bold text-[#111418] dark:text-white mb-3">
                        Shared Facilities
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Amenities available to all guests
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {CAMPSITE_AMENITIES.map(amenity => {
                            const isActive = state.campsiteAmenities.includes(amenity.id);
                            return (
                                <button
                                    key={amenity.id}
                                    onClick={() => toggleCampsiteAmenity(amenity.id)}
                                    className={clsx(
                                        'flex items-center gap-1.5 rounded-full py-2 pl-2.5 pr-3.5 transition-all active:scale-95 border',
                                        isActive
                                            ? 'border-primary bg-primary/10 hover:bg-primary/20'
                                            : 'border-gray-200 bg-white dark:bg-[#1a2632] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    )}
                                >
                                    <span
                                        className={clsx(
                                            'material-symbols-outlined text-lg',
                                            isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                                        )}
                                    >
                                        {amenity.icon}
                                    </span>
                                    <span
                                        className={clsx(
                                            'text-sm font-medium',
                                            isActive ? 'text-[#111418] dark:text-white' : 'text-gray-600 dark:text-gray-300'
                                        )}
                                    >
                                        {amenity.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-bold text-[#111418] dark:text-white mb-3">
                        Per-Lot Features
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Default features for your lots (you can customize later)
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {LOT_AMENITIES.map(amenity => {
                            const isActive = state.lotAmenities.includes(amenity.id);
                            return (
                                <button
                                    key={amenity.id}
                                    onClick={() => toggleLotAmenity(amenity.id)}
                                    className={clsx(
                                        'flex items-center gap-1.5 rounded-full py-2 pl-2.5 pr-3.5 transition-all active:scale-95 border',
                                        isActive
                                            ? 'border-primary bg-primary/10 hover:bg-primary/20'
                                            : 'border-gray-200 bg-white dark:bg-[#1a2632] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    )}
                                >
                                    <span
                                        className={clsx(
                                            'material-symbols-outlined text-lg',
                                            isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                                        )}
                                    >
                                        {amenity.icon}
                                    </span>
                                    <span
                                        className={clsx(
                                            'text-sm font-medium',
                                            isActive ? 'text-[#111418] dark:text-white' : 'text-gray-600 dark:text-gray-300'
                                        )}
                                    >
                                        {amenity.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-2">
                    <h3 className="text-base font-bold text-[#111418] dark:text-white mb-4">
                        Pricing
                    </h3>
                    <PricingConfigurator
                        basePricePerNight={state.basePricePerNight}
                        typePricing={state.typePricing}
                        lotCounts={state.lotCounts}
                        selectedTypes={state.selectedAccommodationTypes}
                        onBasePriceChange={(price) => updateState({ basePricePerNight: price })}
                        onTypePricingChange={(pricing) => updateState({ typePricing: pricing })}
                    />
                </div>
            </div>

            <div className="sticky bottom-0 pt-4 pb-6 bg-gradient-to-t from-background-light dark:from-[#101922] to-transparent -mx-6 px-6">
                <div className="flex gap-3">
                    <button
                        onClick={onBack}
                        className="flex-1 rounded-xl bg-gray-100 dark:bg-gray-800 py-4 px-4 text-center text-base font-bold text-[#111418] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-[0.99] transition-all"
                    >
                        Back
                    </button>
                    <button
                        onClick={onNext}
                        className="flex-[2] rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};
