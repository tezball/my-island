import { ReactNode } from 'react'
import Icon from './Icon'
import Button from './Button'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  children?: ReactNode
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Icon name={icon} size={40} className="text-slate-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-6">
        {description}
      </p>
      {action && (
        <Button variant="primary" onClick={action.onClick} rightIcon="arrow_forward">
          {action.label}
        </Button>
      )}
      {children}
    </div>
  )
}
