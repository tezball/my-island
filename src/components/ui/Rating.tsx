import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface RatingProps {
  value: number
  reviewCount?: number
  size?: 'sm' | 'md'
  className?: string
}

export function Rating({ value, reviewCount, size = 'md', className }: RatingProps) {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
  }

  return (
    <div className={cn('flex items-center gap-1', sizes[size], className)}>
      <Icon
        name="star"
        filled
        size={size === 'sm' ? 'sm' : 'md'}
        className="text-yellow-400"
      />
      <span className="font-medium text-text-main dark:text-gray-200">{value.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-text-secondary dark:text-gray-400">({reviewCount})</span>
      )}
    </div>
  )
}
