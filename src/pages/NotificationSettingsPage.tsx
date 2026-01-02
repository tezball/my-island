import { useState } from 'react'
import AppShell from '../components/layout/AppShell'
import Toggle from '../components/ui/Toggle'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'

interface NotificationSetting {
  id: string
  label: string
  description: string
  enabled: boolean
  locked?: boolean
}

export default function NotificationSettingsPage() {
  const { user } = useAuth()
  const [pauseAll, setPauseAll] = useState(false)

  const [essentials, setEssentials] = useState<NotificationSetting[]>([
    {
      id: 'booking',
      label: 'Booking Confirmations',
      description: 'Instant alerts for your campsite reservations',
      enabled: true,
    },
    {
      id: 'security',
      label: 'System & Security',
      description: 'Required for account safety',
      enabled: true,
      locked: true,
    },
  ])

  const [community, setCommunity] = useState<NotificationSetting[]>([
    {
      id: 'new-sites',
      label: 'New Campsite Alerts',
      description: 'Discover new campsites in your favorite areas',
      enabled: true,
    },
    {
      id: 'reviews',
      label: 'Review Replies',
      description: 'When hosts respond to your feedback',
      enabled: true,
    },
    {
      id: 'offers',
      label: 'Supplier Offers',
      description: 'Discounts and seasonal promotions',
      enabled: false,
    },
  ])

  const [channels, setChannels] = useState({
    push: user?.notificationPreferences?.push ?? true,
    email: user?.notificationPreferences?.email ?? true,
    sms: user?.notificationPreferences?.sms ?? false,
  })

  const toggleEssential = (id: string) => {
    setEssentials(prev =>
      prev.map(s => s.id === id && !s.locked ? { ...s, enabled: !s.enabled } : s)
    )
  }

  const toggleCommunity = (id: string) => {
    setCommunity(prev =>
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    )
  }

  const toggleChannel = (channel: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [channel]: !prev[channel] }))
  }

  return (
    <AppShell showBack headerTitle="Notifications" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Pause All */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Pause All
              </p>
              <p className="text-sm text-slate-500">
                Temporarily mute all non-essential alerts
              </p>
            </div>
            <Toggle checked={pauseAll} onChange={setPauseAll} />
          </div>
        </div>

        {/* Essentials */}
        <div className={`p-4 ${pauseAll ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Essentials
          </h3>
          <div className="space-y-4">
            {essentials.map(setting => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {setting.label}
                    </p>
                    {setting.locked && (
                      <Icon name="lock" size={14} className="text-slate-400" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{setting.description}</p>
                </div>
                <Toggle
                  checked={setting.enabled}
                  onChange={() => toggleEssential(setting.id)}
                  disabled={setting.locked}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Community & Offers */}
        <div className={`p-4 border-t border-slate-100 dark:border-slate-800 ${pauseAll ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Community & Offers
          </h3>
          <div className="space-y-4">
            {community.map(setting => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {setting.label}
                  </p>
                  <p className="text-sm text-slate-500">{setting.description}</p>
                </div>
                <Toggle
                  checked={setting.enabled}
                  onChange={() => toggleCommunity(setting.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Channels */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Delivery Channels
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => toggleChannel('push')}
              className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Icon name="notifications" size={20} className="text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">
                  Push Notifications
                </span>
              </div>
              <Icon
                name={channels.push ? 'check_circle' : 'radio_button_unchecked'}
                size={24}
                className={channels.push ? 'text-primary' : 'text-slate-300'}
                filled={channels.push}
              />
            </button>
            <button
              onClick={() => toggleChannel('email')}
              className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Icon name="mail" size={20} className="text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">
                  Email Digests
                </span>
              </div>
              <Icon
                name={channels.email ? 'check_circle' : 'radio_button_unchecked'}
                size={24}
                className={channels.email ? 'text-primary' : 'text-slate-300'}
                filled={channels.email}
              />
            </button>
            <button
              onClick={() => toggleChannel('sms')}
              className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Icon name="sms" size={20} className="text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">
                  SMS Alerts
                </span>
              </div>
              <Icon
                name={channels.sms ? 'check_circle' : 'radio_button_unchecked'}
                size={24}
                className={channels.sms ? 'text-primary' : 'text-slate-300'}
                filled={channels.sms}
              />
            </button>
          </div>
        </div>

        {/* System permissions link */}
        <div className="p-4">
          <button className="flex items-center gap-2 text-primary text-sm font-medium">
            <span>Manage system-level permissions in Settings</span>
            <Icon name="open_in_new" size={16} />
          </button>
        </div>
      </div>
    </AppShell>
  )
}
