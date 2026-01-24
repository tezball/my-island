import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { campsiteService } from '../services/campsiteService';
import type { Booking } from '../services/adminService';
import { Link } from 'react-router-dom';

export const TripsPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            if (user) {
                try {
                    const userBookings = await campsiteService.getUserBookings(user.id);
                    setBookings(userBookings);
                } catch (error) {
                    console.error('Failed to fetch bookings:', error);
                }
            }
            setIsLoading(false);
        };

        fetchBookings();
    }, [user]);

    // Parse DD/MM/YYYY to Date object
    const parseDate = (dateStr: string): Date => {
        const [d, m, y] = dateStr.split('/');
        return new Date(`${y}-${m}-${d}`);
    };

    // Categorize bookings
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcomingBookings = bookings.filter(b => {
        const startDate = parseDate(b.startDate);
        return startDate >= now && b.status !== 'cancelled';
    });

    const pastBookings = bookings.filter(b => {
        const endDate = parseDate(b.endDate);
        return endDate < now && b.status !== 'cancelled';
    });

    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

    const getStatusBadge = (status: Booking['status']) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        Confirmed
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        Pending
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <span className="material-symbols-outlined text-xs">cancel</span>
                        Cancelled
                    </span>
                );
        }
    };

    const BookingCard: React.FC<{ booking: Booking; isPast?: boolean }> = ({ booking, isPast }) => {
        const startDate = parseDate(booking.startDate);
        const endDate = parseDate(booking.endDate);
        const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        // Calculate days until trip
        const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return (
            <div className={`bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden ${isPast ? 'opacity-75' : ''}`}>
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-[#111418] dark:text-white">{booking.lotName}</h3>
                        {getStatusBadge(booking.status)}
                    </div>
                    {!isPast && booking.status !== 'cancelled' && daysUntil > 0 && (
                        <p className="text-sm text-primary font-medium">
                            {daysUntil === 1 ? 'Tomorrow!' : `In ${daysUntil} days`}
                        </p>
                    )}
                    {!isPast && booking.status !== 'cancelled' && daysUntil === 0 && (
                        <p className="text-sm text-primary font-medium">Today - Check-in day!</p>
                    )}
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-500">calendar_month</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Dates</p>
                            <p className="font-medium text-[#111418] dark:text-white">
                                {booking.startDate} - {booking.endDate}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-500">dark_mode</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                            <p className="font-medium text-[#111418] dark:text-white">
                                {nights} night{nights > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    {booking.details && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-yellow-600">bolt</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Extras</p>
                                <p className="font-medium text-[#111418] dark:text-white">Electric Hookup</p>
                            </div>
                        </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">Total</span>
                            <span className="text-xl font-bold text-primary">€{booking.totalPrice}</span>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                {!isPast && booking.status !== 'cancelled' && (
                    <div className="px-4 pb-4">
                        <button
                            onClick={() => setSelectedBooking(booking)}
                            className="w-full py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                        >
                            View Details
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-gray-400">login</span>
                </div>
                <h2 className="text-xl font-semibold text-[#111418] dark:text-white mb-2">Sign in to view your trips</h2>
                <p className="text-gray-500 text-center mb-6">Keep track of your upcoming and past camping adventures</p>
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

    const hasNoBookings = bookings.length === 0;

    return (
        <div className="pb-24">
            {/* Header */}
            <div className="p-4 pt-6">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white">My Trips</h1>
                <p className="text-gray-500 mt-1">Manage your camping adventures</p>
            </div>

            {hasNoBookings ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-4xl text-gray-400">luggage</span>
                    </div>
                    <h2 className="text-xl font-semibold text-[#111418] dark:text-white mb-2">No trips yet</h2>
                    <p className="text-gray-500 text-center mb-6">Start planning your next camping adventure!</p>
                    <Link
                        to="/"
                        className="bg-primary hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                    >
                        Explore Campsites
                    </Link>
                </div>
            ) : (
                <div className="px-4 space-y-6">
                    {/* Upcoming Trips */}
                    {upcomingBookings.length > 0 && (
                        <section>
                            <h2 className="text-lg font-semibold text-[#111418] dark:text-white mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">event_upcoming</span>
                                Upcoming Trips
                            </h2>
                            <div className="space-y-4">
                                {upcomingBookings.map(booking => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Past Trips */}
                    {pastBookings.length > 0 && (
                        <section>
                            <h2 className="text-lg font-semibold text-[#111418] dark:text-white mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-400">history</span>
                                Past Trips
                            </h2>
                            <div className="space-y-4">
                                {pastBookings.map(booking => (
                                    <BookingCard key={booking.id} booking={booking} isPast />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Cancelled Trips */}
                    {cancelledBookings.length > 0 && (
                        <section>
                            <h2 className="text-lg font-semibold text-[#111418] dark:text-white mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-400">event_busy</span>
                                Cancelled
                            </h2>
                            <div className="space-y-4">
                                {cancelledBookings.map(booking => (
                                    <BookingCard key={booking.id} booking={booking} isPast />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-primary text-white p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Booking Confirmation</h2>
                                    <p className="text-white/80 text-sm">Reference: #{selectedBooking.id.toUpperCase()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Status */}
                            <div className="flex justify-center">
                                {getStatusBadge(selectedBooking.status)}
                            </div>

                            {/* Accommodation */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                <h3 className="font-semibold text-[#111418] dark:text-white mb-1">{selectedBooking.lotName}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    Nore Valley Park, Kilkenny
                                </p>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Check-in</p>
                                    <p className="font-semibold text-[#111418] dark:text-white">{selectedBooking.startDate}</p>
                                    <p className="text-xs text-gray-500">After 2:00 PM</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Check-out</p>
                                    <p className="font-semibold text-[#111418] dark:text-white">{selectedBooking.endDate}</p>
                                    <p className="text-xs text-gray-500">Before 11:00 AM</p>
                                </div>
                            </div>

                            {/* Guest */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Guest</p>
                                    <p className="font-semibold text-[#111418] dark:text-white">{selectedBooking.userName}</p>
                                </div>
                            </div>

                            {/* Extras */}
                            {selectedBooking.details && (
                                <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-yellow-600">bolt</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Extras Included</p>
                                        <p className="font-semibold text-[#111418] dark:text-white">Electric Hookup</p>
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Total Paid</span>
                                    <span className="text-2xl font-bold text-primary">€{selectedBooking.totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 pt-0 space-y-3">
                            <Link
                                to="/campsite/nore-valley-owner"
                                className="block w-full py-3 text-center font-semibold text-primary border border-primary rounded-xl hover:bg-primary/5 transition-colors"
                            >
                                View Campsite
                            </Link>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="w-full py-3 font-semibold text-white bg-primary hover:bg-emerald-600 rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
