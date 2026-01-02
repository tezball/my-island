import { Link, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showLogo?: boolean
  showNotifications?: boolean
  rightAction?: React.ReactNode
  transparent?: boolean
  unreadCount?: number
}

export default function Header({
  title,
  showBack = false,
  showLogo = false,
  showNotifications = true,
  rightAction,
  transparent = false,
  unreadCount = 0,
}: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header
      className={`sticky top-0 z-40 ${
        transparent
          ? 'bg-transparent'
          : 'bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800'
      }`}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="size-10 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-sm flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Icon name="arrow_back" size={20} />
          </button>
        )}

        {showLogo && (
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-full bg-primary flex items-center justify-center">
              <Icon name="forest" size={20} className="text-slate-900" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">my-island</span>
          </Link>
        )}

        {title && (
          <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {rightAction}

        {showNotifications && (
          <Link
            to="/notifications"
            className="relative size-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Icon name="notifications" size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 size-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        )}
      </div>
      </div>
    </header>
  )
}
