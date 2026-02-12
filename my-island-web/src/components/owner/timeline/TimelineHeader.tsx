import React from 'react';
import clsx from 'clsx';

interface Props {
    days: string[];
    todayIndex: number | null;
}

function formatDayLabel(dateStr: string): { dow: string; day: string } {
    const d = new Date(dateStr + 'T00:00:00');
    const dow = d.toLocaleDateString('en-IE', { weekday: 'short' }).slice(0, 2);
    const day = String(d.getDate());
    return { dow, day };
}

function getMonthSpans(days: string[]): Array<{ label: string; span: number }> {
    const spans: Array<{ label: string; span: number }> = [];
    let current = '';
    let count = 0;

    for (const dateStr of days) {
        const d = new Date(dateStr + 'T00:00:00');
        const label = d.toLocaleDateString('en-IE', { month: 'short', year: 'numeric' });
        if (label === current) {
            count++;
        } else {
            if (current) spans.push({ label: current, span: count });
            current = label;
            count = 1;
        }
    }
    if (current) spans.push({ label: current, span: count });
    return spans;
}

export const TimelineHeader: React.FC<Props> = ({ days, todayIndex }) => {
    const monthSpans = getMonthSpans(days);

    return (
        <>
            {/* Month header row */}
            <div className="flex" style={{ marginLeft: 'var(--lot-col-width)' }}>
                {monthSpans.map((ms, i) => (
                    <div
                        key={i}
                        className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center border-b border-gray-200 dark:border-gray-700 py-1"
                        style={{ width: `${(ms.span / days.length) * 100}%` }}
                    >
                        {ms.label}
                    </div>
                ))}
            </div>
            {/* Day headers */}
            <div className="flex" style={{ marginLeft: 'var(--lot-col-width)' }}>
                {days.map((dateStr, i) => {
                    const { dow, day } = formatDayLabel(dateStr);
                    const isToday = i === todayIndex;
                    const d = new Date(dateStr + 'T00:00:00');
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

                    return (
                        <div
                            key={dateStr}
                            data-testid="timeline-date-header"
                            className={clsx(
                                'flex flex-col items-center justify-center py-1 text-center border-b border-gray-200 dark:border-gray-700',
                                isWeekend && 'bg-gray-50 dark:bg-gray-800/50',
                                isToday && 'bg-primary/10',
                            )}
                            style={{ width: `${100 / days.length}%` }}
                        >
                            <span className={clsx(
                                'text-[10px] leading-none',
                                isToday ? 'text-primary font-bold' : 'text-gray-400 dark:text-gray-500',
                            )}>
                                {dow}
                            </span>
                            <span className={clsx(
                                'text-xs font-medium leading-none mt-0.5',
                                isToday ? 'text-primary font-bold' : 'text-gray-600 dark:text-gray-300',
                            )}>
                                {day}
                            </span>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
