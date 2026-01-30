import React from 'react';
import { useSupplierBusinessOnboarding } from '../../context/SupplierBusinessOnboardingContext';

const BUSINESS_TYPES = [
    { id: 'food', label: 'Food & Drink', icon: 'restaurant', description: 'Restaurants, cafes, farm shops' },
    { id: 'activities', label: 'Activities & Tours', icon: 'hiking', description: 'Guided tours, water sports, hiking' },
    { id: 'rentals', label: 'Equipment Rentals', icon: 'pedal_bike', description: 'Bikes, kayaks, camping gear' },
    { id: 'wellness', label: 'Wellness & Spa', icon: 'spa', description: 'Massage, yoga, holistic services' },
    { id: 'transport', label: 'Transport', icon: 'directions_car', description: 'Airport transfers, bike delivery' },
    { id: 'retail', label: 'Local Retail', icon: 'shopping_bag', description: 'Souvenirs, local crafts, supplies' },
];

interface BusinessTypeStepProps {
    onNext: () => void;
}

export const BusinessTypeStep: React.FC<BusinessTypeStepProps> = ({ onNext }) => {
    const { state, updateState } = useSupplierBusinessOnboarding();

    const handleSelect = (typeId: string) => {
        updateState({ businessType: typeId });
    };

    const canProceed = state.businessType !== '';

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                    What type of business do you have?
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Select the category that best describes your business
                </p>
            </div>

            <div className="flex-1 space-y-3">
                {BUSINESS_TYPES.map((type) => {
                    const isSelected = state.businessType === type.id;
                    return (
                        <button
                            key={type.id}
                            onClick={() => handleSelect(type.id)}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                                isSelected
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                        >
                            <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${
                                isSelected
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}>
                                <span className="material-symbols-outlined text-2xl">{type.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-bold text-base ${
                                    isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-[#111418] dark:text-white'
                                }`}>
                                    {type.label}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {type.description}
                                </p>
                            </div>
                            {isSelected && (
                                <span className="material-symbols-outlined text-purple-500 text-2xl">check_circle</span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="pt-4 mt-auto">
                <button
                    onClick={onNext}
                    disabled={!canProceed}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                        canProceed
                            ? 'bg-purple-500 hover:bg-purple-600'
                            : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                    }`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};
