import { useParams, useNavigate } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'
import { TopAppBar } from '@/components/layout'

// Mock M34: Notification Detail Page
export function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Mock notification data
  const notification = {
    id,
    type: 'booking' as const,
    title: 'Booking Confirmed!',
    message:
      'Your reservation at Emerald Bay Camp for December 20-22, 2024 has been confirmed. You can view your booking details and check-in instructions anytime from your bookings page.',
    fullMessage: `Great news! Your camping adventure is all set.

Booking Details:
• Campsite: Emerald Bay Camp
• Check-in: December 20, 2024 at 2:00 PM
• Check-out: December 22, 2024 at 11:00 AM
• Guests: 2 adults
• Lot: Riverside Tent Site #7

What's Next:
1. Review your check-in instructions
2. Download the campsite map
3. Check the weather forecast
4. Pack your gear!

If you have any questions, feel free to contact your host or our support team.

Happy camping! 🏕️`,
    timestamp: 'December 15, 2024 at 10:30 AM',
    actionLabel: 'View Booking',
    actionUrl: '/booking/1',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        title="Notification"
        rightAction={
          <button className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center">
            <Icon name="delete" className="text-gray-500" />
          </button>
        }
      />

      <div className="flex-1 pb-8">
        {/* Hero Image */}
        {notification.image && (
          <div className="aspect-video w-full relative">
            <img
              src={notification.image}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="px-4 -mt-12 relative z-10">
          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg mb-4">
            <Icon name="check_circle" className="text-white text-3xl" />
          </div>

          {/* Title & Time */}
          <h1 className="text-2xl font-bold mb-2">{notification.title}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <Icon name="schedule" className="text-base" />
            {notification.timestamp}
          </p>
        </div>

        {/* Message */}
        <div className="px-4 mt-6">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {notification.fullMessage}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Quick Actions
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => navigate('/booking/1')}
              className="w-full flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Icon name="calendar_today" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">View Booking Details</p>
                <p className="text-xs text-gray-500">See your full reservation</p>
              </div>
              <Icon name="chevron_right" className="text-gray-400" />
            </button>
            <button
              onClick={() => navigate('/booking/1/checkin')}
              className="w-full flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                <Icon name="login" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Check-in Instructions</p>
                <p className="text-xs text-gray-500">Access codes & directions</p>
              </div>
              <Icon name="chevron_right" className="text-gray-400" />
            </button>
            <button
              onClick={() => navigate('/booking/1/contact')}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                <Icon name="chat" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Contact Host</p>
                <p className="text-xs text-gray-500">Ask a question</p>
              </div>
              <Icon name="chevron_right" className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Primary Action */}
        <div className="px-4 mt-6">
          <Button
            className="w-full h-14"
            size="lg"
            onClick={() => navigate(notification.actionUrl)}
            rightIcon="arrow_forward"
          >
            {notification.actionLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
