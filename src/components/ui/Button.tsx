import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: string
  rightIcon?: string
  glow?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      disabled,
      children,
      glow,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary:
        'bg-primary hover:bg-primary-dark text-background-dark rounded-full shadow-lg shadow-primary/25',
      secondary:
        'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl',
      ghost:
        'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-full',
      danger:
        'bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg shadow-red-500/25',
      outline:
        'bg-transparent border-2 border-primary text-primary hover:bg-primary/10 rounded-full',
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-12 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], glow && 'shadow-glow', className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Icon name="progress_activity" className="animate-spin" />
        ) : (
          <>
            {leftIcon && <Icon name={leftIcon} size="md" />}
            {children}
            {rightIcon && <Icon name={rightIcon} size="md" />}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
