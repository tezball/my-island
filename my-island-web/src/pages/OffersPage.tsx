import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supplierService, type Offer, type Supplier } from '../services/supplierService';
import { Link, useNavigate } from 'react-router-dom';

type OfferWithSupplier = Offer & { supplier: Supplier };

const CATEGORY_ICONS: Record<string, string> = {
    FOOD: 'restaurant',
    ACTIVITIES: 'hiking',
    GEAR: 'backpack',
    ATTRACTIONS: 'attractions',
    TRANSPORT: 'directions_car'
};

const CATEGORY_LABELS: Record<string, string> = {
    FOOD: 'Food & Drink',
    ACTIVITIES: 'Activities',
    GEAR: 'Camping Gear',
    ATTRACTIONS: 'Attractions',
    TRANSPORT: 'Transport'
};

export const OffersPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [offers, setOffers] = useState<OfferWithSupplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const data = await supplierService.getAllActiveOffers();
                setOffers(data);
            } catch (error) {
                console.error('Failed to fetch offers:', error);
            }
            setIsLoading(false);
        };

        fetchOffers();
    }, []);

    const handleClaim = async (offer: OfferWithSupplier) => {
        if (!user) {
            navigate('/signin');
            return;
        }

        setClaimingId(offer.id);
        try {
            await supplierService.claimOffer(offer.id, user.id, user.name || 'Guest');
            // Redirect to vouchers page after claiming
            navigate('/vouchers');
        } catch (error) {
            console.error('Failed to claim offer:', error);
            setClaimingId(null);
        }
    };

    const filteredOffers = offers.filter(o => {
        if (categoryFilter === 'all') return true;
        return o.category === categoryFilter;
    });

    const categories = ['all', ...new Set(offers.map(o => o.category))];

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IE', {
            day: 'numeric',
            month: 'short'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-emerald-600 text-white py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold">Local Offers</h1>
                <p className="text-white/80 mt-1">Exclusive discounts from local suppliers</p>
                {user && (
                    <Link
                        to="/vouchers"
                        className="inline-flex items-center gap-2 mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">local_offer</span>
                        View My Vouchers
                    </Link>
                )}
                </div>
            </div>

            {/* Category Filter */}
            <div className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex gap-2 min-w-max">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setCategoryFilter(category)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                                categoryFilter === category
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {category !== 'all' && (
                                <span className="material-symbols-outlined text-sm">
                                    {CATEGORY_ICONS[category] || 'store'}
                                </span>
                            )}
                            {category === 'all' ? 'All Offers' : CATEGORY_LABELS[category] || category}
                        </button>
                    ))}
                    </div>
                </div>
            </div>

            {filteredOffers.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] p-4 max-w-7xl mx-auto">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-4xl text-gray-400">search_off</span>
                    </div>
                    <h2 className="text-xl font-semibold text-[#111418] dark:text-white mb-2">No offers available</h2>
                    <p className="text-gray-500 text-center">Check back later for new deals</p>
                </div>
            ) : (
                <div className="px-4 py-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                    {filteredOffers.map((offer) => (
                        <div
                            key={offer.id}
                            className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
                        >
                            {/* Offer Image */}
                            {offer.imageUrl && (
                                <div className="h-40 bg-gray-200 relative overflow-hidden">
                                    <img
                                        src={offer.imageUrl}
                                        alt={offer.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3 bg-primary text-white font-bold px-3 py-1 rounded-lg">
                                        {offer.discountPercent === 0 ? 'FREE' : `${offer.discountPercent}% OFF`}
                                    </div>
                                </div>
                            )}

                            <div className="p-4">
                                {/* Supplier & Category */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-primary text-sm">
                                        {CATEGORY_ICONS[offer.category] || 'store'}
                                    </span>
                                    <span className="text-sm text-gray-500">{offer.supplier.businessName}</span>
                                </div>

                                {/* Title & Description */}
                                <h3 className="font-bold text-lg text-[#111418] dark:text-white mb-2">
                                    {offer.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                    {offer.description}
                                </p>

                                {/* Validity & Claims */}
                                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">event</span>
                                        Valid {formatDate(offer.validFrom)} - {formatDate(offer.validUntil)}
                                    </span>
                                    {offer.maxClaims && (
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">group</span>
                                            {offer.maxClaims - offer.claimCount} left
                                        </span>
                                    )}
                                </div>

                                {/* Claim Button */}
                                <button
                                    onClick={() => handleClaim(offer)}
                                    disabled={claimingId === offer.id}
                                    className="w-full bg-primary hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    {claimingId === offer.id ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Claiming...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-sm">add</span>
                                            Claim Offer
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
