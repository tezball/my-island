import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  leftIcon?: string
  rightIcon?: string
  error?: string
  onRightIconClick?: () => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, leftIcon, rightIcon, error, onRightIconClick, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon
                name={leftIcon}
                className="text-slate-400 group-focus-within:text-primary transition-colors"
              />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'block w-full h-14 rounded-xl border-slate-200 dark:border-slate-700',
              'bg-white dark:bg-surface-dark text-slate-900 dark:text-white',
              'placeholder:text-slate-400 text-base shadow-sm',
              'focus:border-primary focus:ring-1 focus:ring-primary transition-all',
              leftIcon && 'pl-11',
              rightIcon && 'pr-12',
              !leftIcon && 'pl-4',
              !rightIcon && 'pr-4',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <Icon name={rightIcon} />
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
