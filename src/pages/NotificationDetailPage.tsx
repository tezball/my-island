import { useParams, Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { notifications } from '../data/mockData'

export default function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>()

  const notification = notifications.find(n => n.id === id)

  if (!notification) {
    return (
      <AppShell showBack headerTitle="Notification">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Notification not found</p>
        </div>
      </AppShell>
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return { icon: 'calendar_today', color: 'text-primary', bg: 'bg-primary/10' }
      case 'reminder':
        return { icon: 'schedule', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' }
      case 'offer':
        return { icon: 'local_offer', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' }
      case 'review':
        return { icon: 'star', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' }
      case 'system':
        return { icon: 'info', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' }
      default:
        return { icon: 'notifications', color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800' }
    }
  }

  const iconStyle = getNotificationIcon(notification.type)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getActionButton = () => {
    switch (notification.type) {
      case 'booking':
        return (
          <Link to={notification.actionUrl || '/bookings'}>
            <Button className="w-full" leftIcon="calendar_today">
              View Booking
            </Button>
          </Link>
        )
      case 'offer':
        return (
          <Link to={notification.actionUrl || '/offers'}>
            <Button className="w-full" leftIcon="local_offer">
              View Offer
            </Button>
          </Link>
        )
      case 'reminder':
        return (
          <Link to={notification.actionUrl || '/bookings'}>
            <Button className="w-full" leftIcon="event">
              View Details
            </Button>
          </Link>
        )
      default:
        return null
    }
  }

  return (
    <AppShell
      showBack
      headerTitle="Notification"
      showNav={false}
      headerRightAction={
        <button>
          <Icon name="delete" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`size-16 rounded-full ${iconStyle.bg} flex items-center justify-center`}>
              <Icon name={iconStyle.icon} size={32} className={iconStyle.color} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">
            {notification.title}
          </h1>

          {/* Timestamp */}
          <p className="text-sm text-slate-500 text-center mb-6">
            {formatDate(notification.createdAt)}
          </p>

          {/* Message */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {notification.message}
            </p>
          </div>

          {/* Additional Details (mock) */}
          {notification.type === 'booking' && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800">
                <Icon name="location_on" size={20} className="text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Whispering Pines Campground
                  </p>
                  <p className="text-xs text-slate-500">Kerry, Ireland</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800">
                <Icon name="event" size={20} className="text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Jul 15 - Jul 18, 2025
                  </p>
                  <p className="text-xs text-slate-500">3 nights • 2 guests</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {getActionButton()}

          {/* Secondary Actions */}
          <div className="mt-4 flex justify-center gap-4">
            <button className="text-sm text-slate-500 hover:text-slate-700">
              Mark as unread
            </button>
            <span className="text-slate-300">•</span>
            <button className="text-sm text-slate-500 hover:text-red-500">
              Delete
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
