import React from 'react';

const CATEGORIES = [
    { id: 'tents', icon: 'camping', label: 'Tents', color: 'emerald' },
    { id: 'glamping', icon: 'cottage', label: 'Glamping' },
    { id: 'rvs', icon: 'rv_hookup', label: 'RVs' },
    { id: 'cabins', icon: 'home_work', label: 'Cabins' },
    { id: 'yurts', icon: 'deck', label: 'Yurts' },
];

const FEATURED = [
    {
        id: 1,
        title: 'Kerry',
        count: 34,
        price: 45,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJIVrDvo19VFG3xvddZlVssAwGcpQGF_qmqoSXpb5vpq8WSUjXuamD_VNkdJgIK3GyM3N8YOQAjNlC2qOQPYfBZsahwA6Ip6dAKUiIftCQ1S5C2Uk2vi-_NITv3uhlVxl-2tCZFezMvajW0OnN1ZvGpaXDyHEdTm9bo5dNaK6qh1qVFAFa4Aqkubd_46gctHFNihFoCQViQe6xysko6d-YjQ3sVZEcO5nrJ9igwK418SLlYh927CzjC3Ye7yhxjKJwt7Au2jHModQ'
    },
    {
        id: 2,
        title: 'Donegal',
        count: 21,
        price: 38,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmogU6m90mxdocw_g09oKBi5oMh65R370s9cAd9LuSZOfxIaeHsstmh1q8XRkW2lAqgV09qr0Zom_ssZ8OSlocPvFjl98prj9PWwjkSR0IF3XPXvxDkAPaYZjNyKwYaxtBiavIX507C-kdvkb4gzMCIZ61zB_Z1bT2k1ZwfJbPxpySYRFL0EJ03P_xQ05c_Q0-1nvsJBStWD9q0zfsBMoNImzqOUdXEd09Z4vNR2M1xH5zGV-k3EyQQbLRlc_d7oNcliBn2ojg8cU'
    },
    {
        id: 3,
        title: 'Wicklow',
        count: 18,
        price: 50,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_OBLcpVSxsHZDTdYj91D0JNdKC1OvihLGpwzamLkmtqBC0dZSWIQxiVRNQ8HZ1W9rSGSeToKDIuBQvm-DpRu0FNMkaB664rswKLH6L9qRX62cKmBg17oToarf0qAukNwsDyv2YtkePMDHC4JWmKKtpOFOvYbWtzFz_UqE4fA-yDHBqMpZ7woe0NqkEjJKooOjaYzZ6KCrrzMs8a85QAWPcGdkjb2JfvgxDETnWg_C7HuQxKl3l580cI-4wWQdQPo_oNll6-dVz2Q'
    }
];

const POPULAR = [
    {
        id: 1,
        name: "Eagle's Point Glamping",
        location: "West Cork",
        distance: "12km away",
        rating: 4.9,
        price: 85,
        tag: "Eco-Friendly",
        tagColor: "emerald",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFftBBxDGhqAhjH6r6_gj7s1c0D8K88wI2MjOfYlX6j9o2pXlWVtwBlR2WFgk44cqKb0LdWz0e5uTB8Q4RmdvSj9pd41dpLVCIufT49IDZVjgZMuv8YWmYBzJi0vWgn-yeN9yF8XOlOcDIJ1TtxoAE2Ktcy04pa-C145xqYhnoJvjAF1UIp63R4aPHzrt74RGeqzT0rGMJQ5VHR9Mdhg41-MxDx5ffe8yQxqQ1h_0Ua4iALOj0iAvYo3UffBF8qJb93lZPbS9gO7w"
    },
    {
        id: 2,
        name: "Lakeside Caravan Park",
        location: "Killarney",
        distance: "24km away",
        rating: 4.5,
        price: 42,
        tag: "Lake View",
        tagColor: "blue",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuClt1fzyMfwTZwbovIbonkF_J_9wfRm6ucDm3GmfX1oejYnv-AFTj83Avft2Sfksw2pTNRXN_H2rSVYUSEx-6OMynSg3ZyuYmcoWd1ezDQdtlu6-amCoKnlqD8SJU28M_f1zlWdilRXlouVtsRNogef4dlKkH90Z88E3_H8EL6l_AgwHo_firJS6FS4rR_En2Uty5N3_Jjz9K4fYV1kpES2YRNUvuCGiKAdhCuVX95exW0U1RkjK42MnsGRKm4nmLYVWHFfRpqWZq8"
    }
];

export const HomePage: React.FC = () => {
    return (
        <main className="flex-1 flex flex-col gap-6 pt-4 pb-20">
            {/* Search Section */}
            <section className="px-4">
                <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 border border-gray-100 dark:border-gray-800">
                    <h1 className="text-2xl font-bold mb-4 text-[#111418] dark:text-white">Where to next?</h1>
                    <div className="flex flex-col gap-3">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400">search</span>
                            </div>
                            <input
                                className="block w-full p-3.5 pl-10 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary outline-none"
                                placeholder="Try 'Ring of Kerry' or 'Wicklow'"
                                type="text"
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="relative w-full flex-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
                                </div>
                                <input
                                    className="block w-full p-3.5 pl-10 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                                    placeholder="Check-in"
                                    type="text"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => e.target.type = 'text'}
                                />
                            </div>
                            <div className="relative w-full flex-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
                                </div>
                                <input
                                    className="block w-full p-3.5 pl-10 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                                    placeholder="Check-out"
                                    type="text"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => e.target.type = 'text'}
                                />
                            </div>
                        </div>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400">group</span>
                            </div>
                            <input
                                className="block w-full p-3.5 pl-10 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                                placeholder="2 Adults, 0 Children"
                                type="number"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400">unfold_more</span>
                            </div>
                        </div>
                        <button className="w-full mt-2 bg-primary hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">search</span>
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="pl-4">
                <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-3">Campsite Types</h3>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pr-4 pb-2">
                    {CATEGORIES.map((cat, idx) => (
                        <button
                            key={cat.id}
                            className={`flex flex-col items-center gap-2 min-w-[72px] group cursor-pointer ${idx === 0 ? '' : 'opacity-70 hover:opacity-100 transition-opacity'}`}
                        >
                            <div className={`size-14 rounded-full flex items-center justify-center shadow-sm ${idx === 0
                                    ? 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-500'
                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group-hover:border-primary/50'
                                }`}>
                                <span className={`material-symbols-outlined ${idx === 0
                                        ? 'text-emerald-600 dark:text-emerald-400 filled'
                                        : 'text-gray-600 dark:text-gray-300'
                                    }`}>{cat.icon}</span>
                            </div>
                            <span className={`text-xs font-semibold ${idx === 0
                                    ? 'text-emerald-700 dark:text-emerald-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>{cat.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Featured Destinations */}
            <section className="pl-4">
                <div className="flex justify-between items-center pr-4 mb-3">
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white">Featured Destinations</h3>
                    <a className="text-sm font-semibold text-primary" href="#">See all</a>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pr-4 pb-4">
                    {FEATURED.map(item => (
                        <div key={item.id} className="relative min-w-[220px] h-[280px] rounded-xl overflow-hidden group cursor-pointer shadow-md shrink-0">
                            <img
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                src={item.image}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-4 w-full">
                                <h4 className="text-white text-xl font-bold">{item.title}</h4>
                                <p className="text-gray-200 text-sm mt-1 mb-2">{item.count} Campsites</p>
                                <span className="inline-block bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">From €{item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Popular Near You */}
            <section className="px-4 pb-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white">Popular Near You</h3>
                </div>
                <div className="flex flex-col gap-4">
                    {POPULAR.map(item => (
                        <div key={item.id} className="flex gap-4 bg-white dark:bg-[#1a2632] rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                                <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                                <div className="absolute top-1 right-1 bg-white/90 dark:bg-black/60 rounded px-1 flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-yellow-500 text-[10px] filled">star</span>
                                    <span className="text-[10px] font-bold">{item.rating}</span>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 justify-center">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-[#111418] dark:text-white line-clamp-1">{item.name}</h4>
                                    <span className="material-symbols-outlined text-gray-400 text-lg">favorite</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400 text-xs">
                                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                                    <span>{item.location} • {item.distance}</span>
                                </div>
                                <div className="flex items-end justify-between mt-2">
                                    <div className="flex items-center gap-1">
                                        <span className={`bg-${item.tagColor}-100 dark:bg-${item.tagColor}-900 text-${item.tagColor}-700 dark:text-${item.tagColor}-300 text-[10px] font-bold px-1.5 py-0.5 rounded`}>
                                            {item.tag}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-primary">€{item.price}</span>
                                        <span className="text-xs text-gray-500">/night</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};
