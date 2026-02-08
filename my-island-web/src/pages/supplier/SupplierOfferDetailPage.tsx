import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    supplierService,
    type Offer,
    type OfferClaim,
    type OfferCategory,
    type Supplier
} from '../../services/supplierService';
import { OfferFormModal } from '../../components/supplier/offers/OfferFormModal';

const CATEGORY_LABELS: Record<OfferCategory, string> = {
    FOOD: 'Food & Drink',
    ACTIVITIES: 'Activities',
    GEAR: 'Gear Rental',
    ATTRACTIONS: 'Attractions',
    TRANSPORT: 'Transport'
};

type ClaimFilter = 'all' | 'claimed' | 'redeemed' | 'expired';

export const SupplierOfferDetailPage: React.FC = () => {
    const { offerId } = useParams<{ offerId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [offer, setOffer] = useState<Offer | null>(null);
    const [claims, setClaims] = useState<OfferClaim[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [claimFilter, setClaimFilter] = useState<ClaimFilter>('all');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [redeemingClaimId, setRedeemingClaimId] = useState<string | null>(null);
    const [isTesting, setIsTesting] = useState(false);
    const [resettingClaimId, setResettingClaimId] = useState<string | null>(null);
    const [supplier, setSupplier] = useState<Supplier | null>(null);

    const supplierId = user?.id ?? '';

    useEffect(() => {
        loadData();
    }, [offerId]);

    const loadData = async () => {
        if (!offerId) return;

        setIsLoading(true);
        try {
            const [offerData, claimsData, supplierData] = await Promise.all([
                supplierService.getOfferById(offerId),
                supplierService.getOfferClaims(offerId),
                supplierService.getSupplierProfile(supplierId.replace('supplier-', '') + '-owner') // Fetch supplier
            ]);
            setOffer(offerData);
            setClaims(claimsData);
            // Get supplier from offers data if profile fetch fails
            if (!supplierData && offerData) {
                const allOffers = await supplierService.getAllActiveOffers();
                const offerWithSupplier = allOffers.find(o => o.id === offerData.id);
                if (offerWithSupplier) {
                    setSupplier(offerWithSupplier.supplier);
                }
            } else {
                // Fallback: create a minimal supplier object
                setSupplier({
                    id: supplierId,
                    userId: 'green-acres-supplier',
                    businessName: 'Green Acres Farm Shop',
                    description: '',
                    logo: '',
                    category: 'FOOD',
                    location: '',
                    contactEmail: '',
                    contactPhone: '',
                    active: true,
                    createdAt: ''
                });
            }
        } catch (error) {
            console.error('Failed to load offer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (offerData: Omit<Offer, 'id' | 'claimCount' | 'createdAt'>) => {
        if (!offer) return;
        await supplierService.updateOffer(offer.id, offerData);
        await loadData();
        setIsModalOpen(false);
    };

    const handleToggleActive = async () => {
        if (!offer) return;
        setIsToggling(true);
        try {
            await supplierService.updateOffer(offer.id, { active: !offer.active });
            await loadData();
        } catch (error) {
            console.error('Failed to toggle offer:', error);
        } finally {
            setIsToggling(false);
        }
    };

    const handleDelete = async () => {
        if (!offer) return;
        if (!confirm('Are you sure you want to delete this offer? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await supplierService.deleteOffer(offer.id);
            navigate('/supplier');
        } catch (error) {
            console.error('Failed to delete offer:', error);
            setIsDeleting(false);
        }
    };

    const handleRedeemClaim = async (claimId: string) => {
        if (!confirm('Mark this voucher as redeemed?')) {
            return;
        }

        setRedeemingClaimId(claimId);
        try {
            await supplierService.redeemClaim(claimId);
            await loadData();
        } catch (error) {
            console.error('Failed to redeem claim:', error);
            alert('Failed to redeem claim. Please try again.');
        } finally {
            setRedeemingClaimId(null);
        }
    };

    const handleTestOffer = async () => {
        if (!offer || !supplier) return;

        setIsTesting(true);
        try {
            const testClaim = await supplierService.claimOfferAsTest(offer.id, supplier);
            await loadData();
            // Navigate to the redeem page with the test claim
            navigate(`/supplier/redeem?id=${testClaim.id}`);
        } catch (error) {
            console.error('Failed to create test claim:', error);
            alert(error instanceof Error ? error.message : 'Failed to create test claim.');
        } finally {
            setIsTesting(false);
        }
    };

    const handleResetTestClaim = async (claimId: string) => {
        if (!confirm('Reset this test claim? You can test the offer again after resetting.')) {
            return;
        }

        setResettingClaimId(claimId);
        try {
            await supplierService.resetTestClaim(claimId);
            await loadData();
        } catch (error) {
            console.error('Failed to reset test claim:', error);
            alert('Failed to reset test claim. Please try again.');
        } finally {
            setResettingClaimId(null);
        }
    };

    // Filtered claims
    const filteredClaims = useMemo(() => {
        if (claimFilter === 'all') return claims;
        return claims.filter(claim => claim.status === claimFilter);
    }, [claims, claimFilter]);

    // Claim filter counts
    const claimFilterCounts = useMemo(() => ({
        all: claims.length,
        claimed: claims.filter(c => c.status === 'claimed').length,
        redeemed: claims.filter(c => c.status === 'redeemed').length,
        expired: claims.filter(c => c.status === 'expired').length
    }), [claims]);

    // Calculate statistics
    const stats = useMemo(() => {
        if (!offer) return null;
        const redeemedCount = claims.filter(c => c.status === 'redeemed').length;
        const redemptionRate = claims.length > 0
            ? Math.round((redeemedCount / claims.length) * 100)
            : 0;
        const remaining = offer.maxClaims ? offer.maxClaims - offer.claimCount : null;

        return {
            totalClaims: claims.length,
            remaining,
            redemptionRate
        };
    }, [offer, claims]);

    const isExpired = offer ? new Date(offer.validUntil) < new Date() : false;
    const isNotOnMarketplace = isExpired || (offer ? !offer.active : false);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateShort = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="inline-block size-8 border-2 border-gray-300 border-t-lime-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!offer) {
        return (
            <div className="text-center py-12">
                <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">
                    error_outline
                </span>
                <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-2">
                    Offer Not Found
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    The offer you're looking for doesn't exist or has been deleted.
                </p>
                <Link
                    to="/supplier"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors text-sm font-medium"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        to="/supplier"
                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[#111418] dark:text-white">
                            {offer.title}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {CATEGORY_LABELS[offer.category]}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 ml-11 sm:ml-0">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">edit</span>
                        <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                        onClick={handleToggleActive}
                        disabled={isExpired || isToggling}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-lg">
                            {offer.active ? 'visibility_off' : 'visibility'}
                        </span>
                        <span className="hidden sm:inline">
                            {isToggling ? 'Updating...' : offer.active ? 'Deactivate' : 'Activate'}
                        </span>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                        <span className="hidden sm:inline">
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Marketplace Visibility Warning */}
            {isNotOnMarketplace && (
                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-gray-500">visibility_off</span>
                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Not visible on marketplace</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isExpired
                                    ? 'This offer has expired and is no longer visible to guests.'
                                    : 'This offer is inactive and hidden from guests.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Test Offer Banner */}
            {offer.active && !isExpired && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">science</span>
                            <div>
                                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Test This Offer</h3>
                                <p className="text-sm text-purple-700 dark:text-purple-300">
                                    Create a test voucher to verify the claim and redemption flow works correctly.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleTestOffer}
                            disabled={isTesting || claims.some(c => c.isTest)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {isTesting ? (
                                <>
                                    <span className="inline-block size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : claims.some(c => c.isTest) ? (
                                <>
                                    <span className="material-symbols-outlined text-lg">check</span>
                                    Test Created
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                                    Test Offer
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Offer Image & Info */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                    {offer.imageUrl && (
                        <div
                            className="h-48 sm:h-auto sm:w-64 bg-cover bg-center flex-shrink-0"
                            style={{ backgroundImage: `url(${offer.imageUrl})` }}
                        />
                    )}
                    <div className="p-6 flex-1">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                        isExpired
                                            ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                            : offer.active
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                        {isExpired ? 'Expired' : offer.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            {offer.discountPercent > 0 && (
                                <span className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                                    {offer.discountPercent}% OFF
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {offer.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-lg">event</span>
                                <span>{formatDateShort(offer.validFrom)} - {formatDateShort(offer.validUntil)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-lg">confirmation_number</span>
                                <span>{offer.maxClaims ? `${offer.maxClaims} max claims` : 'Unlimited claims'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Offer Details */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Offer Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <span className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                            {offer.discountPercent}%
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Discount</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <span className="text-2xl font-bold text-[#111418] dark:text-white">
                            {formatDateShort(offer.validFrom)} - {formatDateShort(offer.validUntil)}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Validity Period</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <span className="text-2xl font-bold text-[#111418] dark:text-white">
                            {offer.maxClaims || 'Unlimited'}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Max Claims</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h3>
                        <p className="text-gray-600 dark:text-gray-400">{offer.description}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Terms & Conditions</h3>
                        <p className="text-gray-600 dark:text-gray-400">{offer.terms}</p>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            {stats && (
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Statistics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {stats.totalClaims}
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Claims</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                            <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                {stats.remaining !== null ? stats.remaining : '∞'}
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Remaining</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                            <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {stats.redemptionRate}%
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Redemption Rate</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Claims List */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-lg font-bold text-[#111418] dark:text-white">Claims</h2>
                        <div className="flex flex-wrap gap-2">
                            <ClaimFilterChip
                                label="All"
                                count={claimFilterCounts.all}
                                isActive={claimFilter === 'all'}
                                onClick={() => setClaimFilter('all')}
                            />
                            <ClaimFilterChip
                                label="Pending"
                                count={claimFilterCounts.claimed}
                                isActive={claimFilter === 'claimed'}
                                onClick={() => setClaimFilter('claimed')}
                                color="blue"
                            />
                            <ClaimFilterChip
                                label="Redeemed"
                                count={claimFilterCounts.redeemed}
                                isActive={claimFilter === 'redeemed'}
                                onClick={() => setClaimFilter('redeemed')}
                                color="green"
                            />
                            <ClaimFilterChip
                                label="Expired"
                                count={claimFilterCounts.expired}
                                isActive={claimFilter === 'expired'}
                                onClick={() => setClaimFilter('expired')}
                                color="gray"
                            />
                        </div>
                    </div>
                </div>

                {filteredClaims.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <span className="material-symbols-outlined text-4xl mb-2">redeem</span>
                        <p>No claims match this filter</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredClaims.map((claim) => (
                            <div
                                key={claim.id}
                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                                    claim.isTest ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            claim.isTest
                                                ? 'bg-purple-100 dark:bg-purple-900/30'
                                                : 'bg-gray-100 dark:bg-gray-800'
                                        }`}>
                                            <span className={`material-symbols-outlined ${
                                                claim.isTest ? 'text-purple-500' : 'text-gray-500'
                                            }`}>
                                                {claim.isTest ? 'science' : 'person'}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                <p className="font-medium text-[#111418] dark:text-white truncate">
                                                    {claim.userName}
                                                </p>
                                                {claim.isTest && (
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                        TEST
                                                    </span>
                                                )}
                                                <ClaimStatusBadge status={claim.status} />
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Claimed {formatDate(claim.claimedAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {claim.redeemedAt && !claim.isTest && (
                                            <p className="text-sm text-green-600 dark:text-green-400 hidden sm:block">
                                                Redeemed {formatDate(claim.redeemedAt)}
                                            </p>
                                        )}
                                        {claim.status === 'claimed' && !claim.isTest && (
                                            <button
                                                onClick={() => handleRedeemClaim(claim.id)}
                                                disabled={redeemingClaimId === claim.id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lime-500 hover:bg-lime-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {redeemingClaimId === claim.id ? (
                                                    <>
                                                        <span className="inline-block size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Redeeming...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                                        Redeem
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        {/* Test claim actions */}
                                        {claim.isTest && (
                                            <div className="flex items-center gap-2">
                                                {claim.status === 'claimed' && (
                                                    <button
                                                        onClick={() => navigate(`/supplier/redeem?id=${claim.id}`)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
                                                        <span className="hidden sm:inline">Test Redeem</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleResetTestClaim(claim.id)}
                                                    disabled={resettingClaimId === claim.id}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {resettingClaimId === claim.id ? (
                                                        <>
                                                            <span className="inline-block size-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
                                                            Resetting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="material-symbols-outlined text-lg">refresh</span>
                                                            <span className="hidden sm:inline">Reset</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <OfferFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                offer={offer}
                onSave={handleSave}
                supplierId={supplierId}
            />
        </div>
    );
};

// Claim Filter Chip Component
const ClaimFilterChip: React.FC<{
    label: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
    color?: 'blue' | 'green' | 'gray';
}> = ({ label, count, isActive, onClick, color }) => {
    const getColorStyles = () => {
        if (isActive) {
            switch (color) {
                case 'blue': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800';
                case 'green': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800';
                case 'gray': return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
                default: return 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-gray-900 dark:border-white';
            }
        }
        return 'bg-white dark:bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';
    };

    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${getColorStyles()}`}
        >
            {label}
            <span className={`px-1.5 py-0.5 rounded text-xs ${
                isActive ? 'bg-black/10 dark:bg-white/10' : 'bg-gray-100 dark:bg-gray-800'
            }`}>
                {count}
            </span>
        </button>
    );
};

// Claim Status Badge Component
const ClaimStatusBadge: React.FC<{ status: 'claimed' | 'redeemed' | 'expired' }> = ({ status }) => {
    const styles = {
        claimed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        redeemed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        expired: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    };

    const labels = {
        claimed: 'Pending',
        redeemed: 'Redeemed',
        expired: 'Expired'
    };

    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};
