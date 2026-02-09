import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supplierService, type Supplier, type Offer } from '../services/supplierService';
import { getImages, type EntityImage } from '../services/imageService';
import { CampsiteImageGallery } from '../components/ui/CampsiteImageGallery';
import { CampsiteMap } from '../components/ui/CampsiteMap';
import { SupplierReviewsSection } from '../components/review/SupplierReviewsSection';

const CATEGORY_LABELS: Record<string, string> = {
    FOOD: 'Food & Drink',
    ACTIVITIES: 'Activities',
    GEAR: 'Camping Gear',
    ATTRACTIONS: 'Attractions',
    TRANSPORT: 'Transport',
};

const CATEGORY_ICONS: Record<string, string> = {
    FOOD: 'restaurant',
    ACTIVITIES: 'hiking',
    GEAR: 'backpack',
    ATTRACTIONS: 'attractions',
    TRANSPORT: 'directions_car',
};

export const SupplierDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [images, setImages] = useState<EntityImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (!id) return;
        loadData(id);
    }, [id]);

    const loadData = async (supplierId: string) => {
        setIsLoading(true);
        try {
            const [supplierData, offersData, imagesData] = await Promise.all([
                supplierService.getPublicSupplier(supplierId),
                supplierService.getPublicSupplierOffers(supplierId).catch(() => []),
                getImages('SUPPLIER', supplierId).catch(() => []),
            ]);
            setSupplier(supplierData);
            setOffers(offersData);
            setImages(imagesData);
        } catch (error) {
            console.error('Failed to load supplier:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaim = async (offer: Offer) => {
        if (!user) {
            navigate('/signin');
            return;
        }
        setClaimingId(offer.id);
        try {
            await supplierService.claimOffer(offer.id, user.id, user.name || 'Guest');
            setShowSuccessModal(true);
            setSelectedOffer(null);
        } catch (error) {
            console.error('Failed to claim offer:', error);
        } finally {
            setClaimingId(null);
        }
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!supplier) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <span className="material-symbols-outlined text-5xl text-gray-400 mb-4">storefront</span>
                <h2 className="text-xl font-semibold mb-2">Supplier not found</h2>
                <Link to="/marketplace" className="text-primary hover:underline">Browse marketplace</Link>
            </div>
        );
    }

    const primaryImage = images.find(i => i.isPrimary)?.url || images[0]?.url;

    return (
        <main className="flex-1 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Hero */}
            <div className="h-64 md:h-80 relative bg-gray-900">
                {primaryImage ? (
                    <img
                        src={primaryImage}
                        alt={supplier.businessName}
                        className="w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-emerald-700" />
                )}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-6xl mx-auto flex items-end gap-4">
                        {supplier.logo && (
                            <img
                                src={supplier.logo}
                                alt={`${supplier.businessName} logo`}
                                className="size-16 md:size-20 rounded-xl border-2 border-white shadow-lg object-cover bg-white"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        )}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl md:text-5xl font-bold text-white">{supplier.businessName}</h1>
                                {supplier.isVerified && (
                                    <span className="material-symbols-outlined text-blue-400 text-2xl" title="Verified">verified</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-gray-200">
                                <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-sm">
                                    <span className="material-symbols-outlined text-sm">{CATEGORY_ICONS[supplier.category] || 'store'}</span>
                                    {CATEGORY_LABELS[supplier.category] || supplier.category}
                                </span>
                                {supplier.location && (
                                    <span className="flex items-center gap-1 text-sm">
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        {supplier.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
                {/* About */}
                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">About</h2>
                    {supplier.description && (
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-6">
                            {supplier.description}
                        </p>
                    )}

                    {/* Contact details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {supplier.contactPhone && (
                            <a
                                href={`tel:${supplier.contactPhone}`}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-primary">call</span>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                                    <p className="font-medium text-[#111418] dark:text-white text-sm">{supplier.contactPhone}</p>
                                </div>
                            </a>
                        )}
                        {supplier.contactEmail && (
                            <a
                                href={`mailto:${supplier.contactEmail}`}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-primary">mail</span>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-medium text-[#111418] dark:text-white text-sm">{supplier.contactEmail}</p>
                                </div>
                            </a>
                        )}
                        {supplier.website && (
                            <a
                                href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-primary">language</span>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Website</p>
                                    <p className="font-medium text-[#111418] dark:text-white text-sm">{supplier.website}</p>
                                </div>
                            </a>
                        )}
                    </div>

                    {/* Inline Map */}
                    {supplier.latitude && supplier.longitude && (
                        <div className="mt-6">
                            <CampsiteMap
                                latitude={supplier.latitude}
                                longitude={supplier.longitude}
                                name={supplier.businessName}
                            />
                            {supplier.location && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base">location_on</span>
                                    {supplier.location}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Text-only location fallback when no coordinates */}
                    {!(supplier.latitude && supplier.longitude) && supplier.location && (
                        <div className="mt-6 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span className="material-symbols-outlined text-primary">location_on</span>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                                <p className="font-medium text-[#111418] dark:text-white text-sm">{supplier.location}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Image Gallery */}
                {images.length > 0 && (
                    <div className="bg-white dark:bg-[#1a2632] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">Photos</h2>
                        <CampsiteImageGallery images={images} campsiteName={supplier.businessName} embedded />
                    </div>
                )}

                {/* Active Offers */}
                {offers.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">Active Offers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {offers.filter(o => o.active).map((offer) => (
                                <div
                                    key={offer.id}
                                    onClick={() => setSelectedOffer(offer)}
                                    className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                                >
                                    {offer.imageUrl && (
                                        <div className="h-40 bg-gray-200 relative overflow-hidden">
                                            <img
                                                src={offer.imageUrl}
                                                alt={offer.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 bg-primary text-white font-bold px-3 py-1 rounded-lg shadow-sm">
                                                {offer.discountPercent === 0 ? 'FREE' : `${offer.discountPercent}% OFF`}
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-[#111418] dark:text-white mb-2 group-hover:text-primary transition-colors">
                                            {offer.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                            {offer.description}
                                        </p>
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
                                        <div className="w-full bg-gray-100 dark:bg-gray-800 text-center py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            View Details
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                <SupplierReviewsSection
                    supplierId={supplier.id}
                    supplierRating={supplier.rating}
                    reviewCount={supplier.reviewCount}
                />

                {/* Back link */}
                <div className="pt-4">
                    <Link
                        to="/marketplace"
                        className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Marketplace
                    </Link>
                </div>
            </div>

            {/* Offer Details Modal */}
            {selectedOffer && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSelectedOffer(null)}
                >
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
                                    <span className="font-semibold text-primary">{supplier.businessName}</span>
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
                                    onClick={() => handleClaim(selectedOffer)}
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
        </main>
    );
};
