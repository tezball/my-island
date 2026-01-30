import React from 'react';
import { useSupplierBusinessOnboarding } from '../../context/SupplierBusinessOnboardingContext';

const BUSINESS_TYPE_LABELS: Record<string, string> = {
    'food': 'Food & Drink',
    'activities': 'Activities & Tours',
    'rentals': 'Equipment Rentals',
    'wellness': 'Wellness & Spa',
    'transport': 'Transport',
    'retail': 'Local Retail',
};

const SERVICE_LABELS: Record<string, string> = {
    'delivery': 'Delivery available',
    'pickup': 'Pickup available',
    'online': 'Online booking',
    'discount': 'Camper discounts',
    'group': 'Group bookings',
    'family': 'Family friendly',
};

interface BusinessReviewStepProps {
    onBack: () => void;
    onSubmit: () => void;
    isLoading: boolean;
}

export const BusinessReviewStep: React.FC<BusinessReviewStepProps> = ({ onBack, onSubmit, isLoading }) => {
    const { state } = useSupplierBusinessOnboarding();

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                    Review your business
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Make sure everything looks good before launching
                </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-4">
                {/* Business Header */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">storefront</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{state.businessName || 'Your Business'}</h2>
                            <p className="text-purple-100 text-sm">
                                {BUSINESS_TYPE_LABELS[state.businessType] || 'Business Type'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Details Card */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-4">
                    <h3 className="font-bold text-[#111418] dark:text-white text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-gray-400">info</span>
                        Business Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                            <p className="text-sm font-medium text-[#111418] dark:text-white">
                                {state.town}, {state.county}
                            </p>
                        </div>
                        {state.contactPhone && (
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                                <p className="text-sm font-medium text-[#111418] dark:text-white">
                                    {state.contactPhone}
                                </p>
                            </div>
                        )}
                    </div>

                    {state.website && (
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Website</p>
                            <p className="text-sm font-medium text-purple-500 truncate">
                                {state.website}
                            </p>
                        </div>
                    )}

                    {state.description && (
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Description</p>
                            <p className="text-sm text-[#111418] dark:text-white leading-relaxed">
                                {state.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Services */}
                {state.servicesOffered.length > 0 && (
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                        <h3 className="font-bold text-[#111418] dark:text-white text-sm flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-lg text-gray-400">checklist</span>
                            Services Offered
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {state.servicesOffered.map((serviceId) => (
                                <span
                                    key={serviceId}
                                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
                                >
                                    {SERVICE_LABELS[serviceId] || serviceId}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* What's Next */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50">
                    <h3 className="font-bold text-purple-700 dark:text-purple-300 text-sm mb-2">
                        What happens next?
                    </h3>
                    <ul className="space-y-2 text-sm text-purple-600 dark:text-purple-400">
                        <li className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            Your business will be listed in nearby campsite areas
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            Create special offers and discounts for campers
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            Access your supplier dashboard to manage bookings
                        </li>
                    </ul>
                </div>
            </div>

            <div className="pt-4 mt-auto flex gap-3">
                <button
                    onClick={onBack}
                    disabled={isLoading}
                    className="flex-1 py-4 rounded-xl font-bold text-[#111418] dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="flex-1 py-4 rounded-xl font-bold text-white bg-purple-500 hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                            Creating...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-lg">rocket_launch</span>
                            Launch Business
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
