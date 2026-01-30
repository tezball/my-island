import React from 'react';
import type { PropertyData } from '../../../pages/ListPropertyPage';

interface StepCapacityProps {
    data: PropertyData;
    updateData: (updates: Partial<PropertyData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export const StepCapacity: React.FC<StepCapacityProps> = ({ data, updateData, onNext, onBack }) => {

    const handleIncrement = () => {
        updateData({ capacity: data.capacity + 1 });
    };

    const handleDecrement = () => {
        if (data.capacity > 1) {
            updateData({ capacity: data.capacity - 1 });
        }
    };

    return (
        <div className="space-y-8">
            {/* Interactive Capacity Counter */}
            <div className="flex flex-col items-center justify-center py-8 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <h3 className="text-[#111418] dark:text-white text-lg font-bold mb-6">Total Guest Capacity</h3>

                <div className="flex items-center gap-8">
                    <button
                        onClick={handleDecrement}
                        disabled={data.capacity <= 1}
                        className="size-16 rounded-full bg-white dark:bg-[#1a2632] shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <span className="material-symbols-outlined text-3xl">remove</span>
                    </button>

                    <span className="text-6xl font-black text-[#111418] dark:text-white w-24 text-center tabular-nums tracking-tighter">
                        {data.capacity}
                    </span>

                    <button
                        onClick={handleIncrement}
                        className="size-16 rounded-full bg-white dark:bg-[#1a2632] shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                        <span className="material-symbols-outlined text-3xl">add</span>
                    </button>
                </div>

                <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm font-medium">Guests per night</p>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-4">
                <h3 className="text-[#111418] dark:text-white text-base font-bold">What is allowed?</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ToggleCard
                        icon="camping"
                        label="Tents"
                        checked={data.allowsTents}
                        onChange={(checked) => updateData({ allowsTents: checked })}
                    />
                    <ToggleCard
                        icon="rv_hookup"
                        label="RVs & Caravans"
                        checked={data.allowsRVs}
                        onChange={(checked) => updateData({ allowsRVs: checked })}
                    />
                    <ToggleCard
                        icon="cottage"
                        label="Glamping Pods"
                        checked={data.allowsGlamping}
                        onChange={(checked) => updateData({ allowsGlamping: checked })}
                    />
                </div>
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

const ToggleCard: React.FC<{
    icon: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}> = ({ icon, label, checked, onChange }) => (
    <div
        onClick={() => onChange(!checked)}
        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${checked
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
    >
        <div className="flex items-center gap-3">
            <div className={`size-10 rounded-full flex items-center justify-center transition-colors ${checked ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                }`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <span className={`font-bold transition-colors ${checked ? 'text-primary' : 'text-[#111418] dark:text-white'}`}>
                {label}
            </span>
        </div>
        <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${checked ? 'bg-primary border-primary' : 'bg-transparent border-gray-300 dark:border-gray-600'
            }`}>
            {checked && <span className="material-symbols-outlined text-white text-sm font-bold">check</span>}
        </div>
    </div>
);
