import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'flat'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'elevated', children, ...props }, ref) => {
    const variants = {
      elevated: 'bg-white dark:bg-surface-dark rounded-2xl shadow-card border border-gray-100 dark:border-white/5',
      outlined: 'bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700',
      flat: 'bg-slate-50 dark:bg-surface-dark rounded-2xl',
    }

    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
