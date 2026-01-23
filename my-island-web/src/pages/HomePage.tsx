import React from 'react';
import { DateInput } from '../components/ui/DateInput';

const CATEGORIES = [
    { id: 'tents', icon: 'camping', label: 'Tents', color: 'emerald' },
    { id: 'glamping', icon: 'cottage', label: 'Glamping' },
    { id: 'rvs', icon: 'rv_hookup', label: 'RVs' },
    { id: 'cabins', icon: 'home_work', label: 'Cabins' },
    { id: 'yurts', icon: 'deck', label: 'Yurts' },
];

// In a real app, these would come from an API. Valid logic for now is to show Nore Valley data.
const FEATURED = [
    {
        id: 'nore-valley-owner', // Use actual ID for linking
        title: 'Kilkenny',
        count: 1, // Only Nore Valley
        price: 30, // Lowest price
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800' // Kilkenny/Irish Castle vibe
    }
];

const POPULAR = [
    {
        id: 'nore-valley-owner',
        name: "Nore Valley Park",
        location: "Bennettsbridge, Kilkenny",
        distance: "2.5km away",
        rating: 4.8,
        price: 30,
        tag: "Family Friendly",
        tagColor: "orange",
        image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800" // Camping scene
    }
];

// ... (inside component)

export const HomePage: React.FC = () => {
    const [checkIn, setCheckIn] = React.useState('');
    const [checkOut, setCheckOut] = React.useState('');

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
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-20">
                                    <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
                                </div>
                                <DateInput
                                    className="block w-full p-3.5 pl-10 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                                    placeholder="Check-in"
                                    value={checkIn}
                                    onChange={setCheckIn}
                                />
                            </div>
                            <div className="relative w-full flex-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-20 opacity-50">
                                    <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
                                </div>
                                <DateInput
                                    className="block w-full p-3.5 pl-10 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                                    placeholder="Check-out"
                                    value={checkOut}
                                    onChange={setCheckOut}
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
                        <div
                            key={item.id}
                            onClick={() => window.location.href = `/campsite/${item.id}`}
                            className="relative min-w-[220px] h-[280px] rounded-xl overflow-hidden group cursor-pointer shadow-md shrink-0"
                        >
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
                        <div
                            key={item.id}
                            onClick={() => window.location.href = `/campsite/${item.id}`}
                            className="flex gap-4 bg-white dark:bg-[#1a2632] rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all"
                        >
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
