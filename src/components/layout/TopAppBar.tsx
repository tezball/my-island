import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Icon } from '../ui'

interface TopAppBarProps {
  title?: string
  showBack?: boolean
  showHome?: boolean
  rightAction?: React.ReactNode
  transparent?: boolean
  className?: string
}

export function TopAppBar({
  title,
  showBack = true,
  showHome = false,
  rightAction,
  transparent = false,
  className,
}: TopAppBarProps) {
  const navigate = useNavigate()

  return (
    <header
      className={cn(
        'sticky top-0 z-10 px-4 py-3 flex items-center justify-between',
        transparent
          ? 'bg-transparent'
          : 'bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md',
        className
      )}
    >
      <div className="flex items-center gap-1">
        {showHome && (
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
          >
            <Icon name="home" />
          </button>
        )}
        {showBack && !showHome && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
          >
            <Icon name="arrow_back" />
          </button>
        )}
        {!showBack && !showHome && <div className="w-10" />}
      </div>

      {title && (
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
      )}

      {rightAction || <div className="w-10" />}
    </header>
  )
}
