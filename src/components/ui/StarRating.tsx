import { useState } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  showLabel?: boolean
  className?: string
}

const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export function StarRating({
  value,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  showLabel = false,
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const sizes = {
    sm: 'text-[20px]',
    md: 'text-[28px]',
    lg: 'text-[36px]',
  }

  const displayValue = hoverValue ?? value

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1
          const isFilled = starValue <= displayValue

          return (
            <button
              key={i}
              type="button"
              disabled={readonly}
              onClick={() => onChange?.(starValue)}
              onMouseEnter={() => !readonly && setHoverValue(starValue)}
              onMouseLeave={() => !readonly && setHoverValue(null)}
              className={cn(
                'transition-transform',
                !readonly && 'hover:scale-110 active:scale-95 cursor-pointer',
                readonly && 'cursor-default'
              )}
            >
              <Icon
                name="star"
                filled={isFilled}
                className={cn(
                  sizes[size],
                  'transition-colors',
                  isFilled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                )}
              />
            </button>
          )
        })}
      </div>
      {showLabel && displayValue > 0 && (
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {labels[displayValue]}
        </span>
      )}
    </div>
  )
}
