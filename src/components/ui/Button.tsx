import { ButtonHTMLAttributes, ReactNode } from 'react'
import Icon from './Icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: string
  rightIcon?: string
  isLoading?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary hover:bg-emerald-400 text-slate-900 shadow-lg shadow-primary/25',
    secondary: 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-slate-900',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  }

  const sizes = {
    sm: 'h-10 px-4 text-sm rounded-lg',
    md: 'h-12 px-6 text-base rounded-xl',
    lg: 'h-14 px-8 text-lg rounded-full',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin">
          <Icon name="progress_activity" size={20} />
        </span>
      ) : (
        <>
          {leftIcon && <Icon name={leftIcon} size={20} />}
          {children}
          {rightIcon && <Icon name={rightIcon} size={20} />}
        </>
      )}
    </button>
  )
}
