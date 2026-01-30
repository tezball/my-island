import React from 'react';
import clsx from 'clsx';

interface OnboardingProgressProps {
    currentStep: number;
    totalSteps: number;
    labels?: string[];
}

const DEFAULT_LABELS = [
    'Property Type',
    'Details',
    'Lots',
    'Amenities',
    'Review',
];

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ currentStep, totalSteps, labels }) => {
    const stepLabels = labels || DEFAULT_LABELS;
    return (
        <div className="flex items-center justify-between gap-2">
            {Array.from({ length: totalSteps }, (_, i) => {
                const stepNum = i + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                    <React.Fragment key={stepNum}>
                        <div className="flex flex-col items-center flex-1">
                            <div
                                className={clsx(
                                    'flex size-8 items-center justify-center rounded-full text-sm font-bold transition-all',
                                    isCompleted && 'bg-primary text-white',
                                    isCurrent && 'bg-primary/20 text-primary ring-2 ring-primary',
                                    !isCompleted && !isCurrent && 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                )}
                            >
                                {isCompleted ? (
                                    <span className="material-symbols-outlined text-lg">check</span>
                                ) : (
                                    stepNum
                                )}
                            </div>
                            <span
                                className={clsx(
                                    'mt-1.5 text-[10px] font-medium hidden sm:block',
                                    isCurrent ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                                )}
                            >
                                {stepLabels[i]}
                            </span>
                        </div>
                        {stepNum < totalSteps && (
                            <div
                                className={clsx(
                                    'h-0.5 flex-1 -mt-4 sm:-mt-6 transition-all',
                                    stepNum < currentStep ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
