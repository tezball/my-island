import React from 'react';
import { Link } from 'react-router-dom';

interface StepIntroProps {
    onStart: () => void;
}

export const StepIntro: React.FC<StepIntroProps> = ({ onStart }) => {
    return (
        <div className="relative mx-auto flex h-screen max-w-2xl w-full flex-col overflow-hidden bg-white dark:bg-[#1a2632] shadow-xl sm:rounded-xl sm:h-[90vh] sm:my-[5vh]">
            <header className="flex items-center justify-between px-4 py-3 shrink-0">
                <Link to="/" className="flex size-10 items-center justify-center rounded-full text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-2xl">close</span>
                </Link>
                <div className="size-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar px-6 flex flex-col items-center justify-center text-center pb-20">
                <div className="size-32 bg-lime-100 dark:bg-lime-900/30 rounded-full flex items-center justify-center mb-8">
                    <span className="material-symbols-outlined text-6xl text-lime-600 dark:text-lime-500">campaign</span>
                </div>

                <h1 className="text-[#111418] dark:text-white text-3xl font-bold tracking-tight mb-4">
                    List your campsite on MyIsland
                </h1>

                <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-md mb-8">
                    Join hundreds of hosts sharing their unique outdoor spaces. It's free to list and takes just a few minutes.
                </p>

                <div className="w-full max-w-sm space-y-4 text-left mb-12">
                    <div className="flex items-start gap-4">
                        <span className="text-2xl font-bold text-gray-200 dark:text-gray-700">1</span>
                        <div>
                            <h3 className="font-bold text-[#111418] dark:text-white">Tell us about your place</h3>
                            <p className="text-gray-500 text-sm">Share some basic details and location.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-2xl font-bold text-gray-200 dark:text-gray-700">2</span>
                        <div>
                            <h3 className="font-bold text-[#111418] dark:text-white">Make it stand out</h3>
                            <p className="text-gray-500 text-sm">Add photos and list your amenities.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-2xl font-bold text-gray-200 dark:text-gray-700">3</span>
                        <div>
                            <h3 className="font-bold text-[#111418] dark:text-white">Finish and publish</h3>
                            <p className="text-gray-500 text-sm">Set your price and start welcoming guests.</p>
                        </div>
                    </div>
                </div>
            </main>

            <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-[#1a2632] border-t border-gray-100 dark:border-white/5 p-4 pb-8">
                <button
                    onClick={onStart}
                    className="w-full rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};
