import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import Icon from '../components/ui/Icon'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const DEFAULT_DURATION = 5000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()
    const duration = toast.duration ?? DEFAULT_DURATION

    setToasts(prev => [...prev, { ...toast, id }])

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }, [removeToast])

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }, [addToast])

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 8000 })
  }, [addToast])

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message })
  }, [addToast])

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Container Component
function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  )
}

// Individual Toast Component
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const config = {
    success: {
      icon: 'check_circle',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      iconColor: 'text-emerald-500',
      titleColor: 'text-emerald-800 dark:text-emerald-200',
      messageColor: 'text-emerald-600 dark:text-emerald-300',
    },
    error: {
      icon: 'error',
      bgColor: 'bg-red-50 dark:bg-red-900/30',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-500',
      titleColor: 'text-red-800 dark:text-red-200',
      messageColor: 'text-red-600 dark:text-red-300',
    },
    warning: {
      icon: 'warning',
      bgColor: 'bg-amber-50 dark:bg-amber-900/30',
      borderColor: 'border-amber-200 dark:border-amber-800',
      iconColor: 'text-amber-500',
      titleColor: 'text-amber-800 dark:text-amber-200',
      messageColor: 'text-amber-600 dark:text-amber-300',
    },
    info: {
      icon: 'info',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-800 dark:text-blue-200',
      messageColor: 'text-blue-600 dark:text-blue-300',
    },
  }

  const { icon, bgColor, borderColor, iconColor, titleColor, messageColor } = config[toast.type]

  return (
    <div
      className={`
        pointer-events-auto
        flex items-start gap-3 p-4 rounded-xl border shadow-lg
        animate-slide-in-right
        ${bgColor} ${borderColor}
      `}
      role="alert"
    >
      <Icon name={icon} size={20} className={`${iconColor} shrink-0 mt-0.5`} filled />
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${titleColor}`}>{toast.title}</p>
        {toast.message && (
          <p className={`text-sm mt-0.5 ${messageColor}`}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className={`shrink-0 ${iconColor} hover:opacity-70 transition-opacity`}
      >
        <Icon name="close" size={18} />
      </button>
    </div>
  )
}

export default ToastContext
