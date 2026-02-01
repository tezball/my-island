import React from 'react';
import type { ClaimDetail, ClaimsDetailResponse } from '../../../services/supplierService';

interface ClaimsTableProps {
    data: ClaimsDetailResponse;
    periodLabel: string;
}

const StatusBadge: React.FC<{ status: ClaimDetail['status'] }> = ({ status }) => {
    const styles = {
        claimed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        redeemed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        expired: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    };

    const labels = {
        claimed: 'Claimed',
        redeemed: 'Redeemed',
        expired: 'Expired'
    };

    return (
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};

export const ClaimsTable: React.FC<ClaimsTableProps> = ({ data, periodLabel }) => {
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

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('en-IE', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (data.claims.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">redeem</span>
                <p>No claims {periodLabel.toLowerCase()}</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            {/* Summary Cards - 2x2 on mobile, 4 cols on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-[#111418] dark:text-white">{data.summary.total}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">{data.summary.redeemed}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Redeemed</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400">{data.summary.pending}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Pending</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-400">{data.summary.expired}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Expired</p>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
                {data.claims.map((claim) => (
                    <div
                        key={claim.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-sm text-gray-500">person</span>
                                </div>
                                <span className="font-medium text-[#111418] dark:text-white truncate">{claim.userName}</span>
                            </div>
                            <StatusBadge status={claim.status} />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                            {claim.offerTitle}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Claimed: {formatDateShort(claim.claimedAt)}</span>
                            {claim.redeemedAt && (
                                <span>Redeemed: {formatDateShort(claim.redeemedAt)}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">User</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Offer</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Claimed Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Redeemed Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.claims.map((claim) => (
                            <tr
                                key={claim.id}
                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm text-gray-500">person</span>
                                        </div>
                                        <span className="font-medium text-[#111418] dark:text-white">{claim.userName}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                    {claim.offerTitle}
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                    <div className="text-xs">
                                        <p>{formatDate(claim.claimedAt)}</p>
                                        <p className="text-gray-400">{formatTime(claim.claimedAt)}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={claim.status} />
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                    {claim.redeemedAt ? (
                                        <div className="text-xs">
                                            <p>{formatDate(claim.redeemedAt)}</p>
                                            <p className="text-gray-400">{formatTime(claim.redeemedAt)}</p>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
