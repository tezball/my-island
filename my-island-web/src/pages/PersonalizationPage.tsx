import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const CAMPING_STYLES = [
    { id: 'wild', label: 'Wild Camping', sub: 'Off-grid nature', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoq2-Qk63GjRLt5sO_aaqmHaZVjPckm-CzDUT-7N5bsJ2ugem4TyEc1iFrg48j-TlepvitmcGpHhqbFbwCeMGo_2PclMdINl8wg3zK176qSZ5iiFlLWSJ8uPQQjToHeb75NqAuHZcyPg5vHQ0b97U3DJLVm0pQd_zGyh-yN56BrfwSP-Kf88GUk59zCL7HOwWjrbQIqwVqtYXJs-DJ97CdkOaWsPQEzOcJdgpz4miZQR8TlFyKu1io8BiHquoxPB0790c6hEpqbY8' },
    { id: 'glam', label: 'Glamping', sub: 'Luxury stays', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvTZecbRKl4YemsQOJbL1fFuWGPv09z5sNN0oI2qxKDAIsJtPWq0dChyScrIi_qpaJelYZPVFMpQa3F61hqyyTD5IOuFnnJXBWbHW2Kq-RUKdVUi-Bo2Vgzod_1bt7AUxC-vfbo11sgUIAgznoEzLj9AHpN2ujIdvy-lzkZLOxz9SYTDCEKfV2HCICdva4F7ao41qihqAYwhr5twkGF3m3WNZ7_deDfZyc14iaCIaoHGAuhxZ8T4cTP95YpLBMOUJrLn4Q6EzPQsc' },
    { id: 'rv', label: 'Campervan', sub: 'RV & Caravan', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0GOVNxKCzmBzjsfUNiz4t6SP_pDdAySPn-3lFHFz4QbQX4jQDigAfuw3oY9-FLBlDqZbCoJ-ilRxSZTs3b2eZAYFLoedAVo6IguSgUQTJmjM0QduVuG5hK_TpN6sct0Q0OpMc3itG6E4D3IU1cxsM8VY9mOn1M9aLdx-eWVPDfXrnsGDCaAhG_f0wYmzw3pTxNQ5QwkEX02CmIJ8kpwCnpaS-3umaS8Tl2qCqWX65c2j7YdIu98y5Z6ooPbv_d6441vWas8RGEb4' },
    { id: 'family', label: 'Family Parks', sub: 'Kid friendly', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2DRwa5m90l0hEKBElpXkUjgkY00A2PSdnyG7-sb-M2xmgKA89PwrCb3CPL9sp8rYR_Hu3YT7mzew-aKijVfPQXtgHzfki2wqzYX9FyGGKtkb628kpu7lPkOsEijlAEyxthxaHUzQP1EKkbb9xx-zSURqUNj_KtVDFqXyd0RR0is_Zog22-S8x2PH7fJne-tv7kub3eFbBnFYLQ2Ii8Swudxg7eVSd0aCh_OnZmbtTqBy8G6d_99QaKTbHTxcPCTpHNUY8RZA77V0' },
];

const INTERESTS = [
    { id: 'hiking', label: 'Hiking', icon: 'hiking' },
    { id: 'fishing', label: 'Fishing', icon: 'phishing' },
    { id: 'surfing', label: 'Surfing', icon: 'surfing' },
    { id: 'historic', label: 'Historic Sites', icon: 'castle' },
    { id: 'pets', label: 'Pet Friendly', icon: 'pets' },
    { id: 'stars', label: 'Stargazing', icon: 'star' },
    { id: 'kayak', label: 'Kayaking', icon: 'kayaking' },
];

export const PersonalizationPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedStyles, setSelectedStyles] = useState<string[]>(['wild']);
    const [selectedInterests, setSelectedInterests] = useState<string[]>(['hiking', 'historic']);

    const toggleStyle = (id: string) => {
        setSelectedStyles(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#111418] dark:text-white overflow-x-hidden">
            <div className="sticky top-0 z-20 flex items-center justify-between bg-white/95 dark:bg-[#1a2632]/95 p-4 backdrop-blur-md">
                <button
                    onClick={() => navigate('/signup')}
                    className="group flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined text-[#111418] dark:text-white text-2xl">arrow_back</span>
                </button>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Step 2 of 2</span>
                    <div className="h-1 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-full w-full rounded-full bg-primary"></div>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="flex h-10 items-center justify-center rounded-full px-3 text-base font-bold text-[#111418] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    Skip
                </button>
            </div>

            <div className="flex-1 flex flex-col px-4 pb-32">
                <div className="pt-2 pb-6">
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#111418] dark:text-white md:text-4xl">
                        Your Preferences
                    </h1>
                    <p className="mt-3 text-base font-medium leading-relaxed text-gray-600 dark:text-gray-300">
                        Tell us what you love, and we'll find the perfect spot for your Irish getaway.
                    </p>
                </div>

                <div className="mb-8">
                    <h3 className="mb-4 text-lg font-bold leading-tight tracking-tight text-[#111418] dark:text-white">
                        Camping Style
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {CAMPING_STYLES.map(style => {
                            const output = selectedStyles.includes(style.id);
                            return (
                                <div
                                    key={style.id}
                                    onClick={() => toggleStyle(style.id)}
                                    className={clsx(
                                        "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#1a2632] shadow-sm transition-all active:scale-[0.98]",
                                        output ? "ring-2 ring-primary" : "ring-1 ring-black/5 dark:ring-white/10 hover:ring-primary/50"
                                    )}
                                >
                                    {output && (
                                        <div className="absolute right-3 top-3 z-10 flex size-6 items-center justify-center rounded-full bg-primary shadow-sm">
                                            <span className="material-symbols-outlined text-[16px] font-bold text-white">check</span>
                                        </div>
                                    )}
                                    <div
                                        className="aspect-[4/3] w-full bg-cover bg-center"
                                        style={{ backgroundImage: `url("${style.image}")` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                    </div>
                                    <div className="flex flex-col p-3">
                                        <span className="text-base font-bold text-[#111418] dark:text-white">{style.label}</span>
                                        <span className={clsx("text-xs font-medium", output ? "text-primary" : "text-gray-500 dark:text-gray-400")}>{style.sub}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="mb-4 text-lg font-bold leading-tight tracking-tight text-[#111418] dark:text-white">
                        Interests
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {INTERESTS.map(interest => {
                            const active = selectedInterests.includes(interest.id);
                            return (
                                <button
                                    key={interest.id}
                                    onClick={() => toggleInterest(interest.id)}
                                    className={clsx(
                                        "flex items-center gap-2 rounded-full py-2.5 pl-3 pr-4 transition-all active:scale-95 border",
                                        active
                                            ? "border-primary bg-primary/10 hover:bg-primary/20"
                                            : "border-gray-200 bg-white dark:bg-[#1a2632] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                    )}
                                >
                                    <span className={clsx("material-symbols-outlined text-[20px]", active ? "text-[#111418] dark:text-white filled" : "text-gray-500 dark:text-gray-400")}>
                                        {interest.icon}
                                    </span>
                                    <span className={clsx("text-sm font-semibold", active ? "text-[#111418] dark:text-white" : "text-[#111418] dark:text-white")}>
                                        {interest.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-30 bg-background-light dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 p-4 pb-8 safe-area-pb">
                <div className="pointer-events-none absolute -top-12 left-0 h-12 w-full bg-gradient-to-t from-background-light dark:from-background-dark to-transparent"></div>
                <button
                    onClick={() => navigate('/')}
                    className="w-full rounded-xl bg-primary py-4 text-center text-base font-bold tracking-wide text-white shadow-[0_4px_20px_rgba(43,238,108,0.25)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    Finish & Explore
                </button>
            </div>
        </div>
    );
};
