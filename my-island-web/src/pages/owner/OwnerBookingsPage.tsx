import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ownerService } from '../../services/ownerService';
import type { Booking } from '../../types/booking';
import clsx from 'clsx';

export const OwnerBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

    useEffect(() => {
        const loadBookings = async () => {
            if (!user) return;
            try {
                const data = await ownerService.getOwnerBookings(user.id);
                setBookings(data);
            } catch (error) {
                console.error('Failed to load bookings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadBookings();
    }, [user]);

    const filteredBookings = bookings.filter(b => {
        if (filter === 'all') return true;
        return b.status === filter;
    });

    const statusStyles: Record<string, string> = {
        confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        checked_in: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    };

    const handleConfirm = async (bookingId: string) => {
        try {
            await ownerService.confirmBooking(bookingId);
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: 'confirmed' } : b
            ));
        } catch (error) {
            console.error('Failed to confirm booking:', error);
            alert('Failed to confirm booking. Please try again.');
        }
    };

    const handleReject = async (bookingId: string) => {
        if (!confirm('Are you sure you want to reject this booking?')) return;

        try {
            await ownerService.cancelBooking(bookingId);
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: 'cancelled' } : b
            ));
        } catch (error) {
            console.error('Failed to reject booking:', error);
            alert('Failed to reject booking. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Bookings</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{bookings.length} total bookings</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={clsx(
                            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                            filter === f
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        )}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Bookings List - Mobile Friendly */}
            <div className="space-y-3">
                {filteredBookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-[#111418] dark:text-white">{booking.userName}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{booking.lotName}</p>
                            </div>
                            <span className={clsx('text-xs font-medium px-2 py-1 rounded-full', statusStyles[booking.status])}>
                                {booking.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-base align-middle mr-1">calendar_today</span>
                                    {booking.startDate} - {booking.endDate}
                                </span>
                            </div>
                            <span className="font-bold text-primary">€{booking.totalPrice}</span>
                        </div>
                        {booking.details && (
                            <p className="text-xs text-gray-400 mt-2">{booking.details}</p>
                        )}

                        {/* Action Buttons for Pending Bookings */}
                        {booking.status === 'pending' && (
                            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => handleConfirm(booking.id)}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-lg">check</span>
                                    Confirm
                                </button>
                                <button
                                    onClick={() => handleReject(booking.id)}
                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">calendar_month</span>
                    <p className="text-gray-500 dark:text-gray-400">No bookings found</p>
                </div>
            )}
        </div>
    );
};
