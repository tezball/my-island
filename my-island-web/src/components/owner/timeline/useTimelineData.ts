import { useMemo } from 'react';
import type { Booking, Lot, BlockedPeriod } from '../../../types/booking';

export type ViewRange = '1w' | '2w' | '1m';

const LOT_TYPE_LABELS: Record<string, string> = {
    tent: 'Tent',
    touring: 'Touring',
    glamping: 'Glamping',
    cabin: 'Cabin',
    'mobile-home': 'Mobile Home',
};

const LOT_TYPE_ORDER: Record<string, number> = {
    tent: 0, touring: 1, glamping: 2, cabin: 3, 'mobile-home': 4,
};

export interface TimelineBar {
    id: string;
    startCol: number; // 0-based column index
    span: number;     // how many columns it spans
}

export interface TimelineBookingBar extends TimelineBar {
    booking: Booking;
}

export interface TimelineBlockedBar extends TimelineBar {
    blocked: BlockedPeriod;
}

export interface TimelineRow {
    lot: Lot;
    bookings: TimelineBookingBar[];
    blockedPeriods: TimelineBlockedBar[];
}

export interface TimelineGroup {
    type: string;
    label: string;
    rows: TimelineRow[];
}

export interface TimelineData {
    days: string[];          // ISO date strings for each column
    groups: TimelineGroup[];
    todayIndex: number | null;
}

function toDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getDays(anchor: Date, range: ViewRange): string[] {
    const days: string[] = [];
    let count: number;
    switch (range) {
        case '1w': count = 7; break;
        case '2w': count = 14; break;
        case '1m': count = 30; break;
    }
    const start = new Date(anchor);
    for (let i = 0; i < count; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(toDateStr(d));
    }
    return days;
}

function clampBar(startDate: string, endDate: string, days: string[]): { startCol: number; span: number } | null {
    const rangeStart = days[0];
    const rangeEnd = days[days.length - 1];

    // endDate is exclusive (checkout day), so the last occupied night is endDate - 1
    // A booking from June 1 to June 5 occupies columns for June 1,2,3,4
    if (endDate <= rangeStart || startDate > rangeEnd) return null;

    const startCol = Math.max(0, days.indexOf(startDate) !== -1 ? days.indexOf(startDate) : startDate < rangeStart ? 0 : -1);
    if (startCol === -1) return null;

    // Find the actual start col by clamping
    let s = 0;
    for (let i = 0; i < days.length; i++) {
        if (days[i] >= startDate) { s = i; break; }
    }

    // endDate is exclusive, so bar ends at endDate column (not inclusive)
    let e = days.length;
    for (let i = 0; i < days.length; i++) {
        if (days[i] >= endDate) { e = i; break; }
    }

    const span = e - s;
    if (span <= 0) return null;

    return { startCol: s, span };
}

export function useTimelineData(
    bookings: Booking[],
    lots: Lot[],
    blockedPeriods: BlockedPeriod[],
    viewRange: ViewRange,
    anchorDate: Date,
): TimelineData {
    return useMemo(() => {
        const days = getDays(anchorDate, viewRange);
        const todayStr = toDateStr(new Date());
        const todayIndex = days.indexOf(todayStr);

        // Group lots by type
        const groupMap = new Map<string, Lot[]>();
        for (const lot of lots) {
            const existing = groupMap.get(lot.type);
            if (existing) existing.push(lot);
            else groupMap.set(lot.type, [lot]);
        }

        // Sort groups by defined order, lots alphabetically within
        const groups: TimelineGroup[] = [...groupMap.entries()]
            .sort(([a], [b]) => (LOT_TYPE_ORDER[a] ?? 99) - (LOT_TYPE_ORDER[b] ?? 99))
            .map(([type, typeLots]) => {
                const sortedLots = [...typeLots].sort((a, b) => a.name.localeCompare(b.name));
                const rows: TimelineRow[] = sortedLots.map(lot => {
                    // Find bookings for this lot that overlap the visible range
                    const lotBookings = bookings
                        .filter(b => b.lotId === lot.id && b.status !== 'cancelled')
                        .map(b => {
                            const bar = clampBar(b.startDate, b.endDate, days);
                            if (!bar) return null;
                            return { id: b.id, ...bar, booking: b } as TimelineBookingBar;
                        })
                        .filter((b): b is TimelineBookingBar => b !== null);

                    const lotBlocked = blockedPeriods
                        .filter(bp => bp.lotId === lot.id)
                        .map(bp => {
                            const bar = clampBar(bp.startDate, bp.endDate, days);
                            if (!bar) return null;
                            return { id: bp.id, ...bar, blocked: bp } as TimelineBlockedBar;
                        })
                        .filter((b): b is TimelineBlockedBar => b !== null);

                    return { lot, bookings: lotBookings, blockedPeriods: lotBlocked };
                });

                return {
                    type,
                    label: LOT_TYPE_LABELS[type] ?? type,
                    rows,
                };
            });

        return { days, groups, todayIndex: todayIndex >= 0 ? todayIndex : null };
    }, [bookings, lots, blockedPeriods, viewRange, anchorDate]);
}
