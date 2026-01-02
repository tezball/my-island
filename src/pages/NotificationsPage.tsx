import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Icon from '../components/ui/Icon'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import { notificationsApi, type NotificationResponse } from '../lib/api/notifications'

type NotificationType = 'booking' | 'review' | 'offer' | 'system' | 'reminder' | 'message'

const iconColors: Record<NotificationType, string> = {
  booking: 'text-emerald-500',
  review: 'text-amber-500',
  offer: 'text-purple-500',
  system: 'text-blue-500',
  reminder: 'text-orange-500',
  message: 'text-blue-500',
}

const iconBgColors: Record<NotificationType, string> = {
  booking: 'bg-emerald-100 dark:bg-emerald-900/30',
  review: 'bg-amber-100 dark:bg-amber-900/30',
  offer: 'bg-purple-100 dark:bg-purple-900/30',
  system: 'bg-blue-100 dark:bg-blue-900/30',
  reminder: 'bg-orange-100 dark:bg-orange-900/30',
  message: 'bg-blue-100 dark:bg-blue-900/30',
}

const typeIcons: Record<NotificationType, string> = {
  booking: 'calendar_today',
  review: 'star',
  offer: 'local_offer',
  system: 'info',
  reminder: 'schedule',
  message: 'chat',
}

interface DisplayNotification {
  id: string
  type: NotificationType
  icon: string
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: string
}

function mapNotification(n: NotificationResponse): DisplayNotification {
  const type = n.type.toLowerCase() as NotificationType
  return {
    id: n.id,
    type,
    icon: typeIcons[type] || 'notifications',
    title: n.title,
    message: n.message,
    read: n.read,
    actionUrl: n.actionUrl,
    createdAt: n.createdAt,
  }
}

// Mock notifications for when API is unavailable
const mockNotifications: DisplayNotification[] = [
  {
    id: '1',
    type: 'booking',
    icon: 'calendar_today',
    title: 'Booking Confirmed',
    message: 'Your booking at Clifden Coastal Glamping Resort has been confirmed for next weekend.',
    read: false,
    actionUrl: '/bookings',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'offer',
    icon: 'local_offer',
    title: 'New Local Offer',
    message: "20% off at O'Malley's Seafood Restaurant - available this week only!",
    read: false,
    actionUrl: '/offers',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'reminder',
    icon: 'schedule',
    title: 'Check-in Tomorrow',
    message: 'Your stay at Ring of Kerry Wild Camp starts tomorrow. Check-in is from 2:00 PM.',
    read: true,
    actionUrl: '/bookings',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'review',
    icon: 'star',
    title: 'Leave a Review',
    message: 'How was your stay at Wicklow Mountains Holiday Park? Share your experience!',
    read: true,
    actionUrl: '/bookings',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<DisplayNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await notificationsApi.list()
        setNotifs(data.length > 0 ? data.map(mapNotification) : mockNotifications)
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
        // Use mock notifications when API fails
        setNotifs(mockNotifications)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })
  }

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id)
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead()
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const unreadCount = notifs.filter((n) => !n.read).length

  return (
    <AppShell showBack headerTitle="Notifications" showNotifications={false}>
      <div className="flex-1 flex flex-col">
        {/* Header Actions */}
        {notifs.length > 0 && unreadCount > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm text-slate-500">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </span>
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary font-medium"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-3 px-4 py-4">
                  <Skeleton variant="circular" width={48} height={48} />
                  <div className="flex-1">
                    <Skeleton variant="text" className="w-3/4 h-5 mb-2" />
                    <Skeleton variant="text" className="w-full h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifs.length === 0 ? (
            <EmptyState
              icon="notifications"
              title="No notifications"
              description="You're all caught up! Check back later for updates."
            />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifs.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.actionUrl || '#'}
                  onClick={() => markAsRead(notification.id)}
                  className={`flex gap-3 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className={`size-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgColors[notification.type]}`}>
                    <Icon
                      name={notification.icon}
                      size={24}
                      className={iconColors[notification.type]}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-medium text-slate-900 dark:text-white ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="size-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
