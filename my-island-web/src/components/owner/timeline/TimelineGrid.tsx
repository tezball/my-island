import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { TimelineData } from './useTimelineData';
import { TimelineHeader } from './TimelineHeader';
import { TimelineLotRow } from './TimelineLotRow';
import { TimelineBookingPopover } from './TimelineBookingPopover';
import type { Booking } from '../../../types/booking';
import clsx from 'clsx';

interface Props {
    data: TimelineData;
}

export const TimelineGrid: React.FC<Props> = ({ data }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
    const [popover, setPopover] = useState<{ booking: Booking; rect: DOMRect } | null>(null);
    const [todayLineLeft, setTodayLineLeft] = useState<number | null>(null);

    const totalDays = data.days.length;

    // Calculate today line position from DOM measurements
    const updateTodayLine = useCallback(() => {
        if (data.todayIndex === null || !scrollRef.current) {
            setTodayLineLeft(null);
            return;
        }
        // Find the first date header element to measure the grid area
        const headers = scrollRef.current.querySelectorAll('[data-testid="timeline-date-header"]');
        if (headers.length > 0 && data.todayIndex < headers.length) {
            const todayHeader = headers[data.todayIndex] as HTMLElement;
            const containerRect = scrollRef.current.getBoundingClientRect();
            const headerRect = todayHeader.getBoundingClientRect();
            // Position relative to scroll container's scrollLeft
            const left = headerRect.left - containerRect.left + scrollRef.current.scrollLeft + headerRect.width / 2;
            setTodayLineLeft(left);
        }
    }, [data.todayIndex]);

    // Auto-scroll to today on mount, then update today line
    useEffect(() => {
        if (!scrollRef.current) return;

        // Measure after render
        requestAnimationFrame(() => {
            if (data.todayIndex !== null && scrollRef.current) {
                const headers = scrollRef.current.querySelectorAll('[data-testid="timeline-date-header"]');
                if (headers.length > 0 && data.todayIndex < headers.length) {
                    const todayHeader = headers[data.todayIndex] as HTMLElement;
                    const containerRect = scrollRef.current.getBoundingClientRect();
                    const headerRect = todayHeader.getBoundingClientRect();
                    const scrollTarget = headerRect.left - containerRect.left + scrollRef.current.scrollLeft - containerRect.width / 3;
                    scrollRef.current.scrollLeft = Math.max(0, scrollTarget);
                }
            }
            updateTodayLine();
        });
    }, [data.todayIndex, totalDays, updateTodayLine]);

    const toggleGroup = (type: string) => {
        setCollapsedGroups(prev => {
            const next = new Set(prev);
            if (next.has(type)) next.delete(type);
            else next.add(type);
            return next;
        });
    };

    const handleBookingClick = (booking: Booking, rect: DOMRect) => {
        setPopover(prev => prev?.booking.id === booking.id ? null : { booking, rect });
    };

    return (
        <div
            ref={scrollRef}
            className="overflow-x-auto bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 relative"
            style={{
                '--lot-col-width': 'clamp(100px, 15vw, 160px)',
            } as React.CSSProperties}
            onScroll={updateTodayLine}
        >
            {/* Header */}
            <TimelineHeader days={data.days} todayIndex={data.todayIndex} />

            {/* Groups and rows */}
            {data.groups.map(group => (
                <div key={group.type}>
                    {/* Group header */}
                    <div
                        data-testid="timeline-group-header"
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => toggleGroup(group.type)}
                    >
                        <span className={clsx(
                            'material-symbols-outlined text-sm text-gray-400 transition-transform',
                            collapsedGroups.has(group.type) && '-rotate-90',
                        )}>
                            expand_more
                        </span>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            {group.label}
                        </span>
                        <span className="text-[10px] text-gray-400">
                            ({group.rows.length})
                        </span>
                    </div>

                    {/* Lot rows */}
                    {!collapsedGroups.has(group.type) && group.rows.map(row => (
                        <TimelineLotRow
                            key={row.lot.id}
                            row={row}
                            totalDays={totalDays}
                            days={data.days}
                            todayIndex={data.todayIndex}
                            onBookingClick={handleBookingClick}
                        />
                    ))}
                </div>
            ))}

            {/* Today line - absolutely positioned within scrollable content */}
            {todayLineLeft !== null && (
                <div
                    data-testid="timeline-today-line"
                    className="absolute pointer-events-none top-0 bottom-0"
                    style={{
                        left: `${todayLineLeft}px`,
                        width: '2px',
                        borderLeft: '2px dashed #059669',
                        zIndex: 5,
                    }}
                />
            )}

            {/* Popover */}
            {popover && (
                <TimelineBookingPopover
                    booking={popover.booking}
                    anchorRect={popover.rect}
                    onClose={() => setPopover(null)}
                />
            )}
        </div>
    );
};
