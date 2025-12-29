import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Icon } from '../ui'
import { useAuth } from '@/context/AuthContext'

interface NavItem {
  path: string
  label: string
  icon: string
  badge?: number
}

const visitorNavItems: NavItem[] = [
  { path: '/', label: 'Explore', icon: 'search' },
  { path: '/favorites', label: 'Saved', icon: 'favorite' },
  { path: '/bookings', label: 'Bookings', icon: 'calendar_today' },
  { path: '/profile', label: 'Profile', icon: 'person' },
]

const ownerNavItems: NavItem[] = [
  { path: '/owner', label: 'Dashboard', icon: 'dashboard' },
  { path: '/owner/bookings', label: 'Bookings', icon: 'calendar_today' },
  { path: '/owner/offers', label: 'Offers', icon: 'local_offer' },
  { path: '/profile', label: 'Profile', icon: 'person' },
]

export function BottomNav() {
  const location = useLocation()
  const { user } = useAuth()

  const navItems = user?.role === 'owner' ? ownerNavItems : visitorNavItems

  // Don't show on login or during booking flow
  const hideOn = ['/login', '/book']
  const shouldHide = hideOn.some(path => location.pathname.startsWith(path))
  if (shouldHide) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Frosted Glass Background */}
      <div className="absolute inset-0 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-lg border-t border-white/20 dark:border-white/5" />

      <nav className="relative flex justify-around items-end pb-8 pt-4 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 min-w-[64px] group"
            >
              <div className="relative p-1">
                <Icon
                  name={item.icon}
                  filled={isActive}
                  className={cn(
                    'text-[28px] transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-text-secondary dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-white'
                  )}
                />
                {isActive && (
                  <div className="absolute -top-1 right-0 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-surface-dark" />
                )}
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">
                      {item.badge}
                    </span>
                  </div>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium tracking-wide transition-colors',
                  isActive
                    ? 'font-bold text-primary'
                    : 'text-text-secondary dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-white'
                )}
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
