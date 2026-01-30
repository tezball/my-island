import React from 'react';
import type { PropertyData } from '../../../pages/ListPropertyPage';

interface StepBasicInfoProps {
    data: PropertyData;
    updateData: (updates: Partial<PropertyData>) => void;
    onNext: () => void;
}

export const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ data, updateData, onNext }) => {
    const isValid = data.name.length > 3 && data.description.length > 10;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1.5">
                <label className="text-[#111418] dark:text-white text-sm font-semibold">Property Name</label>
                <input
                    className="block w-full rounded-xl border-0 bg-background-light dark:bg-background-dark py-4 px-4 text-[#111418] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1a2632] transition-all placeholder:text-gray-400"
                    placeholder="e.g. Hidden Valley Glamping"
                    value={data.name}
                    onChange={(e) => updateData({ name: e.target.value })}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[#111418] dark:text-white text-sm font-semibold">Property Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Campsite', 'Glamping', 'RV Park'].map((type) => (
                        <button
                            key={type}
                            onClick={() => updateData({ type })}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${data.type === type
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            <span className="font-bold block">{type}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[#111418] dark:text-white text-sm font-semibold">Description</label>
                <textarea
                    className="block w-full h-32 rounded-xl border-0 bg-background-light dark:bg-background-dark py-4 px-4 text-[#111418] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1a2632] transition-all placeholder:text-gray-400 resize-none"
                    placeholder="Describe your property in a few sentences..."
                    value={data.description}
                    onChange={(e) => updateData({ description: e.target.value })}
                />
            </div>

            <div className="fixed sm:absolute bottom-0 left-0 w-full bg-white dark:bg-[#1a2632] border-t border-gray-100 dark:border-white/5 p-4 pb-8 sm:pb-4">
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="w-full rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
