import React from 'react';

interface BarData {
    label: string;
    value: number;
    color?: string;
}

interface SimpleBarChartProps {
    data: BarData[];
    orientation?: 'horizontal' | 'vertical';
    showValues?: boolean;
    valuePrefix?: string;
    valueSuffix?: string;
    maxValue?: number;
    barHeight?: number;
    className?: string;
}

const DEFAULT_COLORS = [
    'bg-primary',
    'bg-blue-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-lime-500',
];

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
    data,
    orientation = 'horizontal',
    showValues = true,
    valuePrefix = '',
    valueSuffix = '',
    maxValue,
    barHeight = 24,
    className = '',
}) => {
    const max = maxValue || Math.max(...data.map(d => d.value));

    if (orientation === 'vertical') {
        return (
            <div className={`flex items-end justify-between gap-2 h-40 ${className}`}>
                {data.map((item, index) => {
                    const heightPercent = max > 0 ? (item.value / max) * 100 : 0;
                    const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

                    return (
                        <div key={index} className="flex flex-col items-center flex-1 h-full">
                            <div className="flex-1 w-full flex items-end">
                                <div
                                    className={`w-full ${color} rounded-t-md transition-all duration-300`}
                                    style={{ height: `${heightPercent}%`, minHeight: item.value > 0 ? '4px' : '0' }}
                                />
                            </div>
                            {showValues && (
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
                                    {valuePrefix}{item.value.toLocaleString()}{valueSuffix}
                                </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-center truncate w-full">
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Horizontal bars
    return (
        <div className={`space-y-3 ${className}`}>
            {data.map((item, index) => {
                const widthPercent = max > 0 ? (item.value / max) * 100 : 0;
                const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

                return (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                {item.label}
                            </span>
                            {showValues && (
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
                                    {valuePrefix}{item.value.toLocaleString()}{valueSuffix}
                                </span>
                            )}
                        </div>
                        <div
                            className="w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
                            style={{ height: `${barHeight}px` }}
                        >
                            <div
                                className={`h-full ${color} rounded-full transition-all duration-300`}
                                style={{ width: `${widthPercent}%`, minWidth: item.value > 0 ? '4px' : '0' }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
