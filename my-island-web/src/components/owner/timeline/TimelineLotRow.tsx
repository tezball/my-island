import React from 'react';
import type { TimelineRow } from './useTimelineData';
import { TimelineBookingBar } from './TimelineBookingBar';
import { TimelineBlockedBar } from './TimelineBlockedBar';
import type { Booking } from '../../../types/booking';

interface Props {
    row: TimelineRow;
    totalDays: number;
    days: string[];
    todayIndex: number | null;
    onBookingClick: (booking: Booking, rect: DOMRect) => void;
}

export const TimelineLotRow: React.FC<Props> = ({ row, totalDays, days, onBookingClick }) => {
    return (
        <div className="flex border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
            {/* Sticky lot name */}
            <div
                className="shrink-0 flex items-center px-3 py-2 bg-white dark:bg-[#1a2632] border-r border-gray-200 dark:border-gray-700 sticky left-0 z-10"
                style={{ width: 'var(--lot-col-width)' }}
            >
                <span
                    data-testid="timeline-lot-name"
                    className="text-xs font-medium text-[#111418] dark:text-white truncate"
                    title={row.lot.name}
                >
                    {row.lot.name}
                </span>
            </div>

            {/* Bar container */}
            <div className="flex-1 relative" style={{ minHeight: '36px' }}>
                {/* Weekend shading columns */}
                {days.map((dateStr, i) => {
                    const d = new Date(dateStr + 'T00:00:00');
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                    if (!isWeekend) return null;
                    return (
                        <div
                            key={dateStr}
                            className="absolute top-0 bottom-0 bg-gray-50 dark:bg-gray-800/30"
                            style={{
                                left: `${(i / totalDays) * 100}%`,
                                width: `${(1 / totalDays) * 100}%`,
                            }}
                        />
                    );
                })}

                {/* Blocked bars (lower z-index) */}
                {row.blockedPeriods.map(bar => (
                    <TimelineBlockedBar key={bar.id} bar={bar} totalDays={totalDays} />
                ))}

                {/* Booking bars */}
                {row.bookings.map(bar => (
                    <TimelineBookingBar
                        key={bar.id}
                        bar={bar}
                        totalDays={totalDays}
                        onClick={(e) => {
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            onBookingClick(bar.booking, rect);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
