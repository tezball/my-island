import React from 'react';
import type { ActiveOfferDetail, ActiveOffersDetailResponse } from '../../../services/supplierService';

interface ActiveOffersTableProps {
    data: ActiveOffersDetailResponse;
}

const CATEGORY_LABELS: Record<string, string> = {
    'FOOD': 'Food & Drink',
    'ACTIVITIES': 'Activities',
    'GEAR': 'Gear Rental',
    'ATTRACTIONS': 'Attractions',
    'TRANSPORT': 'Transport'
};

const StatusBadge: React.FC<{ status: ActiveOfferDetail['status'] }> = ({ status }) => {
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
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};

export const ActiveOffersTable: React.FC<ActiveOffersTableProps> = ({ data }) => {
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
            month: 'short'
        });
    };

    if (data.offers.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">local_offer</span>
                <p>No active offers</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            {/* Summary Cards - Stack on mobile */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-[#111418] dark:text-white">{data.summary.total}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Active</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-yellow-700 dark:text-yellow-400">{data.summary.expiringSoon}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Expiring</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-orange-700 dark:text-orange-400">{data.summary.nearClaimLimit}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Near Limit</p>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
                {data.offers.map((offer) => (
                    <div
                        key={offer.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-[#111418] dark:text-white truncate">{offer.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {CATEGORY_LABELS[offer.category] || offer.category}
                                </p>
                            </div>
                            <StatusBadge status={offer.status} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-lime-600 dark:text-lime-400">
                                {offer.discountPercent}% OFF
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                                {offer.claimCount}{offer.maxClaims && ` / ${offer.maxClaims}`} claims
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {formatDateShort(offer.validFrom)} - {formatDateShort(offer.validUntil)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Offer</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Discount</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Valid Period</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Claims</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.offers.map((offer) => (
                            <tr
                                key={offer.id}
                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                <td className="py-3 px-4">
                                    <div>
                                        <p className="font-medium text-[#111418] dark:text-white">{offer.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {CATEGORY_LABELS[offer.category] || offer.category}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="font-semibold text-lime-600 dark:text-lime-400">
                                        {offer.discountPercent}% OFF
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                    <div className="text-xs">
                                        <p>{formatDate(offer.validFrom)}</p>
                                        <p>to {formatDate(offer.validUntil)}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                    {offer.claimCount}
                                    {offer.maxClaims && (
                                        <span className="text-gray-400"> / {offer.maxClaims}</span>
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={offer.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
