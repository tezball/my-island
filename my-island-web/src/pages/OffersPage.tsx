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

    // Modal State
    const [selectedOffer, setSelectedOffer] = useState<OfferWithSupplier | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    const handleClaim = async (e?: React.MouseEvent) => {
        e?.stopPropagation(); // Prevent closing details modal if clicked inside

        if (!user) {
            navigate('/signin');
            return;
        }

        const offerToClaim = selectedOffer;
        if (!offerToClaim) return;

        setClaimingId(offerToClaim.id);
        try {
            await supplierService.claimOffer(offerToClaim.id, user.id, user.name || 'Guest');
            setShowSuccessModal(true);
            setSelectedOffer(null); // Close details modal
        } catch (error) {
            console.error('Failed to claim offer:', error);
        } finally {
            setClaimingId(null);
        }
    };

    const openOfferDetails = (offer: OfferWithSupplier) => {
        setSelectedOffer(offer);
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
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${categoryFilter === category
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
                            onClick={() => openOfferDetails(offer)}
                            className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                        >
                            {/* Offer Image */}
                            {offer.imageUrl && (
                                <div className="h-40 bg-gray-200 relative overflow-hidden">
                                    <img
                                        src={offer.imageUrl}
                                        alt={offer.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 hover:opacity-90"
                                    />
                                    <div className="absolute top-3 right-3 bg-primary text-white font-bold px-3 py-1 rounded-lg shadow-sm">
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
                                    <Link
                                        to={`/marketplace/supplier/${offer.supplier.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-sm text-gray-500 hover:text-primary hover:underline transition-colors"
                                    >
                                        {offer.supplier.businessName}
                                    </Link>
                                </div>

                                {/* Title & Description */}
                                <h3 className="font-bold text-lg text-[#111418] dark:text-white mb-2 group-hover:text-primary transition-colors">
                                    {offer.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                    {offer.description}
                                </p>

                                {/* Validity & Claims */}
                                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">event</span>
                                        Until {formatDate(offer.validUntil)}
                                    </span>
                                    {offer.maxClaims && (
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">group</span>
                                            {offer.maxClaims - offer.claimCount} left
                                        </span>
                                    )}
                                </div>

                                {/* View Details Button (Visual Cue) */}
                                <div className="w-full bg-gray-100 dark:bg-gray-800 text-center py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    View Details
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Offer Details Modal */}
            {selectedOffer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedOffer(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>

                        <div className="max-h-[85vh] overflow-y-auto">
                            {selectedOffer.imageUrl && (
                                <div className="h-56 bg-gray-200 relative">
                                    <img
                                        src={selectedOffer.imageUrl}
                                        alt={selectedOffer.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-4 left-4 bg-primary text-white font-bold px-3 py-1 rounded-lg shadow-lg">
                                        {selectedOffer.discountPercent === 0 ? 'FREE' : `${selectedOffer.discountPercent}% OFF`}
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                                    <Link
                                        to={`/marketplace/supplier/${selectedOffer.supplier.id}`}
                                        className="font-semibold text-primary hover:underline"
                                    >
                                        {selectedOffer.supplier.businessName}
                                    </Link>
                                    <span>•</span>
                                    <span>{CATEGORY_LABELS[selectedOffer.category]}</span>
                                </div>

                                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
                                    {selectedOffer.title}
                                </h2>

                                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-sm mb-6">
                                    <p className="whitespace-pre-wrap">{selectedOffer.description}</p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                                        <div>
                                            <p className="font-medium text-[#111418] dark:text-white">Valid Period</p>
                                            <p>{formatDate(selectedOffer.validFrom)} - {formatDate(selectedOffer.validUntil)}</p>
                                        </div>
                                    </div>
                                    {selectedOffer.terms && (
                                        <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-lg">description</span>
                                            <div>
                                                <p className="font-medium text-[#111418] dark:text-white">Terms & Conditions</p>
                                                <p className="text-xs">{selectedOffer.terms}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleClaim()}
                                    disabled={claimingId === selectedOffer.id}
                                    className="w-full bg-primary hover:bg-emerald-600 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-lg"
                                >
                                    {claimingId === selectedOffer.id ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Claiming...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">add_circle</span>
                                            Claim This Offer
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">check_circle</span>
                        </div>
                        <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-2">Offer Claimed!</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            This voucher has been added to your wallet. Use it when visiting the supplier.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate('/vouchers')}
                                className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                View My Wallet
                            </button>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#111418] dark:text-white font-semibold py-3 rounded-xl transition-colors"
                            >
                                Continue Browsing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

