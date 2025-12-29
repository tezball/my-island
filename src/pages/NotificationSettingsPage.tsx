import { useState } from 'react'
import { Icon, Toggle } from '@/components/ui'
import { TopAppBar } from '@/components/layout'

// Mock: Notification Settings Page
interface NotificationSetting {
  id: string
  category: string
  title: string
  description: string
  enabled: boolean
  icon: string
  color: string
}

const INITIAL_SETTINGS: NotificationSetting[] = [
  {
    id: 'booking_confirmations',
    category: 'Bookings',
    title: 'Booking Confirmations',
    description: 'When your reservation is confirmed',
    enabled: true,
    icon: 'check_circle',
    color: 'text-primary bg-primary/10',
  },
  {
    id: 'booking_reminders',
    category: 'Bookings',
    title: 'Check-in Reminders',
    description: 'Reminders before your stay',
    enabled: true,
    icon: 'alarm',
    color: 'text-primary bg-primary/10',
  },
  {
    id: 'booking_changes',
    category: 'Bookings',
    title: 'Reservation Changes',
    description: 'When your booking is modified',
    enabled: true,
    icon: 'edit_calendar',
    color: 'text-primary bg-primary/10',
  },
  {
    id: 'spot_alerts',
    category: 'Alerts',
    title: 'Spot Availability',
    description: 'When a saved campsite has openings',
    enabled: true,
    icon: 'notifications_active',
    color: 'text-red-500 bg-red-100 dark:bg-red-900/20',
  },
  {
    id: 'price_drops',
    category: 'Alerts',
    title: 'Price Drops',
    description: 'When prices decrease for saved sites',
    enabled: false,
    icon: 'trending_down',
    color: 'text-red-500 bg-red-100 dark:bg-red-900/20',
  },
  {
    id: 'review_requests',
    category: 'Reviews',
    title: 'Review Requests',
    description: 'Reminders to leave reviews after stays',
    enabled: true,
    icon: 'star',
    color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
  },
  {
    id: 'review_responses',
    category: 'Reviews',
    title: 'Host Responses',
    description: 'When a host responds to your review',
    enabled: true,
    icon: 'reply',
    color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
  },
  {
    id: 'offers',
    category: 'Promotions',
    title: 'Special Offers',
    description: 'Deals and discounts from suppliers',
    enabled: false,
    icon: 'local_offer',
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
  },
  {
    id: 'newsletter',
    category: 'Promotions',
    title: 'Newsletter',
    description: 'Camping tips and destination guides',
    enabled: false,
    icon: 'mail',
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
  },
  {
    id: 'app_updates',
    category: 'System',
    title: 'App Updates',
    description: 'New features and improvements',
    enabled: true,
    icon: 'system_update',
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
  },
  {
    id: 'security',
    category: 'System',
    title: 'Security Alerts',
    description: 'Login attempts and account changes',
    enabled: true,
    icon: 'security',
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
  },
]

export function NotificationSettingsPage() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    )
  }

  // Group settings by category
  const categories = settings.reduce(
    (acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      acc[setting.category].push(setting)
      return acc
    },
    {} as Record<string, NotificationSetting[]>
  )

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar title="Notification Settings" />

      <div className="flex-1 px-4 pb-8">
        {/* Master Toggles */}
        <section className="mt-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Icon name="notifications" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Push Notifications</p>
                <p className="text-xs text-gray-500">
                  Receive alerts on your device
                </p>
              </div>
              <Toggle checked={pushEnabled} onChange={setPushEnabled} />
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                <Icon name="email" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Email Notifications</p>
                <p className="text-xs text-gray-500">
                  Receive updates via email
                </p>
              </div>
              <Toggle checked={emailEnabled} onChange={setEmailEnabled} />
            </div>
          </div>
        </section>

        {/* Category Sections */}
        {Object.entries(categories).map(([category, categorySettings]) => (
          <section key={category} className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
              {category}
            </h3>
            <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
              {categorySettings.map((setting, idx) => (
                <div
                  key={setting.id}
                  className={`flex items-center gap-4 p-4 ${
                    idx !== categorySettings.length - 1
                      ? 'border-b border-gray-100 dark:border-gray-800'
                      : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${setting.color}`}
                  >
                    <Icon name={setting.icon} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{setting.title}</p>
                    <p className="text-xs text-gray-500">
                      {setting.description}
                    </p>
                  </div>
                  <Toggle
                    checked={setting.enabled && pushEnabled}
                    onChange={() => toggleSetting(setting.id)}
                    disabled={!pushEnabled}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Info */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 flex gap-3">
          <Icon name="info" className="text-blue-600 text-xl shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            You can manage email preferences for each notification type by
            visiting your account settings on the web.
          </p>
        </div>
      </div>
    </div>
  )
}
