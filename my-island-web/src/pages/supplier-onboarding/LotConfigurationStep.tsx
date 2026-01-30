import React from 'react';
import { LotConfigurationPanel } from '../../components/supplier-onboarding';
import { useSupplierOnboarding } from '../../context/SupplierOnboardingContext';

interface LotConfigurationStepProps {
    onNext: () => void;
    onBack: () => void;
}

export const LotConfigurationStep: React.FC<LotConfigurationStepProps> = ({ onNext, onBack }) => {
    const { state, updateState } = useSupplierOnboarding();

    // Calculate total for selected types only
    const selectedTypesTotal = state.selectedAccommodationTypes.reduce(
        (sum, type) => sum + state.lotCounts[type],
        0
    );

    const handleContinue = () => {
        if (selectedTypesTotal > 0) {
            onNext();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                    How many lots do you have?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Set the number of each accommodation type
                </p>

                <LotConfigurationPanel
                    lotCounts={state.lotCounts}
                    selectedTypes={state.selectedAccommodationTypes}
                    onChange={(lotCounts) => updateState({ lotCounts })}
                />
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
                        disabled={selectedTypesTotal === 0}
                        className="flex-[2] rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};
