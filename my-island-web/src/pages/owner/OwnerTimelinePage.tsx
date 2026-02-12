import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ownerService } from '../../services/ownerService';
import type { Booking, Lot, BlockedPeriod } from '../../types/booking';
import { SubscriptionGate } from '../../components/owner/SubscriptionGate';
import { TimelineGrid } from '../../components/owner/timeline/TimelineGrid';
import { TimelineLegend } from '../../components/owner/timeline/TimelineLegend';
import { useTimelineData, type ViewRange } from '../../components/owner/timeline/useTimelineData';
import clsx from 'clsx';

function getDefaultAnchor(): Date {
    const d = new Date();
    // Start 2 days before today so today is visible in the first third
    d.setDate(d.getDate() - 2);
    d.setHours(0, 0, 0, 0);
    return d;
}

function rangeStep(range: ViewRange): number {
    switch (range) {
        case '1w': return 7;
        case '2w': return 14;
        case '1m': return 30;
    }
}

export const OwnerTimelinePage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [lots, setLots] = useState<Lot[]>([]);
    const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewRange, setViewRange] = useState<ViewRange>(() => {
        // Default to 1w on mobile, 2w on desktop
        return window.innerWidth < 768 ? '1w' : '2w';
    });
    const [anchorDate, setAnchorDate] = useState(getDefaultAnchor);

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
                console.error('Failed to load timeline data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [user]);

    const timelineData = useTimelineData(bookings, lots, blockedPeriods, viewRange, anchorDate);

    const handlePrev = useCallback(() => {
        setAnchorDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() - rangeStep(viewRange));
            return d;
        });
    }, [viewRange]);

    const handleNext = useCallback(() => {
        setAnchorDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() + rangeStep(viewRange));
            return d;
        });
    }, [viewRange]);

    const handleToday = useCallback(() => {
        setAnchorDate(getDefaultAnchor());
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading timeline...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Timeline</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Gantt view of bookings across all lots</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* View range selector */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                        {(['1w', '2w', '1m'] as ViewRange[]).map(r => (
                            <button
                                key={r}
                                onClick={() => setViewRange(r)}
                                className={clsx(
                                    'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                                    viewRange === r
                                        ? 'bg-white dark:bg-gray-700 text-[#111418] dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-[#111418] dark:hover:text-white',
                                )}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-1">
                        <button
                            aria-label="prev"
                            onClick={handlePrev}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg text-[#111418] dark:text-white">chevron_left</span>
                        </button>
                        <button
                            onClick={handleToday}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-[#111418] dark:text-white"
                        >
                            Today
                        </button>
                        <button
                            aria-label="next"
                            onClick={handleNext}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg text-[#111418] dark:text-white">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            <SubscriptionGate>
                {lots.length === 0 ? (
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">view_timeline</span>
                        <p className="text-gray-500 dark:text-gray-400">No lots found. Add lots to see the timeline.</p>
                    </div>
                ) : (
                    <>
                        <TimelineGrid data={timelineData} />
                        <TimelineLegend />
                    </>
                )}
            </SubscriptionGate>
        </div>
    );
};
