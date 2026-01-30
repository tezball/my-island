import React, { useState } from 'react';
import { useSupplierOnboarding } from '../../context/SupplierOnboardingContext';

interface PropertyDetailsStepProps {
    onNext: () => void;
    onBack: () => void;
}

const IRISH_COUNTIES = [
    'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Derry', 'Donegal',
    'Down', 'Dublin', 'Fermanagh', 'Galway', 'Kerry', 'Kildare', 'Kilkenny',
    'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath',
    'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Tyrone',
    'Waterford', 'Westmeath', 'Wexford', 'Wicklow'
];

const SAMPLE_IMAGES = [
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=800',
];

export const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({ onNext, onBack }) => {
    const { state, updateState } = useSupplierOnboarding();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!state.propertyName.trim()) {
            newErrors.propertyName = 'Property name is required';
        }
        if (!state.county) {
            newErrors.county = 'Please select a county';
        }
        if (!state.town.trim()) {
            newErrors.town = 'Town or area is required';
        }
        if (!state.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (state.description.trim().length < 50) {
            newErrors.description = 'Please write at least 50 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (validate()) {
            onNext();
        }
    };

    const selectRandomImage = () => {
        const randomImage = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
        updateState({ coverImageUrl: randomImage });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-5">
                <div>
                    <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                        Property Details
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Tell us about your property and where it's located
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-1.5">
                            Property Name *
                        </label>
                        <input
                            type="text"
                            value={state.propertyName}
                            onChange={(e) => updateState({ propertyName: e.target.value })}
                            placeholder="e.g., Nore Valley Park"
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-[#111418] dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                        {errors.propertyName && (
                            <p className="mt-1 text-sm text-red-500">{errors.propertyName}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-1.5">
                                County *
                            </label>
                            <select
                                value={state.county}
                                onChange={(e) => updateState({ county: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-[#111418] dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Select county</option>
                                {IRISH_COUNTIES.map(county => (
                                    <option key={county} value={county}>{county}</option>
                                ))}
                            </select>
                            {errors.county && (
                                <p className="mt-1 text-sm text-red-500">{errors.county}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-1.5">
                                Town/Area *
                            </label>
                            <input
                                type="text"
                                value={state.town}
                                onChange={(e) => updateState({ town: e.target.value })}
                                placeholder="e.g., Bennettsbridge"
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-[#111418] dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                            {errors.town && (
                                <p className="mt-1 text-sm text-red-500">{errors.town}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-1.5">
                            Description *
                        </label>
                        <textarea
                            value={state.description}
                            onChange={(e) => updateState({ description: e.target.value })}
                            placeholder="Describe your property, its surroundings, and what makes it special..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-[#111418] dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                        />
                        <div className="flex justify-between mt-1">
                            {errors.description ? (
                                <p className="text-sm text-red-500">{errors.description}</p>
                            ) : (
                                <span className="text-xs text-gray-400">Minimum 50 characters</span>
                            )}
                            <span className="text-xs text-gray-400">
                                {state.description.length} characters
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-1.5">
                            Cover Photo
                        </label>
                        <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4">
                            {state.coverImageUrl ? (
                                <div className="relative rounded-lg overflow-hidden">
                                    <img
                                        src={state.coverImageUrl}
                                        alt="Cover"
                                        className="w-full h-40 object-cover"
                                    />
                                    <button
                                        onClick={() => updateState({ coverImageUrl: '' })}
                                        className="absolute top-2 right-2 size-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">close</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={selectRandomImage}
                                    className="w-full h-32 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:border-primary hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                                    <span className="text-sm font-medium">Add a cover photo</span>
                                </button>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                            You can add more photos later from your dashboard
                        </p>
                    </div>
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
                        onClick={handleContinue}
                        className="flex-[2] rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};
