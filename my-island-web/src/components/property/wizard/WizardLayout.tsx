import React from 'react';
import { Link } from 'react-router-dom';

interface WizardLayoutProps {
    children: React.ReactNode;
    currentStep: number;
    totalSteps: number;
    title: string;
    subtitle?: string;
    onBack?: () => void;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({
    children,
    currentStep,
    totalSteps,
    title,
    subtitle,
    onBack,
}) => {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="relative mx-auto flex h-screen max-w-2xl w-full flex-col overflow-hidden bg-white dark:bg-[#1a2632] shadow-xl sm:rounded-xl sm:h-[90vh] sm:my-[5vh]">
            <header className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-gray-100 dark:border-white/5">
                {onBack ? (
                    <button
                        onClick={onBack}
                        className="flex size-10 items-center justify-center rounded-full text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                    </button>
                ) : (
                    <Link
                        to="/"
                        className="flex size-10 items-center justify-center rounded-full text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </Link>
                )}

                <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                    List your property
                </h2>

                <div className="size-10"></div>
            </header>

            <div className="px-6 py-4 shrink-0">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[#111418] dark:text-gray-200 text-sm font-medium">
                        Step {currentStep} of {totalSteps}
                    </p>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-2 pb-24">
                <div className="mb-6">
                    <h1 className="text-[#111418] dark:text-white text-[28px] leading-9 font-bold tracking-tight mb-2">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>

                {children}
            </main>
        </div>
    );
};
