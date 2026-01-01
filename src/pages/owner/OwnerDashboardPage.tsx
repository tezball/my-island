import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import Icon from '../../components/ui/Icon'
import Toggle from '../../components/ui/Toggle'
import { ownerStats, ownerCampsites, broadcastAlerts } from '../../data/mockData'

export default function OwnerDashboardPage() {
  const navigate = useNavigate()
  const [campsiteVisible, setCampsiteVisible] = useState(true)
  const [broadcastMessage, setBroadcastMessage] = useState('')

  const campsite = ownerCampsites[0]
  const activeGuests = 45 // Mock number

  const handleBroadcast = () => {
    if (broadcastMessage.trim()) {
      // In real app, would send broadcast via API
      alert(`Broadcast sent to ${activeGuests} guests!`)
      setBroadcastMessage('')
    }
  }

  return (
    <AppShell
      showBack
      headerTitle="Admin Dashboard"
      showNav={false}
      headerRightAction={
        <button onClick={() => navigate('/owner/settings')}>
          <Icon name="settings" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Stats Grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <StatCard
            icon="visibility"
            value="1,240"
            label="Views this week"
            trend={12}
            trendDirection="up"
          />
          <StatCard
            icon="notifications_active"
            value="8"
            label="Alerts sent"
            trend={2}
            trendDirection="up"
          />
        </div>

        {/* Campsite Status */}
        <div className="px-4 mb-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Campsite Status
                </h3>
                <p className="text-sm text-slate-500">
                  {campsiteVisible ? 'Visible to guests on map' : 'Hidden from map'}
                </p>
              </div>
              <Toggle checked={campsiteVisible} onChange={setCampsiteVisible} />
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
              <Icon name="info" size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <p>Update details to auto-notify upcoming guests about changes.</p>
            </div>
          </div>
        </div>

        {/* Broadcast Alert */}
        <div className="px-4 mb-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Send Supplier Alert
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              Notify guests about fresh supplies, happy hours, or local events.
            </p>
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value.slice(0, 140))}
              placeholder="Examples: 'Fresh fish market opens in 10 mins!' or 'Live music at the bonfire tonight.'"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none text-sm"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-400">
                {broadcastMessage.length}/140
              </span>
              <Button
                size="sm"
                disabled={!broadcastMessage.trim()}
                onClick={handleBroadcast}
                rightIcon="send"
              >
                Broadcast to Guests
              </Button>
            </div>
            {broadcastMessage.trim() && (
              <p className="text-xs text-slate-500 mt-2">
                This will send a push notification to {activeGuests} active guests.
              </p>
            )}
          </div>
        </div>

        {/* Recent Broadcasts */}
        {broadcastAlerts.length > 0 && (
          <div className="px-4 mb-4">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Recent Broadcasts
            </h3>
            <div className="space-y-2">
              {broadcastAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {alert.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Sent to {alert.sentTo} guests • {new Date(alert.sentAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="px-4 pb-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/owner/bookings"
              className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="calendar_month" size={24} className="text-primary" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                View Bookings
              </span>
              <span className="text-xs text-slate-500">
                {ownerStats.upcomingBookings} upcoming
              </span>
            </Link>
            <Link
              to="/owner/lots"
              className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="grid_view" size={24} className="text-primary" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                Manage Lots
              </span>
              <span className="text-xs text-slate-500">
                {campsite?.lots.length || 3} active
              </span>
            </Link>
            <Link
              to="/owner/stats"
              className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="bar_chart" size={24} className="text-primary" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                View Stats
              </span>
              <span className="text-xs text-slate-500">
                €{ownerStats.revenue.toLocaleString()}
              </span>
            </Link>
            <Link
              to={`/owner/campsites/${campsite?.id}/edit`}
              className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="edit" size={24} className="text-primary" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                Edit Campsite
              </span>
              <span className="text-xs text-slate-500">
                Update details
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
