import React from 'react';
import clsx from 'clsx';

type LotType = 'tent' | 'glamping' | 'rv' | 'cabin';

interface LotGridPreviewProps {
    type: LotType;
    count: number;
    maxDisplay?: number;
}

const TYPE_STYLES: Record<LotType, { shape: string; color: string; bgColor: string }> = {
    tent: {
        shape: 'rounded-full',
        color: 'bg-emerald-500',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    glamping: {
        shape: 'rounded-lg rotate-45',
        color: 'bg-amber-500',
        bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
    rv: {
        shape: 'rounded-sm',
        color: 'bg-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    cabin: {
        shape: 'rounded-md',
        color: 'bg-purple-500',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
};

export const LotGridPreview: React.FC<LotGridPreviewProps> = ({ type, count, maxDisplay = 20 }) => {
    const styles = TYPE_STYLES[type];
    const displayCount = Math.min(count, maxDisplay);
    const hasOverflow = count > maxDisplay;

    if (count === 0) {
        return (
            <div className="flex items-center justify-center h-8 text-xs text-gray-400 dark:text-gray-500">
                No lots configured
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-1.5 items-center">
            {Array.from({ length: displayCount }, (_, i) => (
                <div
                    key={i}
                    className={clsx(
                        'size-3 transition-all duration-300',
                        styles.shape,
                        styles.color,
                        'animate-in fade-in zoom-in'
                    )}
                    style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}
                />
            ))}
            {hasOverflow && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
                    +{count - maxDisplay} more
                </span>
            )}
        </div>
    );
};
