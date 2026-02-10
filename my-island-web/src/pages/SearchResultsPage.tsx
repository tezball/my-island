import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import type { Lot } from '../types/booking';
import { campsiteService, type CampsiteProfile } from '../services/campsiteService';

const TYPE_LABELS: Record<string, string> = {
    tent: 'Tent Pitches',
    touring: 'Touring Pitches',
    glamping: 'Glamping',
    cabin: 'Cabins & Lodges',
    'mobile-home': 'Mobile Homes',
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
    tent: 'Pitch your tent in scenic camping grounds with access to shared facilities.',
    touring: 'Spacious pitches with electric hookup for caravans, campervans, and motorhomes.',
    glamping: 'Luxury camping experience in bell tents, yurts, pods, or safari tents.',
    cabin: 'Cozy wooden cabins and lodges with amenities for a comfortable stay.',
    'mobile-home': 'Fully equipped mobile homes (static caravans) with kitchen and living areas.',
};

interface GroupedAccommodation {
    key: string; // ownerId-type
    ownerId: string;
    ownerName: string;
    county: string;
    type: string;
    availableCount: number;
    totalCount: number;
    minPrice: number;
    maxPrice: number;
    representativeImage: string;
    amenities: string[];
    latitude?: number;
    longitude?: number;
    distance?: number;
    rating?: number | null;
    reviewCount?: number;
}

export const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const location = searchParams.get('location') || '';
    const type = searchParams.get('type') || '';
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';

    const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name'>('price-low');
    const [selectedType, setSelectedType] = useState(type);
    const [selectedCounty, setSelectedCounty] = useState('');
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [searchRadius, setSearchRadius] = useState<number>(50); // km
    const [isLoading, setIsLoading] = useState(true);
    const [campsites, setCampsites] = useState<CampsiteProfile[]>([]);
    const [allLots, setAllLots] = useState<Lot[]>([]);

    // Haversine formula to calculate distance in km
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    const handleUseLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    // Reset county filter when using location
                    setSelectedCounty('');
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location. Please check browser permissions.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    // Fetch campsites and lots from API
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Get all campsites
                const campsitesData = await campsiteService.getAllCampsites();
                setCampsites(campsitesData);

                // Get lots for each campsite
                const lotsPromises = campsitesData.map(campsite =>
                    campsiteService.getCampsiteLots(campsite.id).catch(() => [])
                );
                const lotsArrays = await Promise.all(lotsPromises);
                const allLotsData = lotsArrays.flat();
                setAllLots(allLotsData);
            } catch (error) {
                console.error('[SearchResultsPage] Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Get unique types from lots
    const availableTypes = useMemo(() => {
        const types = new Set(allLots.map(lot => lot.type));
        return Array.from(types);
    }, [allLots]);

    // Get unique counties
    const availableCounties = useMemo(() => {
        const counties = new Set(campsites.map(c => c.county).filter(Boolean));
        return Array.from(counties).sort();
    }, [campsites]);

    // Get owner info helper
    const getOwnerName = (ownerId: string) => {
        const campsite = campsites.find(c => c.id === ownerId);
        return campsite?.propertyName || campsite?.name || 'Unknown Campsite';
    };

    const getOwnerCounty = (ownerId: string) => {
        const campsite = campsites.find(c => c.id === ownerId);
        return campsite?.county || 'Ireland';
    };

    // Group lots by campsite + type
    const groupedAccommodations = useMemo(() => {
        const groups: Record<string, GroupedAccommodation> = {};

        // 1. Group lots
        allLots.forEach(lot => {
            const key = `${lot.ownerId}-${lot.type}`;

            if (!groups[key]) {
                const campsite = campsites.find(c => c.id === (lot.ownerId || ''));
                groups[key] = {
                    key,
                    ownerId: lot.ownerId || 'unknown',
                    ownerName: getOwnerName(lot.ownerId || ''),
                    county: getOwnerCounty(lot.ownerId || ''),
                    type: lot.type,
                    availableCount: 0,
                    totalCount: 0,
                    minPrice: lot.pricePerNight,
                    maxPrice: lot.pricePerNight,
                    representativeImage: lot.imageUrl || '',
                    amenities: [],
                    latitude: campsite?.latitude || undefined,
                    longitude: campsite?.longitude || undefined,
                    rating: campsite?.rating,
                    reviewCount: campsite?.reviewCount,
                };
            }

            const group = groups[key];
            group.totalCount++;
            if (lot.isAvailable) {
                group.availableCount++;
            }
            group.minPrice = Math.min(group.minPrice, lot.pricePerNight);
            group.maxPrice = Math.max(group.maxPrice, lot.pricePerNight);

            // Collect unique amenities
            if (lot.lotAmenities && Array.isArray(lot.lotAmenities)) {
                lot.lotAmenities.forEach(a => { if (!group.amenities.includes(a)) group.amenities.push(a); });
            }
            if (lot.campsiteAmenities && Array.isArray(lot.campsiteAmenities)) {
                lot.campsiteAmenities.forEach(a => { if (!group.amenities.includes(a)) group.amenities.push(a); });
            }

            // Representative image
            if (lot.isAvailable && lot.imageUrl && !groups[key].representativeImage) {
                groups[key].representativeImage = lot.imageUrl;
            }
        });

        let results = Object.values(groups);

        // 2. Filter by type
        if (selectedType) {
            results = results.filter(g => g.type === selectedType);
        }

        // 3. Filter by county (only if no user location)
        if (selectedCounty && !userLocation) {
            results = results.filter(g => g.county === selectedCounty);
        }

        // 4. Filter by Radius (if user location set)
        if (userLocation) {
            results = results.filter(g => {
                if (g.latitude && g.longitude) {
                    const dist = calculateDistance(userLocation.lat, userLocation.lng, g.latitude, g.longitude);
                    g.distance = dist;
                    return dist <= searchRadius;
                }
                return false;
            });
        }

        // 5. Filter by text search location
        if (location) {
            results = results.filter(g =>
                g.county.toLowerCase().includes(location.toLowerCase()) ||
                g.ownerName.toLowerCase().includes(location.toLowerCase())
            );
        }

        // 6. Filter available
        results = results.filter(g => g.availableCount > 0);

        // 7. Sort
        switch (sortBy) {
            case 'price-low':
                results.sort((a, b) => a.minPrice - b.minPrice);
                break;
            case 'price-high':
                results.sort((a, b) => b.maxPrice - a.maxPrice);
                break;
            case 'name':
                results.sort((a, b) => a.ownerName.localeCompare(b.ownerName));
                break;
        }

        return results;
    }, [allLots, campsites, selectedType, selectedCounty, location, sortBy, userLocation, searchRadius]);

    const formatDate = (isoDate: string) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
    };

    if (isLoading) {
        return (
            <main className="flex-1 flex flex-col pb-20">
                <div className="bg-primary text-white py-6 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl font-bold mb-2">Searching...</h1>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col pb-20">
            {/* Header */}
            <div className="bg-primary text-white py-6 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold mb-2">
                        {location ? `Campsites in ${location}` : selectedType ? `${TYPE_LABELS[selectedType] || selectedType} available` : 'All Accommodation Options'}
                    </h1>
                    <p className="text-white/80">
                        {groupedAccommodations.length} {groupedAccommodations.length === 1 ? 'option' : 'options'} found
                        {checkIn && checkOut && ` · ${formatDate(checkIn)} - ${formatDate(checkOut)}`}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full px-4 py-6">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {/* Type Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                        >
                            <option value="">All Types</option>
                            {availableTypes.map(t => (
                                <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location/County Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location:</label>
                        {!userLocation ? (
                            <div className="flex gap-2">
                                <select
                                    value={selectedCounty}
                                    onChange={(e) => setSelectedCounty(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                                >
                                    <option value="">All Counties</option>
                                    {availableCounties.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleUseLocation}
                                    className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">my_location</span>
                                    Near Me
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-primary font-medium flex items-center gap-1 bg-primary/10 px-2 py-1.5 rounded-lg border border-primary/20">
                                    <span className="material-symbols-outlined text-sm">my_location</span>
                                    Using Current Location
                                    <button
                                        onClick={() => setUserLocation(null)}
                                        className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                        <span className="material-symbols-outlined text-xs">close</span>
                                    </button>
                                </span>
                                <select
                                    value={searchRadius}
                                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                                >
                                    <option value={10}>10 km</option>
                                    <option value={20}>20 km</option>
                                    <option value={50}>50 km</option>
                                    <option value={100}>100 km</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                        >
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name</option>
                        </select>
                    </div>

                    {/* Map View */}
                    <Link
                        to={`/explore${selectedCounty ? `?county=${encodeURIComponent(selectedCounty)}` : ''}`}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors ml-auto"
                    >
                        <span className="material-symbols-outlined text-sm">map</span>
                        Map View
                    </Link>
                </div>

                {/* Results */}
                {groupedAccommodations.length === 0 ? (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No results found</h2>
                        <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                        <button
                            onClick={() => { setSelectedType(''); }}
                            className="text-primary font-semibold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groupedAccommodations.map((accom) => (
                            <div
                                key={accom.key}
                                onClick={() => navigate(`/campsite/${accom.ownerId}`)}
                                className="bg-white dark:bg-[#1a2632] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img
                                        src={accom.representativeImage || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'}
                                        alt={`${TYPE_LABELS[accom.type]} at ${accom.ownerName}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                                        {accom.minPrice === accom.maxPrice ? (
                                            <>
                                                <span className="font-bold text-primary">€{accom.minPrice}</span>
                                                <span className="text-gray-500 text-sm">/night</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-gray-500 text-sm">From </span>
                                                <span className="font-bold text-primary">€{accom.minPrice}</span>
                                                <span className="text-gray-500 text-sm">/night</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-primary/90 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                                            {accom.availableCount} {accom.availableCount === 1 ? 'spot' : 'spots'} available
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-[#111418] dark:text-white mb-1 group-hover:text-primary transition-colors">
                                        {TYPE_LABELS[accom.type] || accom.type}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            {accom.ownerName}, {accom.county}
                                            {accom.distance && (
                                                <span className="ml-2 text-primary text-xs font-semibold bg-primary/5 px-1.5 py-0.5 rounded">
                                                    {Math.round(accom.distance)} km
                                                </span>
                                            )}
                                        </p>
                                        {accom.rating && (
                                            <span className="flex items-center gap-0.5 text-sm">
                                                <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="font-semibold">{accom.rating.toFixed(1)}</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                        {TYPE_DESCRIPTIONS[accom.type] || 'Comfortable accommodation option.'}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {accom.amenities.slice(0, 3).map((amenity, i) => (
                                            <span
                                                key={i}
                                                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                        {accom.amenities.length > 3 && (
                                            <span className="text-xs text-gray-500">+{accom.amenities.length - 3} more</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};
