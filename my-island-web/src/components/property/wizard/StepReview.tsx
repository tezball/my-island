import React from 'react';
import type { PropertyData } from '../../../pages/ListPropertyPage';

interface StepReviewProps {
    data: PropertyData;
    onSubmit: () => void;
    onBack: () => void;
    isLoading: boolean;
}

export const StepReview: React.FC<StepReviewProps> = ({ data, onSubmit, onBack, isLoading }) => {
    return (
        <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/5 space-y-4">
                <div className="flex items-start gap-4">
                    <div className="size-16 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-gray-400">image</span>
                    </div>
                    <div>
                        <h3 className="text-[#111418] dark:text-white font-bold text-lg">{data.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{data.type} • {data.city}</p>
                    </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-700 w-full" />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Capacity</label>
                        <p className="text-[#111418] dark:text-white font-medium">{data.capacity} Guests</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Price</label>
                        <p className="text-[#111418] dark:text-white font-medium">€{data.pricePerNight} / night</p>
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Address</label>
                    <p className="text-[#111418] dark:text-white font-medium">{data.address}, {data.city}</p>
                </div>

                <div>
                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                        {data.amenities.map(a => (
                            <span key={a} className="px-2 py-1 bg-white dark:bg-white/10 rounded-md text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-white/5">
                                {a}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 bg-lime-50 dark:bg-lime-900/20 rounded-xl flex gap-3 text-lime-800 dark:text-lime-200 border border-lime-100 dark:border-lime-900/30">
                <span className="material-symbols-outlined shrink-0 text-lime-600">verified</span>
                <p className="text-sm font-medium">Everything looks great! You can edit these details anytime from your supplier dashboard.</p>
            </div>

            <div className="fixed sm:absolute bottom-0 left-0 w-full bg-white dark:bg-[#1a2632] border-t border-gray-100 dark:border-white/5 p-4 pb-8 sm:pb-4 flex gap-4">
                <button
                    onClick={onBack}
                    disabled={isLoading}
                    className="flex-1 rounded-xl bg-gray-100 dark:bg-gray-800 py-4 px-4 text-center text-base font-bold text-[#111418] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-display disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="flex-[2] rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                            Publishing...
                        </>
                    ) : (
                        'Publish Listing'
                    )}
                </button>
            </div>
        </div>
    );
};
