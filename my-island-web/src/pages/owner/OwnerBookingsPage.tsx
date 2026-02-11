import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOwnerSubscription } from '../../context/OwnerSubscriptionContext';
import { ownerService } from '../../services/ownerService';
import type { Booking, Lot } from '../../types/booking';
import { ManualBookingModal } from '../../components/owner/ManualBookingModal';
import { SubscriptionGate } from '../../components/owner/SubscriptionGate';
import clsx from 'clsx';

export const OwnerBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const { subscription } = useOwnerSubscription();
    const hasActiveSubscription = subscription?.hasActiveSubscription ?? false;
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [lots, setLots] = useState<Lot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'pending_payment' | 'checked_in' | 'completed' | 'cancelled'>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [actionError, setActionError] = useState<{ bookingId: string; message: string } | null>(null);
    const PAGE_SIZE = 15;

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            try {
                const [bookingsData, lotsData] = await Promise.all([
                    ownerService.getOwnerBookings(user.id),
                    ownerService.getOwnerLots(user.id),
                ]);
                setBookings(bookingsData);
                setLots(lotsData);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [user]);

    const filteredBookings = bookings.filter(b => {
        if (filter !== 'all' && b.status !== filter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (!b.userName.toLowerCase().includes(q) && !b.lotName.toLowerCase().includes(q)) return false;
        }
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedBookings = filteredBookings.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const statusStyles: Record<string, string> = {
        confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        pending_payment: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        checked_in: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
        payment_failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    const handleCheckIn = async (bookingId: string) => {
        setActionError(null);
        try {
            await ownerService.checkInBooking(bookingId);
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: 'checked_in' as const } : b
            ));
        } catch (error) {
            console.error('Failed to check in booking:', error);
            setActionError({ bookingId, message: error instanceof Error ? error.message : 'Failed to check in booking' });
        }
    };

    const handleCheckOut = async (bookingId: string) => {
        setActionError(null);
        try {
            await ownerService.checkOutBooking(bookingId);
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: 'completed' as const } : b
            ));
        } catch (error) {
            console.error('Failed to check out booking:', error);
            setActionError({ bookingId, message: error instanceof Error ? error.message : 'Failed to check out booking' });
        }
    };

    const handleConfirm = async (bookingId: string) => {
        setActionError(null);
        try {
            await ownerService.confirmBooking(bookingId);
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: 'confirmed' } : b
            ));
        } catch (error) {
            console.error('Failed to confirm booking:', error);
            setActionError({ bookingId, message: error instanceof Error ? error.message : 'Failed to confirm booking' });
        }
    };

    const handleReject = async (bookingId: string) => {
        setActionError(null);
        try {
            await ownerService.cancelBooking(bookingId);
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: 'cancelled' } : b
            ));
        } catch (error) {
            console.error('Failed to reject booking:', error);
            setActionError({ bookingId, message: error instanceof Error ? error.message : 'Failed to cancel booking' });
        }
    };

    const handleCreateBooking = async (data: Parameters<typeof ownerService.createManualBooking>[0]) => {
        const newBooking = await ownerService.createManualBooking(data);
        setBookings(prev => [newBooking, ...prev]);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Bookings</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{bookings.length} total bookings</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    disabled={!hasActiveSubscription}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                        hasActiveSubscription
                            ? 'text-white bg-primary hover:bg-emerald-600'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                    title={hasActiveSubscription ? 'Create a new booking' : 'Subscribe to create bookings'}
                >
                    <span className="material-symbols-outlined text-lg">{hasActiveSubscription ? 'add' : 'lock'}</span>
                    Create Booking
                </button>
            </div>

            <SubscriptionGate>
            {/* Search */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
                <input
                    type="text"
                    placeholder="Search by guest or lot name..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {(['all', 'confirmed', 'pending', 'pending_payment', 'checked_in', 'completed', 'cancelled'] as const).map((f) => {
                    const labels: Record<string, string> = {
                        all: 'All',
                        confirmed: 'Confirmed',
                        pending: 'Pending',
                        pending_payment: 'Awaiting Payment',
                        checked_in: 'Checked In',
                        completed: 'Completed',
                        cancelled: 'Cancelled',
                    };
                    return (
                    <button
                        key={f}
                        onClick={() => { setFilter(f); setCurrentPage(1); }}
                        className={clsx(
                            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                            filter === f
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        )}
                    >
                        {labels[f]}
                    </button>
                    );
                })}
            </div>

            {/* Bookings List - Mobile Friendly */}
            <div className="space-y-3">
                {paginatedBookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-[#111418] dark:text-white">{booking.userName}</h3>
                                    {booking.bookingSource && booking.bookingSource !== 'ONLINE' && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                            {booking.bookingSource}
                                        </span>
                                    )}
                                </div>
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

                        {/* Inline error banner */}
                        {actionError?.bookingId === booking.id && (
                            <div className="mt-3 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg">
                                <span className="material-symbols-outlined text-base">error</span>
                                <span className="flex-1">{actionError.message}</span>
                                <button
                                    onClick={() => setActionError(null)}
                                    className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
                                >
                                    <span className="material-symbols-outlined text-base">close</span>
                                </button>
                            </div>
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

                        {/* Cancel Button for Pending Payment Bookings */}
                        {booking.status === 'pending_payment' && (
                            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => handleReject(booking.id)}
                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                    Cancel
                                </button>
                            </div>
                        )}

                        {/* Check In Button for Confirmed Bookings — only when check-in date is today or earlier */}
                        {booking.status === 'confirmed' && (() => {
                            const [d, m, y] = booking.startDate.split('/');
                            const checkInDate = new Date(`${y}-${m}-${d}`);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            // Allow check-in from 1 day before check-in date
                            const earliestCheckIn = new Date(checkInDate);
                            earliestCheckIn.setDate(earliestCheckIn.getDate() - 1);
                            const canCheckIn = today >= earliestCheckIn;
                            return (
                                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <button
                                        onClick={() => handleCheckIn(booking.id)}
                                        disabled={!canCheckIn}
                                        className={clsx(
                                            "flex-1 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1",
                                            canCheckIn
                                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                        )}
                                        title={canCheckIn ? 'Check in guest' : `Check-in available from ${booking.startDate}`}
                                    >
                                        <span className="material-symbols-outlined text-lg">login</span>
                                        {canCheckIn ? 'Check In' : `Check-in from ${booking.startDate}`}
                                    </button>
                                </div>
                            );
                        })()}

                        {/* Check Out Button for Checked In Bookings */}
                        {booking.status === 'checked_in' && (
                            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => handleCheckOut(booking.id)}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-lg">logout</span>
                                    Check Out
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {filteredBookings.length > PAGE_SIZE && (
                <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filteredBookings.length)} of {filteredBookings.length}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={safePage <= 1}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={safePage >= totalPages}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">calendar_month</span>
                    <p className="text-gray-500 dark:text-gray-400">No bookings found</p>
                </div>
            )}

            </SubscriptionGate>

            <ManualBookingModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateBooking}
                lots={lots}
            />
        </div>
    );
};
