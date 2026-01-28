import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supplierService, type Offer, type Supplier, type OfferClaim } from '../services/supplierService';
import { Link } from 'react-router-dom';

type VoucherWithDetails = OfferClaim & { offer: Offer; supplier: Supplier };

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

export const VouchersPage: React.FC = () => {
    const { user } = useAuth();
    const [vouchers, setVouchers] = useState<VoucherWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'claimed' | 'redeemed'>('all');

    useEffect(() => {
        const fetchVouchers = async () => {
            if (user) {
                try {
                    const data = await supplierService.getUserVouchers(user.id);
                    setVouchers(data);
                } catch (error) {
                    console.error('Failed to fetch vouchers:', error);
                }
            }
            setIsLoading(false);
        };

        fetchVouchers();
    }, [user]);

    const filteredVouchers = vouchers.filter(v => {
        if (filter === 'all') return true;
        return v.status === filter;
    });

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status: OfferClaim['status']) => {
        switch (status) {
            case 'claimed':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        Ready to Use
                    </span>
                );
            case 'redeemed':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        Redeemed
                    </span>
                );
            case 'expired':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        <span className="material-symbols-outlined text-xs">event_busy</span>
                        Expired
                    </span>
                );
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-gray-400">local_offer</span>
                </div>
                <h2 className="text-xl font-semibold text-[#111418] dark:text-white mb-2">Sign in to view your vouchers</h2>
                <p className="text-gray-500 text-center mb-6">Save and redeem exclusive offers from local suppliers</p>
                <Link
                    to="/signin"
                    className="bg-primary hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                    Sign In
                </Link>
            </div>
        );
    }

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
            <div className="bg-primary text-white py-6 px-4">
                <h1 className="text-2xl font-bold">My Vouchers</h1>
                <p className="text-white/80 mt-1">Exclusive offers from local suppliers</p>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex gap-2">
                    {(['all', 'claimed', 'redeemed'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === status
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {status === 'all' ? 'All' : status === 'claimed' ? 'Ready to Use' : 'Redeemed'}
                        </button>
                    ))}
                </div>
            </div>

            {filteredVouchers.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] p-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-4xl text-gray-400">
                            {filter === 'all' ? 'local_offer' : filter === 'claimed' ? 'schedule' : 'check_circle'}
                        </span>
                    </div>
                    <h2 className="text-xl font-semibold text-[#111418] dark:text-white mb-2">
                        {filter === 'all' ? 'No vouchers yet' : `No ${filter} vouchers`}
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        {filter === 'all'
                            ? 'Browse local offers and claim exclusive discounts'
                            : 'Check back later or browse for new offers'}
                    </p>
                    <Link
                        to="/offers"
                        className="bg-primary hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                    >
                        Browse Offers
                    </Link>
                </div>
            ) : (
                <div className="px-4 py-4 space-y-4">
                    {filteredVouchers.map((voucher) => (
                        <div
                            key={voucher.id}
                            className={`bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border overflow-hidden ${
                                voucher.status === 'redeemed'
                                    ? 'border-gray-200 dark:border-gray-800 opacity-75'
                                    : 'border-primary/30'
                            }`}
                        >
                            {/* Voucher Header */}
                            <div className="flex">
                                {/* Left side - Discount badge */}
                                <div className={`w-24 flex flex-col items-center justify-center p-4 ${
                                    voucher.status === 'redeemed'
                                        ? 'bg-gray-100 dark:bg-gray-800'
                                        : 'bg-primary/10'
                                }`}>
                                    <span className={`text-2xl font-bold ${
                                        voucher.status === 'redeemed'
                                            ? 'text-gray-400'
                                            : 'text-primary'
                                    }`}>
                                        {voucher.offer.discountPercent}%
                                    </span>
                                    <span className={`text-xs font-medium ${
                                        voucher.status === 'redeemed'
                                            ? 'text-gray-400'
                                            : 'text-primary'
                                    }`}>
                                        OFF
                                    </span>
                                </div>

                                {/* Right side - Details */}
                                <div className="flex-1 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-[#111418] dark:text-white">
                                                {voucher.offer.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <span className="material-symbols-outlined text-sm">
                                                    {CATEGORY_ICONS[voucher.offer.category] || 'store'}
                                                </span>
                                                {voucher.supplier.businessName}
                                            </p>
                                        </div>
                                        {getStatusBadge(voucher.status)}
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                        {voucher.offer.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                                            Claimed {formatDate(voucher.claimedAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">event</span>
                                            Valid until {formatDate(voucher.offer.validUntil)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Voucher Footer - Only show for claimed vouchers */}
                            {voucher.status === 'claimed' && (
                                <div className="border-t border-dashed border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">qr_code_2</span>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Show to supplier to redeem
                                            </span>
                                        </div>
                                        <button className="bg-primary hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                                            View QR Code
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Redeemed footer */}
                            {voucher.status === 'redeemed' && voucher.redeemedAt && (
                                <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">check</span>
                                        Redeemed on {formatDate(voucher.redeemedAt)}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Browse More Offers CTA */}
            {filteredVouchers.length > 0 && (
                <div className="px-4 py-6">
                    <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-[#111418] dark:text-white">Want more deals?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Browse exclusive offers from local suppliers</p>
                        </div>
                        <Link
                            to="/offers"
                            className="bg-primary hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            Browse
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};
