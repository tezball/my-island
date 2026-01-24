import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSaved } from '../context/SavedContext';
import { MOCK_DB } from '../services/mockData';

export const SavedPage: React.FC = () => {
    const navigate = useNavigate();
    const { savedLots, toggleSaved, isSaved } = useSaved();

    const campsite = MOCK_DB.users.find(u => u.userProfile.id === 'nore-valley-owner')?.userProfile;

    if (savedLots.length === 0) {
        return (
            <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-4xl text-gray-400">favorite</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">No saved places yet</h1>
                    <p className="text-gray-500 mb-6 max-w-sm">
                        Save your favorite campsites and lots to easily find them later
                    </p>
                    <button
                        onClick={() => navigate('/search')}
                        className="bg-primary hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                        Explore Campsites
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col pb-20">
            <div className="px-4 py-6">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Saved</h1>
                <p className="text-gray-500 mb-6">{savedLots.length} saved {savedLots.length === 1 ? 'place' : 'places'}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedLots.map((lot) => (
                        <div
                            key={lot.id}
                            className="bg-white dark:bg-[#1a2632] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div
                                className="aspect-[4/3] relative overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/campsite/${lot.ownerId}`)}
                            >
                                <img
                                    src={lot.imageUrl}
                                    alt={lot.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                                    <span className="font-bold text-primary">€{lot.pricePerNight}</span>
                                    <span className="text-gray-500 text-sm">/night</span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSaved(lot.id);
                                    }}
                                    className="absolute top-3 left-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                                >
                                    <span className={`material-symbols-outlined ${isSaved(lot.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}>
                                        {isSaved(lot.id) ? 'favorite' : 'favorite_border'}
                                    </span>
                                </button>
                            </div>
                            <div className="p-4">
                                <h3
                                    className="font-bold text-lg text-[#111418] dark:text-white mb-1 cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => navigate(`/campsite/${lot.ownerId}`)}
                                >
                                    {lot.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    {campsite?.name || 'Nore Valley Park'}, Kilkenny
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                    {lot.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {lot.amenities.slice(0, 3).map((amenity, i) => (
                                        <span
                                            key={i}
                                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};
