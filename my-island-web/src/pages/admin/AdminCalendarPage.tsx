import React, { useEffect, useState, useMemo } from 'react';
import { adminService, type Booking, type Lot } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

// Parse DD/MM/YYYY date format
const parseDate = (dateStr: string): Date => {
    if (dateStr.includes('/')) {
        const [d, m, y] = dateStr.split('/').map(Number);
        return new Date(y, m - 1, d);
    }
    return new Date(dateStr);
};

// Format date for display
const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// Get week dates starting from a given date (Monday)
const getWeekDates = (startDate: Date): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
    }
    return dates;
};

// Get Monday of current week
const getMonday = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

// Check if a booking overlaps with a date
const isBookingOnDate = (booking: Booking, date: Date): boolean => {
    const start = parseDate(booking.startDate);
    const end = parseDate(booking.endDate);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return checkDate >= start && checkDate < end;
};

// Get status color for booking
const getStatusColor = (status: Booking['status']): string => {
    switch (status) {
        case 'confirmed': return 'bg-green-500';
        case 'pending': return 'bg-yellow-500';
        case 'checked_in': return 'bg-blue-500';
        case 'completed': return 'bg-gray-400';
        case 'cancelled': return 'bg-red-300';
        default: return 'bg-gray-300';
    }
};

export const AdminCalendarPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [lots, setLots] = useState<Lot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [weekStart, setWeekStart] = useState<Date>(getMonday(new Date()));

    useEffect(() => {
        loadData();
    }, [user?.id]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [bookingsData, lotsData] = await Promise.all([
                adminService.getBookings(),
                adminService.getLots(user?.id)
            ]);
            setBookings(bookingsData);
            setLots(lotsData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

    const goToPreviousWeek = () => {
        const newStart = new Date(weekStart);
        newStart.setDate(weekStart.getDate() - 7);
        setWeekStart(newStart);
    };

    const goToNextWeek = () => {
        const newStart = new Date(weekStart);
        newStart.setDate(weekStart.getDate() + 7);
        setWeekStart(newStart);
    };

    const goToToday = () => {
        setWeekStart(getMonday(new Date()));
    };

    // Get booking for a specific lot and date
    const getBookingForLotAndDate = (lotId: string, date: Date): Booking | undefined => {
        return bookings.find(b =>
            b.lotId === lotId &&
            isBookingOnDate(b, date) &&
            b.status !== 'cancelled'
        );
    };

    // Check if date is today
    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Group lots by type for better organization
    const lotsByType = lots.reduce((acc, lot) => {
        if (!acc[lot.type]) acc[lot.type] = [];
        acc[lot.type].push(lot);
        return acc;
    }, {} as Record<string, Lot[]>);

    const typeLabels: Record<string, string> = {
        tent: 'Tent Spots',
        rv: 'Caravan/RV',
        cabin: 'Cabins',
        lodge: 'Lodges',
        'mobile-home': 'Mobile Homes'
    };

    return (
        <div className="max-w-full mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Availability Calendar</h1>

                {/* Week Navigation */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPreviousWeek}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToNextWeek}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Week Header */}
            <div className="text-center mb-4">
                <p className="text-lg font-semibold text-[#111418] dark:text-white">
                    {formatDate(weekDates[0])} - {formatDate(weekDates[6])}, {weekDates[0].getFullYear()}
                </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Checked In</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-400"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 w-48 sticky left-0 bg-gray-50 dark:bg-gray-900/50">
                                    Accommodation
                                </th>
                                {weekDates.map((date, i) => (
                                    <th
                                        key={i}
                                        className={`px-2 py-3 text-center text-sm font-semibold min-w-[100px] ${
                                            isToday(date)
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-xs uppercase">
                                                {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                                            </span>
                                            <span className={`text-lg ${isToday(date) ? 'font-bold' : ''}`}>
                                                {date.getDate()}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(lotsByType).map(([type, typeLots]) => (
                                <React.Fragment key={type}>
                                    {/* Type Header Row */}
                                    <tr className="bg-gray-100 dark:bg-gray-800">
                                        <td
                                            colSpan={8}
                                            className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 sticky left-0 bg-gray-100 dark:bg-gray-800"
                                        >
                                            {typeLabels[type] || type} ({typeLots.length})
                                        </td>
                                    </tr>
                                    {/* Lot Rows */}
                                    {typeLots.slice(0, 5).map((lot) => (
                                        <tr key={lot.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-4 py-2 text-sm font-medium text-[#111418] dark:text-white sticky left-0 bg-white dark:bg-[#1a2632]">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${lot.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    {lot.name}
                                                </div>
                                            </td>
                                            {weekDates.map((date, i) => {
                                                const booking = getBookingForLotAndDate(lot.id, date);
                                                return (
                                                    <td
                                                        key={i}
                                                        className={`px-1 py-2 text-center border-l border-gray-100 dark:border-gray-800 ${
                                                            isToday(date) ? 'bg-primary/5' : ''
                                                        }`}
                                                    >
                                                        {booking ? (
                                                            <div
                                                                className={`${getStatusColor(booking.status)} text-white text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80`}
                                                                title={`${booking.userName}\n${booking.startDate} - ${booking.endDate}`}
                                                            >
                                                                {booking.userName.split(' ')[0]}
                                                            </div>
                                                        ) : (
                                                            <div className="h-6 bg-gray-50 dark:bg-gray-800 rounded"></div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    {typeLots.length > 5 && (
                                        <tr className="border-t border-gray-100 dark:border-gray-800">
                                            <td colSpan={8} className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 italic">
                                                + {typeLots.length - 5} more {typeLabels[type]?.toLowerCase() || type}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white dark:bg-[#1a2632] rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
                    <p className="text-2xl font-bold text-[#111418] dark:text-white">
                        {bookings.filter(b =>
                            weekDates.some(d => isBookingOnDate(b, d)) &&
                            b.status !== 'cancelled'
                        ).length}
                    </p>
                    <p className="text-xs text-gray-400">Active Bookings</p>
                </div>
                <div className="bg-white dark:bg-[#1a2632] rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Check-ins Today</p>
                    <p className="text-2xl font-bold text-green-600">
                        {bookings.filter(b => {
                            const start = parseDate(b.startDate);
                            const today = new Date();
                            return start.toDateString() === today.toDateString() && b.status === 'confirmed';
                        }).length}
                    </p>
                    <p className="text-xs text-gray-400">Arriving</p>
                </div>
                <div className="bg-white dark:bg-[#1a2632] rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Check-outs Today</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {bookings.filter(b => {
                            const end = parseDate(b.endDate);
                            const today = new Date();
                            return end.toDateString() === today.toDateString() &&
                                   (b.status === 'confirmed' || b.status === 'checked_in');
                        }).length}
                    </p>
                    <p className="text-xs text-gray-400">Departing</p>
                </div>
                <div className="bg-white dark:bg-[#1a2632] rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Available Lots</p>
                    <p className="text-2xl font-bold text-[#111418] dark:text-white">
                        {lots.filter(l => l.isAvailable).length}
                    </p>
                    <p className="text-xs text-gray-400">of {lots.length} total</p>
                </div>
            </div>
        </div>
    );
};
