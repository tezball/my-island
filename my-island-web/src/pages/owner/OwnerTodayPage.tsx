import React, { useEffect, useState } from 'react';
import { ownerService } from '../../services/ownerService';
import type { Booking } from '../../types/booking';
import { SubscriptionGate } from '../../components/owner/SubscriptionGate';
import clsx from 'clsx';

export const OwnerTodayPage: React.FC = () => {
    const [arrivals, setArrivals] = useState<Booking[]>([]);
    const [departures, setDepartures] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await ownerService.getTodayMovements();
                setArrivals(data.arrivals);
                setDepartures(data.departures);
            } catch (error) {
                console.error('Failed to load today\'s movements:', error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const handleCheckIn = async (bookingId: string) => {
        setActionLoading(bookingId);
        try {
            await ownerService.checkInBooking(bookingId);
            setArrivals(prev => prev.filter(b => b.id !== bookingId));
        } catch (error) {
            console.error('Failed to check in:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleCheckOut = async (bookingId: string) => {
        setActionLoading(bookingId);
        try {
            await ownerService.checkOutBooking(bookingId);
            setDepartures(prev => prev.filter(b => b.id !== bookingId));
        } catch (error) {
            console.error('Failed to check out:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const sourceStyles: Record<string, string> = {
        DIRECT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        PHONE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        WALKIN: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Today</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formattedDate}</p>
            </div>

            <SubscriptionGate>
                {/* Summary strip */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400">login</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">{arrivals.length}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Arrivals</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">logout</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">{departures.length}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Departures</p>
                        </div>
                    </div>
                </div>

                {/* Arrivals section */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400">login</span>
                        <h2 className="text-lg font-semibold text-[#111418] dark:text-white">Arrivals</h2>
                    </div>
                    {arrivals.length === 0 ? (
                        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                            <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">event_available</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">No arrivals today</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {arrivals.map(booking => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    actionLabel="Check In"
                                    actionColor="bg-blue-600 hover:bg-blue-700"
                                    onAction={() => handleCheckIn(booking.id)}
                                    isLoading={actionLoading === booking.id}
                                    sourceStyles={sourceStyles}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Departures section */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">logout</span>
                        <h2 className="text-lg font-semibold text-[#111418] dark:text-white">Departures</h2>
                    </div>
                    {departures.length === 0 ? (
                        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                            <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">event_busy</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">No departures today</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {departures.map(booking => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    actionLabel="Check Out"
                                    actionColor="bg-amber-600 hover:bg-amber-700"
                                    onAction={() => handleCheckOut(booking.id)}
                                    isLoading={actionLoading === booking.id}
                                    sourceStyles={sourceStyles}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </SubscriptionGate>
        </div>
    );
};

const BookingCard: React.FC<{
    booking: Booking;
    actionLabel: string;
    actionColor: string;
    onAction: () => void;
    isLoading: boolean;
    sourceStyles: Record<string, string>;
}> = ({ booking, actionLabel, actionColor, onAction, isLoading, sourceStyles }) => {
    const guestName = booking.guestName || booking.userName || 'Guest';

    return (
        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
            {/* Guest name + source badge */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#111418] dark:text-white">{guestName}</span>
                    {booking.bookingSource && booking.bookingSource !== 'ONLINE' && (
                        <span className={clsx(
                            'text-xs font-medium px-2 py-0.5 rounded-full',
                            sourceStyles[booking.bookingSource] || 'bg-gray-100 text-gray-600'
                        )}>
                            {booking.bookingSource.charAt(0) + booking.bookingSource.slice(1).toLowerCase()}
                        </span>
                    )}
                </div>
            </div>

            {/* Lot name */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>{booking.lotName}</span>
            </div>

            {/* Contact info + num guests */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                {booking.guestPhone && (
                    <a href={`tel:${booking.guestPhone}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">phone</span>
                        <span>{booking.guestPhone}</span>
                    </a>
                )}
                {booking.guestEmail && (
                    <a href={`mailto:${booking.guestEmail}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">mail</span>
                        <span>{booking.guestEmail}</span>
                    </a>
                )}
                {booking.numGuests && booking.numGuests > 0 && (
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">group</span>
                        <span>{booking.numGuests} guest{booking.numGuests !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            {/* Action button */}
            <button
                onClick={onAction}
                disabled={isLoading}
                className={clsx(
                    'w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50',
                    actionColor
                )}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                    </span>
                ) : (
                    actionLabel
                )}
            </button>
        </div>
    );
};
