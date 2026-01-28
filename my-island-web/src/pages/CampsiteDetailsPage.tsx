import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { campsiteService, type CampsiteProfile } from '../services/campsiteService';
import { type Lot } from '../services/adminService';
import { BookingModal } from '../components/booking/BookingModal';
import { useSaved } from '../context/SavedContext';

// Type configuration with display names and images
const TYPE_CONFIG: Record<string, { label: string; pluralLabel: string; icon: string; defaultImage: string; description: string }> = {
    tent: {
        label: 'Tent Spot',
        pluralLabel: 'Tent Spots',
        icon: 'camping',
        defaultImage: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800',
        description: 'Pitch your tent in our scenic camping grounds with access to shared facilities.'
    },
    rv: {
        label: 'Caravan/RV Pitch',
        pluralLabel: 'Caravan/RV Pitches',
        icon: 'rv_hookup',
        defaultImage: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800',
        description: 'Spacious pitches with electric hookup for caravans and motorhomes.'
    },
    cabin: {
        label: 'Cabin',
        pluralLabel: 'Cabins',
        icon: 'cabin',
        defaultImage: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800',
        description: 'Cozy wooden cabins with basic amenities for a comfortable stay.'
    },
    lodge: {
        label: 'Lodge',
        pluralLabel: 'Lodges',
        icon: 'house',
        defaultImage: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=800',
        description: 'Spacious lodges with full amenities for the whole family.'
    },
    'mobile-home': {
        label: 'Mobile Home',
        pluralLabel: 'Mobile Homes',
        icon: 'home',
        defaultImage: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&q=80&w=800',
        description: 'Fully equipped mobile homes with kitchen and living areas.'
    }
};

interface AccommodationType {
    type: string;
    lots: Lot[];
    availableCount: number;
    minPrice: number;
    maxPrice: number;
    representativeImage: string;
    representativeLot: Lot; // The lot to use for booking
    commonAmenities: string[];
}

export const CampsiteDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [campsite, setCampsite] = useState<CampsiteProfile | null>(null);
    const [lots, setLots] = useState<Lot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
    const [selectedTypeLabel, setSelectedTypeLabel] = useState<string>('');
    const [selectedMinPrice, setSelectedMinPrice] = useState<number | undefined>(undefined);
    const { isSaved, toggleSaved } = useSaved();

    useEffect(() => {
        if (!id) return;
        loadData(id);
    }, [id]);

    const loadData = async (campsiteId: string) => {
        setIsLoading(true);
        try {
            const profile = await campsiteService.getCampsiteById(campsiteId);
            if (!profile) {
                console.error('Campsite not found');
                return;
            }
            setCampsite(profile);
            const campsiteLots = await campsiteService.getCampsiteLots(campsiteId);
            setLots(campsiteLots);
        } catch (error) {
            console.error('Failed to load campsite data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Group lots by type into accommodation types
    const accommodationTypes: AccommodationType[] = React.useMemo(() => {
        const groups: Record<string, Lot[]> = {};

        lots.forEach(lot => {
            if (!groups[lot.type]) {
                groups[lot.type] = [];
            }
            groups[lot.type].push(lot);
        });

        return Object.entries(groups).map(([type, typeLots]) => {
            const availableLots = typeLots.filter(l => l.isAvailable);
            const prices = typeLots.map(l => l.pricePerNight);

            // Collect all unique amenities across lots of this type (combine lot and campsite amenities)
            const allAmenities = new Set<string>();
            typeLots.forEach(lot => {
                lot.lotAmenities.forEach(amenity => allAmenities.add(amenity));
                lot.campsiteAmenities.forEach(amenity => allAmenities.add(amenity));
            });

            // Use the first available lot as representative, or first lot if none available
            const representativeLot = availableLots[0] || typeLots[0];

            return {
                type,
                lots: typeLots,
                availableCount: availableLots.length,
                minPrice: Math.min(...prices),
                maxPrice: Math.max(...prices),
                representativeImage: representativeLot?.imageUrl || TYPE_CONFIG[type]?.defaultImage || '',
                representativeLot,
                commonAmenities: Array.from(allAmenities).slice(0, 4)
            };
        }).sort((a, b) => a.minPrice - b.minPrice);
    }, [lots]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!campsite) {
        return <div className="p-8 text-center">Campsite not found.</div>;
    }

    const getTypeConfig = (type: string) => TYPE_CONFIG[type] || {
        label: type,
        pluralLabel: type + 's',
        icon: 'bed',
        defaultImage: '',
        description: 'Comfortable accommodation option.'
    };

    return (
        <main className="flex-1 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Hero Header */}
            <div className="h-64 md:h-80 relative bg-gray-900">
                <img
                    src={campsite.avatarUrl || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=1600'}
                    alt={campsite.name}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{campsite.name}</h1>
                        <p className="text-gray-200 text-lg flex items-center gap-2">
                            <span className="material-symbols-outlined">location_on</span>
                            Bennettsbridge, Kilkenny
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* About Section */}
                <div className="mb-10 bg-white dark:bg-[#1a2632] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">About the Campsite</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Welcome to {campsite.name}! Experience a family-friendly atmosphere with a pet farm, river walks, and fun activities.
                        We offer a variety of accommodation options to suit every camper, from scenic tent spots to comfortable wooden lodges.
                    </p>
                    <div className="flex gap-4 mt-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-primary">pets</span> Pet Friendly
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-primary">wifi</span> Free WiFi
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-primary">shower</span> Hot Showers
                        </div>
                    </div>
                </div>

                {/* Accommodation Options */}
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">Accommodation Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accommodationTypes.map((accom) => {
                        const config = getTypeConfig(accom.type);
                        const isAvailable = accom.availableCount > 0;

                        return (
                            <div
                                key={accom.type}
                                className={`bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden group hover:shadow-md transition-shadow ${!isAvailable ? 'opacity-60' : ''}`}
                            >
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    <img
                                        src={accom.representativeImage}
                                        alt={config.pluralLabel}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSaved(accom.representativeLot.id);
                                        }}
                                        className="absolute top-2 left-2 p-2 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
                                        title={isSaved(accom.representativeLot.id) ? 'Remove from saved' : 'Save for later'}
                                    >
                                        <span className={`material-symbols-outlined ${isSaved(accom.representativeLot.id) ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {isSaved(accom.representativeLot.id) ? 'favorite' : 'favorite_border'}
                                        </span>
                                    </button>
                                    <div className={`absolute top-2 right-2 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm ${isAvailable ? 'bg-primary text-white' : 'bg-gray-500 text-white'}`}>
                                        {isAvailable ? `${accom.availableCount} ${accom.availableCount === 1 ? 'spot' : 'spots'} available` : 'Fully booked'}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-symbols-outlined text-primary">{config.icon}</span>
                                        <h3 className="font-bold text-[#111418] dark:text-white text-xl">{config.pluralLabel}</h3>
                                    </div>

                                    <p className="text-primary font-semibold text-lg mb-2">
                                        {accom.minPrice === accom.maxPrice ? (
                                            <>€{accom.minPrice}<span className="text-gray-500 font-normal text-sm"> / night</span></>
                                        ) : (
                                            <>From €{accom.minPrice}<span className="text-gray-500 font-normal text-sm"> / night</span></>
                                        )}
                                    </p>

                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                        {config.description}
                                    </p>

                                    {accom.commonAmenities.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {accom.commonAmenities.map((amenity, idx) => (
                                                <span key={idx} className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {isAvailable ? (
                                        <button
                                            className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                                            onClick={() => {
                                                setSelectedLot(accom.representativeLot);
                                                setSelectedTypeLabel(config.label);
                                                setSelectedMinPrice(accom.minPrice);
                                            }}
                                        >
                                            Book Now
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold py-3 px-4 rounded-xl cursor-not-allowed"
                                        >
                                            Not Available
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedLot && (
                <BookingModal
                    lot={selectedLot}
                    isOpen={!!selectedLot}
                    onClose={() => setSelectedLot(null)}
                    typeLabel={selectedTypeLabel}
                    minPrice={selectedMinPrice}
                />
            )}
        </main>
    );
};
