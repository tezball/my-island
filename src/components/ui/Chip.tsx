import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface ChipProps {
  label: string
  icon?: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export function Chip({ label, icon, active = false, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm border whitespace-nowrap flex-shrink-0',
        'active:scale-95 transition-all',
        active
          ? 'bg-primary text-background-dark border-primary'
          : 'bg-surface-light dark:bg-surface-dark border-gray-100 dark:border-gray-800',
        className
      )}
    >
      {icon && (
        <Icon
          name={icon}
          size="sm"
          className={active ? 'text-background-dark' : 'text-primary'}
        />
      )}
      <span
        className={cn(
          'text-xs font-semibold',
          active ? 'text-background-dark' : 'text-text-main dark:text-gray-200'
        )}
      >
        {label}
      </span>
    </button>
  )
}
