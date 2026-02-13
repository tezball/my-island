import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateInput } from '../components/ui/DateInput';
import { campsiteService, type CampsiteProfile } from '../services/campsiteService';
import { supplierService, type Offer, type Supplier } from '../services/supplierService';

const CATEGORIES = [
    { id: 'tent', icon: 'camping', label: 'Tent Pitches', image: 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&q=80&w=600' },
    { id: 'touring', icon: 'rv_hookup', label: 'Touring Pitches', image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=600' },
    { id: 'glamping', icon: 'cottage', label: 'Glamping', image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=600' },
    { id: 'cabin', icon: 'cabin', label: 'Cabins & Lodges', image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=600' },
    { id: 'mobile-home', icon: 'home', label: 'Mobile Homes', image: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&q=80&w=600' },
];

// County images for featured destinations
const COUNTY_IMAGES: Record<string, string> = {
    'Cork': 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&q=80&w=800',
    'Kerry': 'https://images.unsplash.com/photo-1564959130747-897fb406b9af?auto=format&fit=crop&q=80&w=800',
    'Clare': 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&q=80&w=800',
    'Galway': 'https://images.unsplash.com/photo-1569429593410-b498b3fb3387?auto=format&fit=crop&q=80&w=800',
    'Donegal': 'https://images.unsplash.com/photo-1575986767340-5d17ae767ab0?auto=format&fit=crop&q=80&w=800',
    'Wicklow': 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&q=80&w=800',
    'Mayo': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800',
    'Waterford': 'https://images.unsplash.com/photo-1558981001-792f6c0d5068?auto=format&fit=crop&q=80&w=800',
    'Kilkenny': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
    'Wexford': 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&q=80&w=800',
};

// Campsite placeholder images based on property type
const CAMPSITE_IMAGES: Record<string, string[]> = {
    'CAMPSITE': [
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?auto=format&fit=crop&q=80&w=800',
    ],
    'GLAMPING': [
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&q=80&w=800',
    ],
};

interface CountyStats {
    county: string;
    count: number;
    image: string;
}

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [campsites, setCampsites] = useState<CampsiteProfile[]>([]);
    const [counties, setCounties] = useState<string[]>([]);
    const [countyStats, setCountyStats] = useState<CountyStats[]>([]);
    const [featuredCampsites, setFeaturedCampsites] = useState<CampsiteProfile[]>([]);
    const [supplierOffers, setSupplierOffers] = useState<(Offer & { supplier: Supplier })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [campsitesData, countiesData, featuredData, offersData] = await Promise.all([
                    campsiteService.getAllCampsites(),
                    campsiteService.getCounties(),
                    campsiteService.getFeaturedCampsites(),
                    supplierService.getAllActiveOffers().catch(() => []),
                ]);
                setCampsites(campsitesData);
                setCounties(countiesData);
                setFeaturedCampsites(featuredData);
                setSupplierOffers(offersData);

                // Calculate county stats
                const stats = countiesData.map(county => ({
                    county,
                    count: campsitesData.filter(c => c.county === county).length,
                    image: COUNTY_IMAGES[county] || COUNTY_IMAGES['default'],
                })).filter(s => s.count > 0).sort((a, b) => b.count - a.count);
                setCountyStats(stats);
            } catch (error) {
                console.error('Failed to fetch campsites:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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

    const handleDestinationClick = (county: string) => {
        navigate(`/search?location=${encodeURIComponent(county)}`);
    };

    const handleCheckInChange = (newCheckIn: string) => {
        setCheckIn(newCheckIn);
        if (checkOut && newCheckIn >= checkOut) {
            setCheckOut('');
        }
    };

    const getMinCheckoutDate = () => {
        if (!checkIn) return undefined;
        const nextDay = new Date(checkIn);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay.toISOString().split('T')[0];
    };

    const getCampsiteImage = (campsite: CampsiteProfile, index: number): string => {
        const propertyType = campsite.propertyType || 'CAMPSITE';
        const images = CAMPSITE_IMAGES[propertyType] || CAMPSITE_IMAGES['CAMPSITE'];
        return images[index % images.length];
    };

    // Fallback: if no featured campsites, show top by lot count — max 4
    const displayFeaturedCampsites = (featuredCampsites.length > 0
        ? featuredCampsites
        : [...campsites].sort((a, b) => (b.lotCount || 0) - (a.lotCount || 0))
    ).slice(0, 4);

    // Deduplicate suppliers from offers, max 4
    const displaySuppliers = supplierOffers.reduce<(Offer & { supplier: Supplier })[]>((acc, o) => {
        if (acc.length >= 4) return acc;
        if (!acc.some(x => x.supplier.id === o.supplier.id)) acc.push(o);
        return acc;
    }, []);

    // Get top destinations (counties with most campsites)
    const topDestinations = countyStats.slice(0, 6);

    return (
        <main className="flex-1 flex flex-col gap-6 pt-4 pb-20">
            {/* Hero Search Section */}
            <section className="bg-primary pb-8 pt-4 px-4 desktop:pt-8 -mt-4 mb-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white leading-tight">
                        Discover Ireland's outdoors
                    </h1>
                    <p className="text-lg text-white/80 mb-6">
                        {loading ? 'Loading...' : `${campsites.length} campsites across ${counties.length} counties`}
                    </p>
                    <div className="bg-white dark:bg-[#1a2632] rounded-lg p-1 gap-1 flex flex-col md:flex-row shadow-lg border-4 border-yellow-400">
                        {/* Location Input */}
                        <div className="relative w-full flex-1 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="material-symbols-outlined text-gray-500">bed</span>
                            </div>
                            <input
                                className="block w-full p-4 pl-10 text-base text-gray-900 bg-transparent outline-none dark:text-white placeholder:text-gray-500"
                                placeholder="Try 'Galway' or 'Cork'"
                                type="text"
                                list="county-suggestions"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                            <datalist id="county-suggestions">
                                {counties.map(county => (
                                    <option key={county} value={county} />
                                ))}
                            </datalist>
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

            <div className="max-w-7xl mx-auto w-full flex flex-col gap-10 px-4 pb-12">
                {/* Explore Map CTA */}
                <button
                    onClick={() => navigate('/explore')}
                    className="w-full flex items-center justify-between bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 border border-primary/20 rounded-xl px-4 py-3 transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">map</span>
                        <span className="text-sm font-semibold text-[#111418] dark:text-white">Explore all of Ireland on the map</span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-lg group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </button>

                {/* Browse by property type */}
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
                                        src={cat.image}
                                        alt={cat.label}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                                <span className="text-base font-bold text-[#111418] dark:text-white">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Featured Campsites */}
                {!loading && displayFeaturedCampsites.length > 0 && (
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-[#111418] dark:text-white">
                                    {featuredCampsites.length > 0 ? 'Featured campsites' : 'Popular campsites'}
                                </h3>
                                {featuredCampsites.length > 0 && (
                                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                                        PROMOTED
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => navigate('/search')}
                                className="text-sm font-semibold text-primary hover:underline"
                            >
                                View all
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {displayFeaturedCampsites.map((campsite, index) => (
                                <div
                                    key={campsite.id}
                                    onClick={() => navigate(`/campsite/${campsite.id}`)}
                                    className="flex flex-col gap-2 cursor-pointer group"
                                >
                                    <div className="aspect-square rounded-lg overflow-hidden relative">
                                        <img
                                            alt={campsite.propertyName}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            src={getCampsiteImage(campsite, index)}
                                        />
                                        {campsite.isFeatured && (
                                            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">star</span>
                                                Featured
                                            </div>
                                        )}
                                        {!campsite.isFeatured && campsite.lotCount && campsite.lotCount > 5 && (
                                            <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {campsite.lotCount} pitches
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#111418] dark:text-white line-clamp-1 group-hover:underline">
                                            {campsite.propertyName}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                {campsite.town}, {campsite.county}
                                            </p>
                                            {campsite.rating && (
                                                <span className="flex items-center gap-0.5 text-sm">
                                                    <span className="material-symbols-outlined text-amber-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="font-semibold text-[#111418] dark:text-white">{campsite.rating.toFixed(1)}</span>
                                                    <span className="text-gray-400">({campsite.reviewCount})</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Featured Suppliers */}
                {!loading && displaySuppliers.length > 0 && (
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#111418] dark:text-white">Local suppliers & experiences</h3>
                            <button
                                onClick={() => navigate('/marketplace')}
                                className="text-sm font-semibold text-primary hover:underline"
                            >
                                Browse marketplace
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {displaySuppliers.map((item) => (
                                <div
                                    key={item.supplier.id}
                                    onClick={() => navigate('/marketplace')}
                                    className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer group hover:shadow-md transition-shadow"
                                >
                                    {item.imageUrl ? (
                                        <div className="aspect-[16/9] overflow-hidden">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-[16/9] bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl text-white/60">storefront</span>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            {item.supplier.logo ? (
                                                <img
                                                    src={item.supplier.logo}
                                                    alt={item.supplier.businessName}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-primary text-sm">storefront</span>
                                                </div>
                                            )}
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                                                {item.supplier.businessName}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-[#111418] dark:text-white line-clamp-1 group-hover:underline">
                                            {item.title}
                                        </h4>
                                        {item.discountPercent > 0 && (
                                            <span className="inline-block mt-2 text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                                {item.discountPercent}% off
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Trending Destinations */}
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
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-[270px] rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {topDestinations.map((dest) => (
                                <div
                                    key={dest.county}
                                    onClick={() => handleDestinationClick(dest.county)}
                                    className="relative h-[270px] rounded-lg overflow-hidden group cursor-pointer shadow-sm"
                                >
                                    <img
                                        alt={dest.county}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        src={dest.image}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h4 className="text-white text-2xl font-bold drop-shadow-md">{dest.county}</h4>
                                        <p className="text-white/80 text-sm mt-1">
                                            {dest.count} {dest.count === 1 ? 'campsite' : 'campsites'}
                                        </p>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <img src="https://flagcdn.com/ie.svg" alt="Ireland" className="w-8 h-6 rounded shadow-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* More Counties Grid */}
                {countyStats.length > 6 && (
                    <section>
                        <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-4">More destinations</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {countyStats.slice(6, 18).map((dest) => (
                                <button
                                    key={dest.county}
                                    onClick={() => handleDestinationClick(dest.county)}
                                    className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 text-left transition-colors"
                                >
                                    <div className="font-semibold text-[#111418] dark:text-white">{dest.county}</div>
                                    <div className="text-sm text-gray-500">{dest.count} {dest.count === 1 ? 'site' : 'sites'}</div>
                                </button>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};
