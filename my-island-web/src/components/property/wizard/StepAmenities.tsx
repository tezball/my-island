import React from 'react';
import type { PropertyData } from '../../../pages/ListPropertyPage';

interface StepAmenitiesProps {
    data: PropertyData;
    updateData: (updates: Partial<PropertyData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const AMENITIES_LIST = [
    { id: 'Water', icon: 'water_drop', label: 'Drinking Water' },
    { id: 'Wifi', icon: 'wifi', label: 'Wifi' },
    { id: 'Firepit', icon: 'local_fire_department', label: 'Firepit Allowed' },
    { id: 'Toilets', icon: 'wc', label: 'Toilets' },
    { id: 'Showers', icon: 'shower', label: 'Showers' },
    { id: 'Electricity', icon: 'electrical_services', label: 'Electric Hookup' },
    { id: 'Kitchen', icon: 'kitchen', label: 'Communal Kitchen' },
    { id: 'Pets', icon: 'pets', label: 'Pet Friendly' },
    { id: 'Parking', icon: 'local_parking', label: 'On-site Parking' },
    { id: 'Shop', icon: 'store', label: 'Camp Shop' },
    { id: 'Laundry', icon: 'local_laundry_service', label: 'Laundry' },
    { id: 'Playground', icon: 'child_care', label: 'Playground' },
];

export const StepAmenities: React.FC<StepAmenitiesProps> = ({ data, updateData, onNext, onBack }) => {

    const toggleAmenity = (id: string) => {
        const current = data.amenities;
        const next = current.includes(id)
            ? current.filter(a => a !== id)
            : [...current, id];
        updateData({ amenities: next });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITIES_LIST.map((item) => {
                    const isSelected = data.amenities.includes(item.id);
                    return (
                        <button
                            key={item.id}
                            onClick={() => toggleAmenity(item.id)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 gap-3 transition-all aspect-square sm:aspect-auto sm:h-32 ${isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-3xl ${isSelected ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
                                }`}>
                                {item.icon}
                            </span>
                            <span className={`text-sm font-semibold text-center ${isSelected ? 'text-primary' : 'text-[#111418] dark:text-white'
                                }`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
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
                    className="flex-[2] rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
