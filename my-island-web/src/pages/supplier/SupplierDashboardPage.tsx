import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import {
    supplierService,
    type SupplierDashboardStats,
    type Supplier,
    type ActiveOffersDetailResponse,
    type ClaimsDetailResponse,
    type ActiveOfferDetail,
    type ClaimDetail
} from '../../services/supplierService';

type FilterType = 'offers' | 'claims-all' | 'claims-month';
type OfferSubFilter = 'all' | 'active' | 'expiring_soon' | 'near_limit';
type ClaimSubFilter = 'all' | 'claimed' | 'redeemed' | 'expired';

export const SupplierDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { subscription } = useSubscription();
    const [stats, setStats] = useState<SupplierDashboardStats | null>(null);
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const hasActiveSubscription = subscription?.hasActiveSubscription ?? false;

    // Filter state
    const [activeFilter, setActiveFilter] = useState<FilterType>('offers');
    const [offerSubFilter, setOfferSubFilter] = useState<OfferSubFilter>('all');
    const [claimSubFilter, setClaimSubFilter] = useState<ClaimSubFilter>('all');
    const [filterLoading, setFilterLoading] = useState(false);
    const [offersData, setOffersData] = useState<ActiveOffersDetailResponse | null>(null);
    const [claimsData, setClaimsData] = useState<ClaimsDetailResponse | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            try {
                const [supplierData, statsData] = await Promise.all([
                    supplierService.getSupplierProfile(user.id),
                    supplierService.getDashboardStats(user.id)
                ]);
                setSupplier(supplierData);
                setStats(statsData);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [user]);

    // Load data when main filter changes
    useEffect(() => {
        const loadFilterData = async () => {
            setFilterLoading(true);
            try {
                if (activeFilter === 'offers') {
                    const data = await supplierService.getActiveOffersDetail(user?.id ?? '');
                    setOffersData(data);
                } else {
                    const period = activeFilter === 'claims-all' ? 'all' : 'month';
                    const data = await supplierService.getClaimsDetail(user?.id ?? '', period);
                    setClaimsData(data);
                }
            } catch (error) {
                console.error('Failed to load filter data:', error);
            } finally {
                setFilterLoading(false);
            }
        };

        if (!isLoading) {
            loadFilterData();
        }
    }, [activeFilter, isLoading]);

    // Reset sub-filters when main filter changes
    useEffect(() => {
        setOfferSubFilter('all');
        setClaimSubFilter('all');
    }, [activeFilter]);

    // Filtered offers based on sub-filter
    const filteredOffers = useMemo(() => {
        if (!offersData) return [];
        if (offerSubFilter === 'all') return offersData.offers;
        return offersData.offers.filter(offer => offer.status === offerSubFilter);
    }, [offersData, offerSubFilter]);

    // Filtered claims based on sub-filter
    const filteredClaims = useMemo(() => {
        if (!claimsData) return [];
        if (claimSubFilter === 'all') return claimsData.claims;
        return claimsData.claims.filter(claim => claim.status === claimSubFilter);
    }, [claimsData, claimSubFilter]);

    // Sub-filter counts for offers
    const offerSubFilterCounts = useMemo(() => {
        if (!offersData) return { all: 0, active: 0, expiring_soon: 0, near_limit: 0 };
        return {
            all: offersData.offers.length,
            active: offersData.offers.filter(o => o.status === 'active').length,
            expiring_soon: offersData.offers.filter(o => o.status === 'expiring_soon').length,
            near_limit: offersData.offers.filter(o => o.status === 'near_limit').length,
        };
    }, [offersData]);

    // Sub-filter counts for claims
    const claimSubFilterCounts = useMemo(() => {
        if (!claimsData) return { all: 0, claimed: 0, redeemed: 0, expired: 0 };
        return {
            all: claimsData.claims.length,
            claimed: claimsData.claims.filter(c => c.status === 'claimed').length,
            redeemed: claimsData.claims.filter(c => c.status === 'redeemed').length,
            expired: claimsData.claims.filter(c => c.status === 'expired').length,
        };
    }, [claimsData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                    Welcome back, {supplier?.businessName || user?.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Here's how your offers are performing
                </p>
            </div>

            {/* Main Filter Chips */}
            <div className="flex flex-wrap gap-2">
                <FilterChip
                    icon="local_offer"
                    label="Active Offers"
                    count={stats?.activeOffers || 0}
                    isActive={activeFilter === 'offers'}
                    onClick={() => setActiveFilter('offers')}
                    color="lime"
                />
                <FilterChip
                    icon="redeem"
                    label="Total Claims"
                    count={stats?.totalClaims || 0}
                    isActive={activeFilter === 'claims-all'}
                    onClick={() => setActiveFilter('claims-all')}
                    color="blue"
                />
                <FilterChip
                    icon="trending_up"
                    label="This Month"
                    count={stats?.thisMonthClaims || 0}
                    isActive={activeFilter === 'claims-month'}
                    onClick={() => setActiveFilter('claims-month')}
                    color="purple"
                />
            </div>

            {/* Sub-Filters */}
            {!filterLoading && (
                <div className="flex flex-wrap gap-2">
                    {activeFilter === 'offers' ? (
                        <>
                            <SubFilterChip
                                label="All"
                                count={offerSubFilterCounts.all}
                                isActive={offerSubFilter === 'all'}
                                onClick={() => setOfferSubFilter('all')}
                            />
                            <SubFilterChip
                                label="Active"
                                count={offerSubFilterCounts.active}
                                isActive={offerSubFilter === 'active'}
                                onClick={() => setOfferSubFilter('active')}
                                color="green"
                            />
                            <SubFilterChip
                                label="Expiring Soon"
                                count={offerSubFilterCounts.expiring_soon}
                                isActive={offerSubFilter === 'expiring_soon'}
                                onClick={() => setOfferSubFilter('expiring_soon')}
                                color="yellow"
                            />
                            <SubFilterChip
                                label="Near Limit"
                                count={offerSubFilterCounts.near_limit}
                                isActive={offerSubFilter === 'near_limit'}
                                onClick={() => setOfferSubFilter('near_limit')}
                                color="orange"
                            />
                        </>
                    ) : (
                        <>
                            <SubFilterChip
                                label="All"
                                count={claimSubFilterCounts.all}
                                isActive={claimSubFilter === 'all'}
                                onClick={() => setClaimSubFilter('all')}
                            />
                            <SubFilterChip
                                label="Pending"
                                count={claimSubFilterCounts.claimed}
                                isActive={claimSubFilter === 'claimed'}
                                onClick={() => setClaimSubFilter('claimed')}
                                color="blue"
                            />
                            <SubFilterChip
                                label="Redeemed"
                                count={claimSubFilterCounts.redeemed}
                                isActive={claimSubFilter === 'redeemed'}
                                onClick={() => setClaimSubFilter('redeemed')}
                                color="green"
                            />
                            <SubFilterChip
                                label="Expired"
                                count={claimSubFilterCounts.expired}
                                isActive={claimSubFilter === 'expired'}
                                onClick={() => setClaimSubFilter('expired')}
                                color="gray"
                            />
                        </>
                    )}
                </div>
            )}

            {/* Filtered Data List */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">
                        {activeFilter === 'offers' && 'Active Offers'}
                        {activeFilter === 'claims-all' && 'All Claims'}
                        {activeFilter === 'claims-month' && "This Month's Claims"}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {activeFilter === 'offers' ? filteredOffers.length : filteredClaims.length} results
                    </span>
                </div>

                {filterLoading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block size-6 border-2 border-gray-300 border-t-lime-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {activeFilter === 'offers' && (
                            <OffersListView offers={filteredOffers} />
                        )}
                        {(activeFilter === 'claims-all' || activeFilter === 'claims-month') && (
                            <ClaimsListView claims={filteredClaims} />
                        )}
                    </>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    {hasActiveSubscription ? (
                        <Link
                            to="/supplier/offers"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Create New Offer
                        </Link>
                    ) : (
                        <Link
                            to="/supplier/settings"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-lg">credit_card</span>
                            Subscribe to Create Offers
                        </Link>
                    )}
                    <Link
                        to="/supplier/profile"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">edit</span>
                        Edit Profile
                    </Link>
                    <Link
                        to="/marketplace"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">storefront</span>
                        View All Offers
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Main Filter Chip Component
const FilterChip: React.FC<{
    icon: string;
    label: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
    color: 'lime' | 'blue' | 'purple';
}> = ({ icon, label, count, isActive, onClick, color }) => {
    const colorStyles = {
        lime: {
            active: 'bg-lime-500 text-white border-lime-500',
            inactive: 'bg-white dark:bg-[#1a2632] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-lime-300 dark:hover:border-lime-700',
            badge: 'bg-lime-600 text-white',
            badgeInactive: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
        },
        blue: {
            active: 'bg-blue-500 text-white border-blue-500',
            inactive: 'bg-white dark:bg-[#1a2632] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700',
            badge: 'bg-blue-600 text-white',
            badgeInactive: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        },
        purple: {
            active: 'bg-purple-500 text-white border-purple-500',
            inactive: 'bg-white dark:bg-[#1a2632] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700',
            badge: 'bg-purple-600 text-white',
            badgeInactive: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        },
    };

    const styles = colorStyles[color];

    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all font-medium text-sm ${
                isActive ? styles.active : styles.inactive
            }`}
        >
            <span className="material-symbols-outlined text-lg">{icon}</span>
            <span className="hidden sm:inline">{label}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isActive ? styles.badge : styles.badgeInactive
            }`}>
                {count}
            </span>
        </button>
    );
};

// Sub-Filter Chip Component
const SubFilterChip: React.FC<{
    label: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
    color?: 'green' | 'yellow' | 'orange' | 'blue' | 'gray';
}> = ({ label, count, isActive, onClick, color }) => {
    const getColorStyles = () => {
        if (isActive) {
            switch (color) {
                case 'green': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800';
                case 'yellow': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
                case 'orange': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border-orange-200 dark:border-orange-800';
                case 'blue': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800';
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

// Offers List View Component
const OffersListView: React.FC<{ offers: ActiveOfferDetail[] }> = ({ offers }) => {
    const CATEGORY_LABELS: Record<string, string> = {
        'FOOD': 'Food & Drink',
        'ACTIVITIES': 'Activities',
        'GEAR': 'Gear Rental',
        'ATTRACTIONS': 'Attractions',
        'TRANSPORT': 'Transport'
    };

    const formatDateShort = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (offers.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">local_offer</span>
                <p>No offers match this filter</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {offers.map((offer) => (
                <Link
                    key={offer.id}
                    to={`/supplier/offers/${offer.id}`}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-[#111418] dark:text-white truncate">
                                    {offer.title}
                                </p>
                                <OfferStatusBadge status={offer.status} />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {CATEGORY_LABELS[offer.category] || offer.category}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="font-semibold text-lime-600 dark:text-lime-400">
                                    {offer.discountPercent}% OFF
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    {offer.claimCount}{offer.maxClaims && ` / ${offer.maxClaims}`} claims
                                </span>
                                <span className="text-gray-400 dark:text-gray-500 text-xs">
                                    {formatDateShort(offer.validFrom)} - {formatDateShort(offer.validUntil)}
                                </span>
                            </div>
                        </div>
                        <div className="p-2 text-gray-400">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

const OfferStatusBadge: React.FC<{ status: 'active' | 'expiring_soon' | 'near_limit' }> = ({ status }) => {
    const styles = {
        active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        expiring_soon: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        near_limit: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    };

    const labels = {
        active: 'Active',
        expiring_soon: 'Expiring Soon',
        near_limit: 'Near Limit'
    };

    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};

// Claims List View Component
const ClaimsListView: React.FC<{ claims: ClaimDetail[] }> = ({ claims }) => {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (claims.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">redeem</span>
                <p>No claims match this filter</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {claims.map((claim) => (
                <div key={claim.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-gray-500">person</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="font-medium text-[#111418] dark:text-white truncate">
                                        {claim.userName}
                                    </p>
                                    <ClaimStatusBadge status={claim.status} />
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {claim.offerTitle}
                                </p>
                            </div>
                        </div>
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                            <p>{formatDate(claim.claimedAt)}</p>
                            {claim.redeemedAt && (
                                <p className="text-green-600 dark:text-green-400">
                                    Redeemed {formatDate(claim.redeemedAt)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

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
