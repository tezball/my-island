import { InputHTMLAttributes, useState } from 'react'
import Icon from './Icon'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  leftIcon?: string
  error?: string
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Input({
  label,
  leftIcon,
  error,
  helperText,
  type = 'text',
  size = 'md',
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const sizes = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-base',
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon
              name={leftIcon}
              className="text-slate-400 group-focus-within:text-primary transition-colors"
              size={20}
            />
          </div>
        )}
        <input
          type={inputType}
          className={`
            block w-full rounded-xl border border-slate-200 dark:border-slate-700
            bg-white dark:bg-surface-dark text-slate-900 dark:text-white
            placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary
            transition-all shadow-sm
            ${leftIcon ? 'pl-11' : 'px-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
            ${sizes[size]}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <Icon name={showPassword ? 'visibility' : 'visibility_off'} size={24} />
          </button>
        )}
      </div>
      {error && (
        <span className="text-sm text-red-500 ml-1">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-sm text-slate-500 ml-1">{helperText}</span>
      )}
    </div>
  )
}
