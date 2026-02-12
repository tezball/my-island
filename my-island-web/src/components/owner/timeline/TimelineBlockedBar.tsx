import React from 'react';
import type { TimelineBlockedBar as BlockedBarData } from './useTimelineData';

interface Props {
    bar: BlockedBarData;
    totalDays: number;
}

export const TimelineBlockedBar: React.FC<Props> = ({ bar, totalDays }) => {
    const left = (bar.startCol / totalDays) * 100;
    const width = (bar.span / totalDays) * 100;

    return (
        <div
            data-testid="timeline-blocked-bar"
            className="absolute top-1 bottom-1 rounded-md opacity-60"
            style={{
                left: `${left}%`,
                width: `${width}%`,
                zIndex: 1,
                background: 'repeating-linear-gradient(45deg, #9ca3af, #9ca3af 3px, #d1d5db 3px, #d1d5db 6px)',
            }}
            title={bar.blocked.reason || 'Blocked'}
        />
    );
};
