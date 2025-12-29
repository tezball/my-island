import { cn } from '@/utils/cn'
import { Icon } from './Icon'
import { Button } from './Button'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  icon?: string
  children?: React.ReactNode
  isLoading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon,
  children,
  isLoading,
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const iconConfig = {
    danger: { name: icon || 'warning', color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
    warning: { name: icon || 'warning', color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
    info: { name: icon || 'info', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  }

  const config = iconConfig[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full max-w-sm bg-white dark:bg-surface-dark rounded-2xl',
          'shadow-float animate-in fade-in zoom-in-95 duration-200'
        )}
      >
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={cn('w-16 h-16 rounded-full flex items-center justify-center', config.color)}>
              <Icon name={config.name} className="text-[32px]" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-center text-slate-600 dark:text-slate-300 mb-4">
            {message}
          </p>

          {/* Custom content */}
          {children}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={variant === 'danger' ? 'danger' : 'primary'}
              className="flex-1"
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
