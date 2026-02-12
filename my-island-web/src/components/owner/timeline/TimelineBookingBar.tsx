import React from 'react';
import type { TimelineBookingBar as BookingBarData } from './useTimelineData';
import clsx from 'clsx';

interface Props {
    bar: BookingBarData;
    totalDays: number;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const STATUS_BAR_COLORS: Record<string, string> = {
    confirmed: 'bg-green-500',
    pending: 'bg-amber-500',
    checked_in: 'bg-blue-500',
    completed: 'bg-gray-400',
    cancelled: 'bg-red-500',
};

export const TimelineBookingBar: React.FC<Props> = ({ bar, totalDays, onClick }) => {
    const left = (bar.startCol / totalDays) * 100;
    const width = (bar.span / totalDays) * 100;
    const firstName = bar.booking.userName.split(' ')[0];
    const bgClass = STATUS_BAR_COLORS[bar.booking.status] ?? 'bg-gray-400';

    return (
        <div
            data-testid="timeline-booking-bar"
            className={clsx(
                'absolute top-1 bottom-1 rounded-md cursor-pointer hover:brightness-110 transition-all text-white text-[10px] md:text-xs font-medium flex items-center px-1.5 overflow-hidden whitespace-nowrap',
                bgClass,
            )}
            style={{
                left: `${left}%`,
                width: `${width}%`,
                zIndex: 2,
                minWidth: '8px',
            }}
            onClick={onClick}
            title={`${bar.booking.userName} — ${bar.booking.lotName}`}
        >
            <span className="hidden md:inline truncate">{firstName}</span>
        </div>
    );
};
