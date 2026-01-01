import { useState } from 'react'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import Toggle from '../../components/ui/Toggle'
import Icon from '../../components/ui/Icon'

const calendarProviders = [
  { id: 'google', name: 'Google Calendar', icon: 'event', connected: true },
  { id: 'apple', name: 'Apple Calendar', icon: 'calendar_month', connected: false },
  { id: 'outlook', name: 'Outlook', icon: 'mail', connected: false },
  { id: 'airbnb', name: 'Airbnb', icon: 'home', connected: true },
]

export default function OwnerCalendarSettingsPage() {
  const [autoSync, setAutoSync] = useState(true)
  const [blockConflicts, setBlockConflicts] = useState(true)
  const [syncFrequency, setSyncFrequency] = useState('15min')

  return (
    <AppShell showBack headerTitle="Calendar Sync" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Connected Calendars */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Connected Calendars
          </h3>
          <div className="space-y-3">
            {calendarProviders.map(provider => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center">
                    <Icon name={provider.icon} size={20} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {provider.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {provider.connected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                {provider.connected ? (
                  <button className="text-red-500 text-sm font-medium">
                    Disconnect
                  </button>
                ) : (
                  <button className="text-primary text-sm font-medium">
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sync Settings */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Sync Settings
          </h3>
          <div className="space-y-4">
            <Toggle
              checked={autoSync}
              onChange={setAutoSync}
              label="Automatic Sync"
              description="Keep calendars in sync automatically"
            />

            <Toggle
              checked={blockConflicts}
              onChange={setBlockConflicts}
              label="Block Conflicting Dates"
              description="Automatically block dates booked elsewhere"
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Sync Frequency
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['5min', '15min', '1hour'].map(freq => (
                  <button
                    key={freq}
                    onClick={() => setSyncFrequency(freq)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                      syncFrequency === freq
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {freq === '5min' ? '5 min' : freq === '15min' ? '15 min' : '1 hour'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* iCal Export */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Export Calendar
          </h3>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Use this iCal link to import your booking calendar into other apps.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value="https://my-island.ie/ical/owner/abc123"
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400"
              />
              <Button variant="secondary" size="sm" leftIcon="content_copy">
                Copy
              </Button>
            </div>
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button className="w-full" leftIcon="sync">
          Sync Now
        </Button>
      </div>
    </AppShell>
  )
}
