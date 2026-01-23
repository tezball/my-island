import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { campsiteService, type CampsiteProfile } from '../services/campsiteService';
import { type Lot } from '../services/adminService';
import { BookingModal } from '../components/booking/BookingModal';

export const CampsiteDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [campsite, setCampsite] = useState<CampsiteProfile | null>(null);
    const [lots, setLots] = useState<Lot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

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

                {/* Available Offers / Lots */}
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">Available Offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lots.map((lot) => (
                        <div key={lot.id} className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                {lot.imageUrl && (
                                    <img src={lot.imageUrl} alt={lot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                )}
                                <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                                    €{lot.pricePerNight} <span className="text-xs font-normal">/ night</span>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-[#111418] dark:text-white text-xl">{lot.name}</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                    {lot.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {lot.amenities.slice(0, 3).map((amenity, idx) => (
                                        <span key={idx} className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">
                                            {amenity}
                                        </span>
                                    ))}
                                    {lot.amenities.length > 3 && (
                                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">
                                            +{lot.amenities.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <button
                                    className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                                    onClick={() => setSelectedLot(lot)}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedLot && (
                <BookingModal
                    lot={selectedLot}
                    isOpen={!!selectedLot}
                    onClose={() => setSelectedLot(null)}
                />
            )}
        </main>
    );
};
