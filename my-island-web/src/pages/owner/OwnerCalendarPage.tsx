import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOwnerSubscription } from '../../context/OwnerSubscriptionContext';
import { ownerService } from '../../services/ownerService';
import type { Booking, Lot, BlockedPeriod } from '../../types/booking';
import { BlockDatesModal } from '../../components/owner/BlockDatesModal';
import { ManualBookingModal } from '../../components/owner/ManualBookingModal';
import { SubscriptionGate } from '../../components/owner/SubscriptionGate';
import clsx from 'clsx';

const STATUS_COLORS: Record<string, { dot: string; bg: string; text: string; badge: string }> = {
    confirmed: {
        dot: 'bg-green-500',
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-400',
        badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    pending: {
        dot: 'bg-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-700 dark:text-amber-400',
        badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    cancelled: {
        dot: 'bg-red-500',
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-400',
        badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    completed: {
        dot: 'bg-gray-400',
        bg: 'bg-gray-50 dark:bg-gray-800',
        text: 'text-gray-600 dark:text-gray-400',
        badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    },
    checked_in: {
        dot: 'bg-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-400',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
};

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
}

function formatMonthYear(date: Date): string {
    return date.toLocaleDateString('en-IE', { month: 'long', year: 'numeric' });
}

function toDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function statusLabel(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export const OwnerCalendarPage: React.FC = () => {
    const { user } = useAuth();
    const { subscription } = useOwnerSubscription();
    const hasActiveSubscription = subscription?.hasActiveSubscription ?? false;
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [lots, setLots] = useState<Lot[]>([]);
    const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showCreateBookingModal, setShowCreateBookingModal] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const todayStr = useMemo(() => toDateStr(new Date()), []);

    useEffect(() => {
        const load = async () => {
            if (!user) return;
            try {
                const [b, l, bp] = await Promise.all([
                    ownerService.getOwnerBookings(user.id),
                    ownerService.getOwnerLots(user.id),
                    ownerService.getBlockedPeriods(),
                ]);
                setBookings(b);
                setLots(l);
                setBlockedPeriods(bp);
            } catch (error) {
                console.error('Failed to load calendar data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [user]);

    const filteredBookings = useMemo(() => {
        if (!selectedLotId) return bookings;
        return bookings.filter(b => b.lotId === selectedLotId);
    }, [bookings, selectedLotId]);

    // Build date -> bookings map. A booking occupies startDate to endDate - 1 day.
    const dateBookingsMap = useMemo(() => {
        const map = new Map<string, Booking[]>();
        for (const booking of filteredBookings) {
            const start = new Date(booking.startDate + 'T00:00:00');
            const end = new Date(booking.endDate + 'T00:00:00');
            for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
                const key = toDateStr(d);
                const existing = map.get(key);
                if (existing) {
                    existing.push(booking);
                } else {
                    map.set(key, [booking]);
                }
            }
        }
        return map;
    }, [filteredBookings]);

    // Build date -> blocked periods map
    const dateBlockedMap = useMemo(() => {
        const map = new Map<string, BlockedPeriod[]>();
        const filtered = selectedLotId ? blockedPeriods.filter(bp => bp.lotId === selectedLotId) : blockedPeriods;
        for (const bp of filtered) {
            const start = new Date(bp.startDate + 'T00:00:00');
            const end = new Date(bp.endDate + 'T00:00:00');
            for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
                const key = toDateStr(d);
                const existing = map.get(key);
                if (existing) {
                    existing.push(bp);
                } else {
                    map.set(key, [bp]);
                }
            }
        }
        return map;
    }, [blockedPeriods, selectedLotId]);

    // Summary stats for current month
    const stats = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        let monthBookings = 0;
        let pendingCount = 0;
        let checkInsToday = 0;

        for (const b of filteredBookings) {
            const start = new Date(b.startDate + 'T00:00:00');
            const end = new Date(b.endDate + 'T00:00:00');
            // Booking overlaps this month if start < month-end AND end > month-start
            const monthStart = new Date(year, month, 1);
            const monthEnd = new Date(year, month + 1, 1);
            if (start < monthEnd && end > monthStart) {
                monthBookings++;
            }
            if (b.status === 'pending') {
                pendingCount++;
            }
            if (b.startDate === todayStr && (b.status === 'confirmed' || b.status === 'pending')) {
                checkInsToday++;
            }
        }

        return { monthBookings, pendingCount, checkInsToday };
    }, [filteredBookings, currentMonth, todayStr]);

    // Calendar grid computation (Monday-first)
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // getDay: 0=Sun, 1=Mon... We want Mon=0
        const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

        const cells: Array<{ day: number; dateStr: string } | null> = [];
        for (let i = 0; i < firstDayOfWeek; i++) {
            cells.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            cells.push({ day, dateStr });
        }
        return cells;
    }, [currentMonth]);

    const bookingsForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        return dateBookingsMap.get(selectedDate) ?? [];
    }, [selectedDate, dateBookingsMap]);

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const handleCheckIn = async (bookingId: string) => {
        setActionLoading(bookingId);
        try {
            await ownerService.checkInBooking(bookingId);
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: 'checked_in' as const } : b
            ));
        } catch (error) {
            console.error('Failed to check in booking:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleCheckOut = async (bookingId: string) => {
        setActionLoading(bookingId);
        try {
            await ownerService.checkOutBooking(bookingId);
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: 'completed' as const } : b
            ));
        } catch (error) {
            console.error('Failed to check out booking:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleConfirm = async (bookingId: string) => {
        setActionLoading(bookingId);
        try {
            await ownerService.confirmBooking(bookingId);
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: 'confirmed' as const } : b
            ));
        } catch (error) {
            console.error('Failed to confirm booking:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (bookingId: string) => {
        setActionLoading(bookingId);
        try {
            await ownerService.cancelBooking(bookingId);
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
            ));
        } catch (error) {
            console.error('Failed to reject booking:', error);
        } finally {
            setActionLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading calendar...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Calendar</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">View your bookings across all lots</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowCreateBookingModal(true)}
                        disabled={!hasActiveSubscription}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            hasActiveSubscription
                                ? 'bg-primary hover:bg-emerald-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                        title={hasActiveSubscription ? 'Create a new booking' : 'Subscribe to create bookings'}
                    >
                        <span className="material-symbols-outlined text-lg">{hasActiveSubscription ? 'add' : 'lock'}</span>
                        Create Booking
                    </button>
                    <button
                        onClick={() => setShowBlockModal(true)}
                        disabled={!hasActiveSubscription}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            hasActiveSubscription
                                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                        title={hasActiveSubscription ? 'Block dates' : 'Subscribe to block dates'}
                    >
                        <span className="material-symbols-outlined text-lg">{hasActiveSubscription ? 'block' : 'lock'}</span>
                        Block Dates
                    </button>
                </div>
            </div>

            <SubscriptionGate>
            {/* Summary Stats - Desktop only */}
            <div className="hidden md:grid md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">calendar_month</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">{stats.monthBookings}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Bookings this month</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">pending_actions</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">{stats.pendingCount}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Pending approval</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">login</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">{stats.checkInsToday}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Check-ins today</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lot Filter */}
            {lots.length > 1 && (
                <>
                    {/* Mobile: select dropdown */}
                    <div className="md:hidden">
                        <select
                            value={selectedLotId ?? ''}
                            onChange={e => setSelectedLotId(e.target.value || null)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                        >
                            <option value="">All Lots</option>
                            {lots.map(lot => (
                                <option key={lot.id} value={lot.id}>{lot.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* Desktop: pill buttons */}
                    <div className="hidden md:flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedLotId(null)}
                            className={clsx(
                                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                                !selectedLotId
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            )}
                        >
                            All Lots
                        </button>
                        {lots.map(lot => (
                            <button
                                key={lot.id}
                                onClick={() => setSelectedLotId(lot.id)}
                                className={clsx(
                                    'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                                    selectedLotId === lot.id
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                )}
                            >
                                {lot.name}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Main layout: calendar + side panel on desktop */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Calendar */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                        {/* Month nav */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[#111418] dark:text-white">chevron_left</span>
                            </button>
                            <h3 className="text-base font-semibold text-[#111418] dark:text-white">
                                {formatMonthYear(currentMonth)}
                            </h3>
                            <button
                                type="button"
                                onClick={handleNextMonth}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[#111418] dark:text-white">chevron_right</span>
                            </button>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {DAY_HEADERS.map(day => (
                                <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((cell, i) => {
                                if (!cell) {
                                    return <div key={`empty-${i}`} className="min-h-[2.75rem] md:min-h-[4.5rem]" />;
                                }

                                const { day, dateStr } = cell;
                                const dayBookings = dateBookingsMap.get(dateStr) ?? [];
                                const dayBlocked = dateBlockedMap.get(dateStr) ?? [];
                                const isBlocked = dayBlocked.length > 0;
                                const isToday = dateStr === todayStr;
                                const isSelected = dateStr === selectedDate;

                                return (
                                    <button
                                        type="button"
                                        key={dateStr}
                                        onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                                        className={clsx(
                                            'min-h-[2.75rem] md:min-h-[4.5rem] rounded-lg p-1 text-left transition-colors relative flex flex-col',
                                            isSelected
                                                ? 'bg-primary/10 ring-2 ring-primary'
                                                : isBlocked
                                                ? 'bg-gray-100 dark:bg-gray-800/80'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                                            isToday && !isSelected && 'ring-2 ring-primary/50'
                                        )}
                                    >
                                        <span className={clsx(
                                            'text-xs font-medium leading-none',
                                            isToday ? 'text-primary font-bold' : 'text-[#111418] dark:text-white'
                                        )}>
                                            {day}
                                        </span>

                                        {/* Mobile: colored dots */}
                                        {dayBookings.length > 0 && (
                                            <div className="flex gap-0.5 mt-1 md:hidden flex-wrap">
                                                {dayBookings.slice(0, 3).map((b, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={clsx(
                                                            'w-1.5 h-1.5 rounded-full',
                                                            STATUS_COLORS[b.status]?.dot ?? 'bg-gray-400'
                                                        )}
                                                    />
                                                ))}
                                                {dayBookings.length > 3 && (
                                                    <span className="text-[8px] text-gray-400 leading-none">+{dayBookings.length - 3}</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Desktop: booking snippets */}
                                        {dayBookings.length > 0 && (
                                            <div className="hidden md:flex flex-col gap-0.5 mt-1 overflow-hidden flex-1 min-w-0">
                                                {dayBookings.slice(0, 2).map((b, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={clsx(
                                                            'text-[10px] leading-tight px-1 py-0.5 rounded truncate',
                                                            STATUS_COLORS[b.status]?.bg ?? 'bg-gray-50 dark:bg-gray-800',
                                                            STATUS_COLORS[b.status]?.text ?? 'text-gray-600'
                                                        )}
                                                    >
                                                        {b.userName.split(' ')[0]}
                                                    </div>
                                                ))}
                                                {dayBookings.length > 2 && (
                                                    <span className="text-[9px] text-gray-400 px-1">+{dayBookings.length - 2} more</span>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {[
                                { label: 'Confirmed', color: 'bg-green-500' },
                                { label: 'Checked In', color: 'bg-blue-500' },
                                { label: 'Pending', color: 'bg-amber-500' },
                                { label: 'Cancelled', color: 'bg-red-500' },
                                { label: 'Completed', color: 'bg-gray-400' },
                                { label: 'Blocked', color: 'bg-gray-600' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-1.5">
                                    <div className={clsx('w-2.5 h-2.5 rounded-full', item.color)} />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Day Detail Panel */}
                <div className="md:w-80 md:flex-shrink-0">
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4 md:sticky md:top-4">
                        {!selectedDate ? (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">touch_app</span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Select a day to view bookings</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-[#111418] dark:text-white">
                                        {formatDate(selectedDate)}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedDate(null)}
                                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <span className="material-symbols-outlined text-sm text-gray-400">close</span>
                                    </button>
                                </div>

                                {/* Blocked periods for this day */}
                                {selectedDate && (dateBlockedMap.get(selectedDate) ?? []).length > 0 && (
                                    <div className="mb-3 space-y-2">
                                        {(dateBlockedMap.get(selectedDate) ?? []).map(bp => (
                                            <div key={bp.id} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            <span className="material-symbols-outlined text-sm align-middle mr-1">block</span>
                                                            Blocked: {bp.lotName}
                                                        </p>
                                                        {bp.reason && (
                                                            <p className="text-xs text-gray-500 mt-0.5">{bp.reason}</p>
                                                        )}
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {formatDate(bp.startDate)} - {formatDate(bp.endDate)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await ownerService.deleteBlockedPeriod(bp.id);
                                                                setBlockedPeriods(prev => prev.filter(p => p.id !== bp.id));
                                                            } catch (error) {
                                                                console.error('Failed to remove blocked period:', error);
                                                            }
                                                        }}
                                                        className="text-xs text-red-500 hover:text-red-600 font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {bookingsForSelectedDate.length === 0 && (!selectedDate || (dateBlockedMap.get(selectedDate) ?? []).length === 0) ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No bookings on this day</p>
                                ) : bookingsForSelectedDate.length === 0 ? null : (
                                    <div className="space-y-3">
                                        {bookingsForSelectedDate.map(booking => (
                                            <div
                                                key={booking.id}
                                                className="border border-gray-100 dark:border-gray-700 rounded-lg p-3"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-sm text-[#111418] dark:text-white truncate">
                                                            {booking.userName}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                            {booking.lotName}
                                                        </p>
                                                    </div>
                                                    <span className={clsx(
                                                        'text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap ml-2',
                                                        STATUS_COLORS[booking.status]?.badge ?? 'bg-gray-100 text-gray-700'
                                                    )}>
                                                        {statusLabel(booking.status)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                                    </span>
                                                    <span className="font-bold text-primary">&euro;{booking.totalPrice}</span>
                                                </div>

                                                {booking.status === 'pending' && (
                                                    <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                                        <button
                                                            onClick={() => handleConfirm(booking.id)}
                                                            disabled={actionLoading === booking.id}
                                                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">check</span>
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(booking.id)}
                                                            disabled={actionLoading === booking.id}
                                                            className="flex-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 text-xs font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">close</span>
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}

                                                {booking.status === 'confirmed' && (
                                                    <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                                        <button
                                                            onClick={() => handleCheckIn(booking.id)}
                                                            disabled={actionLoading === booking.id}
                                                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">login</span>
                                                            Check In
                                                        </button>
                                                    </div>
                                                )}

                                                {booking.status === 'checked_in' && (
                                                    <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                                        <button
                                                            onClick={() => handleCheckOut(booking.id)}
                                                            disabled={actionLoading === booking.id}
                                                            className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">logout</span>
                                                            Check Out
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            </SubscriptionGate>

            <BlockDatesModal
                isOpen={showBlockModal}
                onClose={() => setShowBlockModal(false)}
                onSubmit={async (data) => {
                    const bp = await ownerService.createBlockedPeriod(data);
                    setBlockedPeriods(prev => [...prev, bp]);
                }}
                lots={lots}
                preselectedDate={selectedDate ?? undefined}
            />

            <ManualBookingModal
                isOpen={showCreateBookingModal}
                onClose={() => setShowCreateBookingModal(false)}
                onSubmit={async (data) => {
                    const newBooking = await ownerService.createManualBooking(data);
                    setBookings(prev => [...prev, newBooking]);
                }}
                lots={lots}
                preselectedDate={selectedDate ?? undefined}
            />
        </div>
    );
};
