import React from 'react';
import type { PropertyData } from '../../../pages/ListPropertyPage';

interface StepLocationProps {
    data: PropertyData;
    updateData: (updates: Partial<PropertyData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export const StepLocation: React.FC<StepLocationProps> = ({ data, updateData, onNext, onBack }) => {
    const isValid = data.address.length > 5 && data.city.length > 2;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1.5">
                <label className="text-[#111418] dark:text-white text-sm font-semibold">Street Address</label>
                <div className="relative">
                    <input
                        className="block w-full rounded-xl border-0 bg-background-light dark:bg-background-dark py-4 px-4 text-[#111418] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1a2632] transition-all placeholder:text-gray-400 pr-10"
                        placeholder="123 Green Valley Rd"
                        value={data.address}
                        onChange={(e) => updateData({ address: e.target.value })}
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">location_on</span>
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[#111418] dark:text-white text-sm font-semibold">City / Town</label>
                <input
                    className="block w-full rounded-xl border-0 bg-background-light dark:bg-background-dark py-4 px-4 text-[#111418] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1a2632] transition-all placeholder:text-gray-400"
                    placeholder="e.g. Killarney"
                    value={data.city}
                    onChange={(e) => updateData({ city: e.target.value })}
                />
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex gap-3 text-blue-700 dark:text-blue-200">
                <span className="material-symbols-outlined shrink-0">info</span>
                <p className="text-sm">We'll show your approximate location to guests until they book. Your exact address is only shared once a reservation is confirmed.</p>
            </div>

            <div className="fixed sm:absolute bottom-0 left-0 w-full bg-white dark:bg-[#1a2632] border-t border-gray-100 dark:border-white/5 p-4 pb-8 sm:pb-4 flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 rounded-xl bg-gray-100 dark:bg-gray-800 py-4 px-4 text-center text-base font-bold text-[#111418] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-display"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="flex-[2] rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
