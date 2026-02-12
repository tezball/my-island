import React, { useEffect, useRef } from 'react';
import type { Booking } from '../../../types/booking';
import { STATUS_COLORS, statusLabel } from '../../../constants/bookingStatus';
import clsx from 'clsx';

interface Props {
    booking: Booking;
    anchorRect: DOMRect;
    onClose: () => void;
}

export const TimelineBookingPopover: React.FC<Props> = ({ booking, anchorRect, onClose }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    const formatDate = (d: string) =>
        new Date(d + 'T00:00:00').toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });

    // Position below the bar
    const style: React.CSSProperties = {
        position: 'fixed',
        top: anchorRect.bottom + 4,
        left: Math.max(8, anchorRect.left),
        zIndex: 100,
    };

    return (
        <div
            ref={ref}
            data-testid="timeline-popover"
            style={style}
            className="bg-white dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 w-64"
        >
            <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm text-[#111418] dark:text-white truncate">
                    {booking.userName}
                </p>
                <span className={clsx(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap ml-2',
                    STATUS_COLORS[booking.status]?.badge ?? 'bg-gray-100 text-gray-700'
                )}>
                    {statusLabel(booking.status)}
                </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{booking.lotName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(booking.startDate)} &ndash; {formatDate(booking.endDate)}
            </p>
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm font-bold text-primary">&euro;{booking.totalPrice}</span>
            </div>
        </div>
    );
};
