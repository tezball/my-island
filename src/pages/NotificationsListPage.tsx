import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui'
import { TopAppBar, AppShell } from '@/components/layout'
import { cn } from '@/utils/cn'

// Mock M33: Notifications List Page
interface Notification {
  id: string
  type: 'booking' | 'review' | 'offer' | 'system' | 'alert'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  image?: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Booking Confirmed!',
    message: 'Your reservation at Emerald Bay Camp for Dec 20-22 has been confirmed.',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/booking/1',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=100',
  },
  {
    id: '2',
    type: 'alert',
    title: 'Spot Available!',
    message: 'A spot opened up at Sunset Ridge Camping - your saved location!',
    timestamp: '5 hours ago',
    read: false,
    actionUrl: '/campsite/2',
  },
  {
    id: '3',
    type: 'review',
    title: 'Leave a Review',
    message: 'How was your stay at Mountain Vista? Share your experience!',
    timestamp: 'Yesterday',
    read: true,
    actionUrl: '/booking/3/review',
  },
  {
    id: '4',
    type: 'offer',
    title: '20% Off Gear Rental',
    message: 'Outdoor Adventures is offering a discount on camping equipment.',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/offers',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=100',
  },
  {
    id: '5',
    type: 'system',
    title: 'New Feature: Photo Gallery',
    message: 'You can now view full photo galleries for all campsites!',
    timestamp: '3 days ago',
    read: true,
  },
  {
    id: '6',
    type: 'booking',
    title: 'Check-in Tomorrow',
    message: 'Your stay at Pine Forest Retreat starts tomorrow. View check-in instructions.',
    timestamp: '1 week ago',
    read: true,
    actionUrl: '/booking/4/checkin',
  },
]

const NOTIFICATION_ICONS: Record<Notification['type'], { icon: string; color: string }> = {
  booking: { icon: 'calendar_today', color: 'bg-primary/10 text-primary' },
  review: { icon: 'star', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600' },
  offer: { icon: 'local_offer', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' },
  system: { icon: 'info', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' },
  alert: { icon: 'notifications_active', color: 'bg-red-100 dark:bg-red-900/20 text-red-500' },
}

type FilterType = 'all' | 'unread'

export function NotificationsListPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterType>('all')
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => !n.read)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    } else {
      navigate(`/notification/${notification.id}`)
    }
  }

  return (
    <AppShell>
      <TopAppBar
        showHome
        title="Notifications"
        rightAction={
          unreadCount > 0 ? (
            <button
              onClick={markAllAsRead}
              className="text-primary text-sm font-medium"
            >
              Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="pb-28">
        {/* Filter Tabs */}
        <div className="px-4 py-3 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-surface-dark text-gray-600 dark:text-gray-400'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
              filter === 'unread'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-surface-dark text-gray-600 dark:text-gray-400'
            )}
          >
            Unread
            {unreadCount > 0 && (
              <span
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full',
                  filter === 'unread'
                    ? 'bg-white/20'
                    : 'bg-red-500 text-white'
                )}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications List */}
        <div className="px-4 space-y-2">
          {filteredNotifications.map((notification) => {
            const { icon, color } = NOTIFICATION_ICONS[notification.type]
            return (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  'w-full bg-white dark:bg-surface-dark rounded-2xl p-4 flex gap-3 text-left transition-all active:scale-[0.98]',
                  !notification.read && 'ring-2 ring-primary/20'
                )}
              >
                {notification.image ? (
                  <div
                    className="w-12 h-12 rounded-xl bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url("${notification.image}")` }}
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}
                  >
                    <Icon name={icon} className="text-xl" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        'font-semibold text-sm truncate',
                        !notification.read && 'text-primary'
                      )}
                    >
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.timestamp}
                  </p>
                </div>
              </button>
            )
          })}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-surface-dark flex items-center justify-center mx-auto mb-4">
                <Icon
                  name="notifications_off"
                  className="text-4xl text-gray-400"
                />
              </div>
              <h3 className="font-bold text-lg mb-1">All caught up!</h3>
              <p className="text-gray-500 text-sm">
                {filter === 'unread'
                  ? "You've read all your notifications"
                  : 'No notifications yet'}
              </p>
            </div>
          )}
        </div>

        {/* Settings Link */}
        <div className="px-4 mt-6">
          <button
            onClick={() => navigate('/settings/notifications')}
            className="w-full flex items-center justify-center gap-2 py-3 text-gray-500 hover:text-primary transition-colors"
          >
            <Icon name="settings" className="text-lg" />
            <span className="text-sm font-medium">Notification Settings</span>
          </button>
        </div>
      </div>
    </AppShell>
  )
}
