import { Link, useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'

interface NavItem {
  path: string
  icon: string
  label: string
  badge?: number
}

const navItems: NavItem[] = [
  { path: '/', icon: 'explore', label: 'Discover' },
  { path: '/search', icon: 'search', label: 'Search' },
  { path: '/favorites', icon: 'favorite', label: 'Saved' },
  { path: '/bookings', icon: 'calendar_month', label: 'Bookings' },
  { path: '/profile', icon: 'person', label: 'Profile' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="sticky bottom-0 z-50 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path))

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors relative ${
                isActive
                  ? 'text-primary'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <span className="relative">
                <Icon name={item.icon} size={24} filled={isActive} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
