import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_DB } from '../services/mockData';

const TYPE_LABELS: Record<string, string> = {
    tent: 'Tents',
    rv: 'RVs',
    cabin: 'Cabins',
    lodge: 'Lodges',
    glamping: 'Glamping',
    'mobile-home': 'Mobile Homes',
};

export const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const location = searchParams.get('location') || '';
    const type = searchParams.get('type') || '';
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';

    const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name'>('price-low');
    const [selectedType, setSelectedType] = useState(type);

    // Get unique types from lots
    const availableTypes = useMemo(() => {
        const types = new Set(MOCK_DB.lots.map(lot => lot.type));
        return Array.from(types);
    }, []);

    // Filter and sort lots
    const filteredLots = useMemo(() => {
        let results = [...MOCK_DB.lots];

        // Filter by type
        if (selectedType) {
            results = results.filter(lot => lot.type === selectedType);
        }

        // Filter by availability
        results = results.filter(lot => lot.isAvailable);

        // Sort
        switch (sortBy) {
            case 'price-low':
                results.sort((a, b) => a.pricePerNight - b.pricePerNight);
                break;
            case 'price-high':
                results.sort((a, b) => b.pricePerNight - a.pricePerNight);
                break;
            case 'name':
                results.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        return results;
    }, [selectedType, sortBy]);

    // Get campsite info (Nore Valley)
    const campsite = MOCK_DB.users.find(u => u.userProfile.id === 'nore-valley-owner')?.userProfile;

    const formatDate = (isoDate: string) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
    };

    return (
        <main className="flex-1 flex flex-col pb-20">
            {/* Header */}
            <div className="bg-primary text-white py-6 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold mb-2">
                        {location ? `Campsites in ${location}` : selectedType ? `${TYPE_LABELS[selectedType] || selectedType} available` : 'All Available Lots'}
                    </h1>
                    <p className="text-white/80">
                        {filteredLots.length} {filteredLots.length === 1 ? 'result' : 'results'} found
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
                </div>

                {/* Results */}
                {filteredLots.length === 0 ? (
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
                        {filteredLots.map((lot) => (
                            <div
                                key={lot.id}
                                onClick={() => navigate(`/campsite/${lot.ownerId}`)}
                                className="bg-white dark:bg-[#1a2632] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img
                                        src={lot.imageUrl}
                                        alt={lot.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                                        <span className="font-bold text-primary">€{lot.pricePerNight}</span>
                                        <span className="text-gray-500 text-sm">/night</span>
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-primary/90 text-white text-xs font-semibold px-2 py-1 rounded-lg capitalize">
                                            {lot.type === 'mobile-home' ? 'Mobile Home' : lot.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-[#111418] dark:text-white mb-1 group-hover:text-primary transition-colors">
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
                                        {lot.amenities.length > 3 && (
                                            <span className="text-xs text-gray-500">+{lot.amenities.length - 3} more</span>
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
