import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Icon from '../components/ui/Icon'
import { notifications } from '../data/mockData'

type NotificationCategory = 'all' | 'bookings' | 'offers' | 'system'

export default function NotificationCenterPage() {
  const [category, setCategory] = useState<NotificationCategory>('all')

  const categories: { value: NotificationCategory; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: 'notifications' },
    { value: 'bookings', label: 'Bookings', icon: 'calendar_today' },
    { value: 'offers', label: 'Offers', icon: 'local_offer' },
    { value: 'system', label: 'System', icon: 'settings' },
  ]

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let groupKey: string
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday'
    } else {
      groupKey = date.toLocaleDateString('en-IE', { month: 'long', day: 'numeric' })
    }

    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(notification)
    return groups
  }, {} as Record<string, typeof notifications>)

  const filteredGroups = Object.entries(groupedNotifications).reduce((acc, [date, items]) => {
    const filtered = items.filter(n => {
      if (category === 'all') return true
      if (category === 'bookings') return n.type === 'booking' || n.type === 'reminder'
      if (category === 'offers') return n.type === 'offer'
      if (category === 'system') return n.type === 'system'
      return true
    })
    if (filtered.length > 0) {
      acc[date] = filtered
    }
    return acc
  }, {} as Record<string, typeof notifications>)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return { icon: 'calendar_today', color: 'text-primary', bg: 'bg-primary/10' }
      case 'reminder':
        return { icon: 'schedule', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' }
      case 'offer':
        return { icon: 'local_offer', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' }
      case 'promo':
        return { icon: 'percent', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' }
      case 'system':
        return { icon: 'info', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' }
      default:
        return { icon: 'notifications', color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800' }
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-IE', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <AppShell
      showBack
      headerTitle="Notifications"
      showNav={false}
      headerRightAction={
        <Link to="/profile/notifications">
          <Icon name="settings" size={24} className="text-slate-600 dark:text-slate-400" />
        </Link>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Category Tabs */}
        <div className="p-4 pb-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  category === cat.value
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon name={cat.icon} size={16} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Groups */}
        <div className="pb-6">
          {Object.entries(filteredGroups).map(([date, items]) => (
            <div key={date}>
              <div className="px-4 py-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {date}
                </p>
              </div>
              <div className="space-y-1">
                {items.map(notification => {
                  const iconStyle = getNotificationIcon(notification.type)
                  return (
                    <Link
                      key={notification.id}
                      to={`/notifications/${notification.id}`}
                      className={`block px-4 py-3 ${
                        !notification.read
                          ? 'bg-primary/5'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`size-10 rounded-full ${iconStyle.bg} flex items-center justify-center shrink-0`}>
                          <Icon name={iconStyle.icon} size={20} className={iconStyle.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-slate-900 dark:text-white`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}

          {Object.keys(filteredGroups).length === 0 && (
            <div className="text-center py-12">
              <Icon name="notifications_off" size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No notifications in this category</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
