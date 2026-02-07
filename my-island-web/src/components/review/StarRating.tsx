import React from 'react';

interface StarDisplayProps {
    rating: number;
    size?: 'sm' | 'md' | 'lg';
}

export const StarDisplay: React.FC<StarDisplayProps> = ({ rating, size = 'md' }) => {
    const sizeClass = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(
                <span key={i} className={`material-symbols-outlined ${sizeClass} text-amber-400`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                </span>
            );
        } else if (rating >= i - 0.5) {
            stars.push(
                <span key={i} className={`material-symbols-outlined ${sizeClass} text-amber-400`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    star_half
                </span>
            );
        } else {
            stars.push(
                <span key={i} className={`material-symbols-outlined ${sizeClass} text-gray-300 dark:text-gray-600`}>
                    star
                </span>
            );
        }
    }

    return <div className="flex items-center gap-0.5">{stars}</div>;
};

interface StarSelectorProps {
    value: number;
    onChange: (rating: number) => void;
}

export const StarSelector: React.FC<StarSelectorProps> = ({ value, onChange }) => {
    const [hoverValue, setHoverValue] = React.useState<number>(0);
    const displayValue = hoverValue || value;

    const handleClick = (starIndex: number, isHalf: boolean) => {
        const newValue = isHalf ? starIndex - 0.5 : starIndex;
        onChange(newValue);
    };

    const handleMouseMove = (starIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const isHalf = x < rect.width / 2;
        setHoverValue(isHalf ? starIndex - 0.5 : starIndex);
    };

    return (
        <div className="flex items-center gap-0.5" onMouseLeave={() => setHoverValue(0)}>
            {[1, 2, 3, 4, 5].map((starIndex) => {
                const isFull = displayValue >= starIndex;
                const isHalf = !isFull && displayValue >= starIndex - 0.5;

                return (
                    <button
                        key={starIndex}
                        type="button"
                        className="p-0.5 cursor-pointer transition-transform hover:scale-110"
                        onMouseMove={(e) => handleMouseMove(starIndex, e)}
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            handleClick(starIndex, x < rect.width / 2);
                        }}
                    >
                        <span
                            className={`material-symbols-outlined text-2xl ${isFull || isHalf ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            {isHalf ? 'star_half' : 'star'}
                        </span>
                    </button>
                );
            })}
            {displayValue > 0 && (
                <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">{displayValue.toFixed(1)}</span>
            )}
        </div>
    );
};
