import React from 'react';
import { useSupplierBusinessOnboarding } from '../../context/SupplierBusinessOnboardingContext';

const COUNTIES = [
    'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Derry', 'Donegal',
    'Down', 'Dublin', 'Fermanagh', 'Galway', 'Kerry', 'Kildare', 'Kilkenny',
    'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath',
    'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Tyrone',
    'Waterford', 'Westmeath', 'Wexford', 'Wicklow'
];

const SERVICE_OPTIONS = [
    { id: 'delivery', label: 'Delivery available', icon: 'local_shipping' },
    { id: 'pickup', label: 'Pickup available', icon: 'store' },
    { id: 'online', label: 'Online booking', icon: 'calendar_month' },
    { id: 'discount', label: 'Camper discounts', icon: 'percent' },
    { id: 'group', label: 'Group bookings', icon: 'groups' },
    { id: 'family', label: 'Family friendly', icon: 'family_restroom' },
];

interface BusinessDetailsStepProps {
    onNext: () => void;
    onBack: () => void;
}

export const BusinessDetailsStep: React.FC<BusinessDetailsStepProps> = ({ onNext, onBack }) => {
    const { state, updateState } = useSupplierBusinessOnboarding();

    const toggleService = (serviceId: string) => {
        const current = state.servicesOffered;
        if (current.includes(serviceId)) {
            updateState({ servicesOffered: current.filter(s => s !== serviceId) });
        } else {
            updateState({ servicesOffered: [...current, serviceId] });
        }
    };

    const canProceed = state.businessName.trim() !== '' && state.county !== '' && state.town.trim() !== '';

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                    Tell us about your business
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Help campers find and connect with you
                </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-4">
                {/* Business Name */}
                <div>
                    <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                        Business Name *
                    </label>
                    <input
                        type="text"
                        value={state.businessName}
                        onChange={(e) => updateState({ businessName: e.target.value })}
                        placeholder="e.g., Murphy's Farm Shop"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                            County *
                        </label>
                        <select
                            value={state.county}
                            onChange={(e) => updateState({ county: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select</option>
                            {COUNTIES.map(county => (
                                <option key={county} value={county}>{county}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                            Town *
                        </label>
                        <input
                            type="text"
                            value={state.town}
                            onChange={(e) => updateState({ town: e.target.value })}
                            placeholder="e.g., Killarney"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                        Description
                    </label>
                    <textarea
                        value={state.description}
                        onChange={(e) => updateState({ description: e.target.value })}
                        placeholder="Tell campers what makes your business special..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                </div>

                {/* Contact */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={state.contactPhone}
                            onChange={(e) => updateState({ contactPhone: e.target.value })}
                            placeholder="+353 ..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                            Website
                        </label>
                        <input
                            type="url"
                            value={state.website}
                            onChange={(e) => updateState({ website: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* Services */}
                <div>
                    <label className="block text-sm font-medium text-[#111418] dark:text-white mb-3">
                        Services Offered
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {SERVICE_OPTIONS.map((service) => {
                            const isSelected = state.servicesOffered.includes(service.id);
                            return (
                                <button
                                    key={service.id}
                                    onClick={() => toggleService(service.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                                        isSelected
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">{service.icon}</span>
                                    {service.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="pt-4 mt-auto flex gap-3">
                <button
                    onClick={onBack}
                    className="flex-1 py-4 rounded-xl font-bold text-[#111418] dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!canProceed}
                    className={`flex-1 py-4 rounded-xl font-bold text-white transition-all ${
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
