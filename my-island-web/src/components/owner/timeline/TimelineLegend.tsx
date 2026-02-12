import React from 'react';

const LEGEND_ITEMS = [
    { label: 'Confirmed', color: 'bg-green-500' },
    { label: 'Checked In', color: 'bg-blue-500' },
    { label: 'Pending', color: 'bg-amber-500' },
    { label: 'Completed', color: 'bg-gray-400' },
];

export const TimelineLegend: React.FC = () => {
    return (
        <div
            data-testid="timeline-legend"
            className="flex flex-wrap items-center gap-4 px-4 py-3 bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800"
        >
            {LEGEND_ITEMS.map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                </div>
            ))}
            <div className="flex items-center gap-1.5">
                <div
                    className="w-3 h-3 rounded-sm"
                    style={{
                        background: 'repeating-linear-gradient(45deg, #9ca3af, #9ca3af 2px, #e5e7eb 2px, #e5e7eb 4px)',
                    }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">Blocked</span>
            </div>
        </div>
    );
};
