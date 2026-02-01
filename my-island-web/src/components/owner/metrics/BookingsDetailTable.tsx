import React from 'react';
import type { BookingsDetailResponse, BookingDetail } from '../../../services/ownerService';

interface BookingsDetailTableProps {
    data: BookingsDetailResponse;
}

const TYPE_ICONS: Record<string, string> = {
    'tent': 'camping',
    'touring': 'rv_hookup',
    'glamping': 'cottage',
    'cabin': 'cabin',
    'mobile-home': 'home',
};

const StatusBadge: React.FC<{ status: BookingDetail['status'] }> = ({ status }) => {
    const styles: Record<string, string> = {
        confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        checked_in: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    };

    const labels: Record<string, string> = {
        confirmed: 'Confirmed',
        pending: 'Pending',
        cancelled: 'Cancelled',
        checked_in: 'Checked In',
        completed: 'Completed',
    };

    return (
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${styles[status] || styles.pending}`}>
            {labels[status] || status}
        </span>
    );
};

export const BookingsDetailTable: React.FC<BookingsDetailTableProps> = ({ data }) => {
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

    if (data.bookings.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">calendar_month</span>
                <p>No bookings found</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-[#111418] dark:text-white">{data.summary.total}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-green-700 dark:text-green-400">{data.summary.confirmed}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Confirmed</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400">{data.summary.pending}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-red-700 dark:text-red-400">{data.summary.cancelled}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cancelled</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{data.summary.checkInsThisWeek}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Check-ins</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{data.summary.checkOutsThisWeek}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Check-outs</p>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
                {data.bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-[#111418] dark:text-white truncate">{booking.userName}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-sm">
                                        {TYPE_ICONS[booking.lotType] || 'home'}
                                    </span>
                                    {booking.lotName}
                                </div>
                            </div>
                            <StatusBadge status={booking.status} />
                        </div>
                        <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-500 dark:text-gray-400">
                                {formatDateShort(booking.startDate)} - {formatDateShort(booking.endDate)}
                            </span>
                            <span className="font-semibold text-primary">
                                €{booking.totalPrice}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="material-symbols-outlined text-sm">group</span>
                            {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Guest</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Lot</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Dates</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Guests</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.bookings.map((booking) => (
                            <tr
                                key={booking.id}
                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                <td className="py-3 px-4">
                                    <p className="font-medium text-[#111418] dark:text-white">{booking.userName}</p>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-sm text-gray-500">
                                            {TYPE_ICONS[booking.lotType] || 'home'}
                                        </span>
                                        <span className="text-gray-600 dark:text-gray-400">{booking.lotName}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                    <div className="text-xs">
                                        <p>{formatDate(booking.startDate)}</p>
                                        <p className="text-gray-400">to {formatDate(booking.endDate)}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                    {booking.guests}
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={booking.status} />
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <span className="font-semibold text-primary">€{booking.totalPrice}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
