import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateInput } from '../components/ui/DateInput';

const CATEGORIES = [
    { id: 'tent', icon: 'camping', label: 'Tent Pitches' },
    { id: 'touring', icon: 'rv_hookup', label: 'Touring Pitches' },
    { id: 'glamping', icon: 'cottage', label: 'Glamping' },
    { id: 'cabin', icon: 'cabin', label: 'Cabins & Lodges' },
    { id: 'mobile-home', icon: 'home', label: 'Mobile Homes' },
];

// In a real app, these would come from an API. Valid logic for now is to show Nore Valley data.
const FEATURED = [
    {
        id: 'nore-valley-owner',
        title: 'Kilkenny',
        location: 'Kilkenny',
        count: 1,
        price: 30,
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800'
    }
];

const POPULAR = [
    {
        id: 'nore-valley-owner',
        name: "Nore Valley Park",
        location: "Kilkenny",
        distance: "2.5km",
        rating: 4.8,
        price: 30,
        tag: "Family",
        tagColor: "orange",
        image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800"
    }
];

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location) params.set('location', location);
        if (checkIn) params.set('checkIn', checkIn);
        if (checkOut) params.set('checkOut', checkOut);
        navigate(`/search?${params.toString()}`);
    };

    const handleCategoryClick = (categoryId: string) => {
        navigate(`/search?type=${categoryId}`);
    };

    const handleDestinationClick = (locationName: string) => {
        navigate(`/search?location=${encodeURIComponent(locationName)}`);
    };

    // Handle check-in date change - clear check-out if it's before new check-in
    const handleCheckInChange = (newCheckIn: string) => {
        setCheckIn(newCheckIn);
        if (checkOut && newCheckIn >= checkOut) {
            setCheckOut('');
        }
    };

    // Get minimum checkout date (day after check-in)
    const getMinCheckoutDate = () => {
        if (!checkIn) return undefined;
        const nextDay = new Date(checkIn);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay.toISOString().split('T')[0];
    };

    return (
        <main className="flex-1 flex flex-col gap-6 pt-4 pb-20">
            {/* Search Section */}
            <section className="bg-primary pb-8 pt-4 px-4 desktop:pt-8 -mt-4 mb-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">Find your next stay</h1>
                    <div className="bg-white dark:bg-[#1a2632] rounded-lg p-1 gap-1 flex flex-col md:flex-row shadow-lg border-4 border-yellow-400">
                        {/* Location Input */}
                        <div className="relative w-full flex-1 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="material-symbols-outlined text-gray-500">bed</span>
                            </div>
                            <input
                                className="block w-full p-4 pl-10 text-base text-gray-900 bg-transparent outline-none dark:text-white placeholder:text-gray-500"
                                placeholder="Where are you going?"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        {/* Check-in Date */}
                        <div className="relative w-full flex-1 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-20">
                                <span className="material-symbols-outlined text-gray-500">calendar_month</span>
                            </div>
                            <DateInput
                                className="block w-full p-4 pl-10 text-base text-gray-900 bg-transparent outline-none dark:text-white placeholder:text-gray-500"
                                placeholder="Check-in"
                                value={checkIn}
                                onChange={handleCheckInChange}
                            />
                        </div>

                        {/* Check-out Date */}
                        <div className="relative w-full flex-1 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-20">
                                <span className="material-symbols-outlined text-gray-500">calendar_month</span>
                            </div>
                            <DateInput
                                className="block w-full p-4 pl-10 text-base text-gray-900 bg-transparent outline-none dark:text-white placeholder:text-gray-500"
                                placeholder="Check-out"
                                value={checkOut}
                                onChange={setCheckOut}
                                minDate={getMinCheckoutDate()}
                            />
                        </div>

                        <button
                            onClick={handleSearch}
                            className="w-full md:w-auto bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-8 text-lg rounded-[4px] transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 px-4 pb-12">
                {/* Categories */}
                <section>
                    <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Browse by property type</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className="flex flex-col items-start gap-3 min-w-[200px] flex-1 group cursor-pointer"
                            >
                                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative">
                                    <img
                                        src={
                                            cat.id === 'tent' ? 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&q=80&w=600' :
                                                cat.id === 'touring' ? 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=600' :
                                                    cat.id === 'glamping' ? 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=600' :
                                                        cat.id === 'cabin' ? 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=600' :
                                                            'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&q=80&w=600'
                                        }
                                        alt={cat.label}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                                <span className="text-base font-bold text-[#111418] dark:text-white">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Featured Destinations */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-[#111418] dark:text-white">Trending destinations</h3>
                        <button
                            onClick={() => navigate('/search')}
                            className="text-sm font-semibold text-primary hover:underline"
                        >
                            See all
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FEATURED.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => handleDestinationClick(item.location)}
                                className="relative h-[270px] rounded-lg overflow-hidden group cursor-pointer shadow-sm"
                            >
                                <img
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={item.image}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                    <h4 className="text-white text-2xl font-bold drop-shadow-md">{item.title}</h4>
                                    <img src="https://flagcdn.com/ie.svg" alt="Ireland" className="w-6 h-4 mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Popular Homes aka "Homes guests love" */}
                <section>
                    <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Homes guests love</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {POPULAR.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(`/campsite/${item.id}`)}
                                className="flex flex-col gap-2 cursor-pointer group"
                            >
                                <div className="aspect-square rounded-lg overflow-hidden relative">
                                    <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                                    <div className="absolute top-2 right-2 bg-white rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
                                        <span className="text-sm font-bold text-[#111418]">{item.rating}</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#111418] dark:text-white line-clamp-1 group-hover:underline">{item.name}</h4>
                                    <p className="text-gray-500 text-sm">{item.location}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-r-lg rounded-tl-lg">Genius</span>
                                    </div>
                                    <div className="mt-1 text-right md:text-left">
                                        <span className="text-sm font-medium">Starting from </span>
                                        <span className="text-lg font-bold text-[#111418] dark:text-white">€{item.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};
