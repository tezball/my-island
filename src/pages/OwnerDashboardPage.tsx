import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Button, Toggle } from '@/components/ui'

// Owner Admin Dashboard - from design
export function OwnerDashboardPage() {
  const navigate = useNavigate()
  const [campsiteVisible, setCampsiteVisible] = useState(true)
  const [alertMessage, setAlertMessage] = useState('')

  const stats = {
    views: 1240,
    viewsChange: '+12%',
    alertsSent: 8,
    alertsChange: '+2%',
    activeGuests: 45,
  }

  const handleBroadcast = () => {
    if (alertMessage.trim()) {
      // Would send broadcast via API
      setAlertMessage('')
      alert('Broadcast sent to ' + stats.activeGuests + ' guests!')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex items-center px-4 pt-6 pb-2 justify-between bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          Admin Dashboard
        </h2>
        <button
          onClick={() => navigate('/owner/settings')}
          className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Icon name="settings" className="text-2xl" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="h-4" />

        {/* Stats Section */}
        <section className="flex flex-row gap-4 mb-6">
          {/* Stat Card 1 */}
          <div className="flex flex-1 flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-surface-dark shadow-soft border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="visibility" className="text-primary text-xl" />
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                {stats.viewsChange}
              </span>
            </div>
            <div>
              <p className="text-3xl font-extrabold leading-tight tracking-tight">
                {stats.views.toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm font-medium mt-1">
                Views this week
              </p>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="flex flex-1 flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-surface-dark shadow-soft border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon
                  name="notifications_active"
                  className="text-primary text-xl"
                />
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                {stats.alertsChange}
              </span>
            </div>
            <div>
              <p className="text-3xl font-extrabold leading-tight tracking-tight">
                {stats.alertsSent}
              </p>
              <p className="text-gray-500 text-sm font-medium mt-1">
                Alerts Sent
              </p>
            </div>
          </div>
        </section>

        {/* Campsite Status Card */}
        <section className="mb-6">
          <div className="flex flex-col rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold leading-tight">
                  Campsite Status
                </h3>
                <p className="text-gray-500 text-sm font-normal leading-normal">
                  Visible to guests on map.
                </p>
              </div>
              <Toggle
                checked={campsiteVisible}
                onChange={setCampsiteVisible}
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 dark:bg-white/5 p-2 rounded-lg">
              <Icon name="info" className="text-base" />
              <span>Update details to auto-notify upcoming guests.</span>
            </div>
          </div>
        </section>

        {/* Broadcast Alert Tool */}
        <section className="mb-8">
          <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-surface-dark dark:to-background-dark border border-gray-100 dark:border-gray-800 p-6 shadow-soft relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary">
                  <Icon name="campaign" className="text-sm" />
                </span>
                <h1 className="tracking-tight text-xl font-bold leading-tight">
                  Send Supplier Alert
                </h1>
              </div>
              <p className="text-gray-500 text-sm font-normal leading-relaxed">
                Notify guests about fresh supplies, happy hours, or local
                events.
              </p>
            </div>

            <div className="flex flex-col gap-3 relative z-10">
              <label className="flex flex-col w-full group">
                <div className="relative w-full">
                  <textarea
                    value={alertMessage}
                    onChange={(e) =>
                      setAlertMessage(e.target.value.slice(0, 140))
                    }
                    className="w-full min-h-[120px] resize-none rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 p-4 text-base font-normal leading-normal transition-all"
                    placeholder="Examples: 'Fresh fish market opens in 10 mins!' or 'Live music at the bonfire tonight.'"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {alertMessage.length}/140
                  </div>
                </div>
              </label>
              <Button
                className="w-full h-14"
                size="lg"
                onClick={handleBroadcast}
                leftIcon="send"
              >
                Broadcast to Guests
              </Button>
              <p className="text-center text-xs text-gray-400 mt-1">
                This will send a push notification to {stats.activeGuests}{' '}
                active guests.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/owner/bookings')}
              className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors"
            >
              <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                <Icon name="calendar_month" className="text-2xl" />
              </div>
              <span className="font-medium text-sm">Bookings</span>
            </button>
            <button
              onClick={() => navigate('/owner/statistics')}
              className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors"
            >
              <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                <Icon name="bar_chart" className="text-2xl" />
              </div>
              <span className="font-medium text-sm">Statistics</span>
            </button>
            <button
              onClick={() => navigate('/owner/lots')}
              className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors"
            >
              <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                <Icon name="camping" className="text-2xl" />
              </div>
              <span className="font-medium text-sm">Manage Lots</span>
            </button>
            <button
              onClick={() => navigate('/owner/offers')}
              className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors"
            >
              <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                <Icon name="local_offer" className="text-2xl" />
              </div>
              <span className="font-medium text-sm">Offers</span>
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-6 pb-6 pt-3 z-50">
        <div className="flex justify-between items-center">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Icon name="grid_view" className="text-2xl" filled />
            <span className="text-[10px] font-bold tracking-wide">
              Dashboard
            </span>
          </button>
          <button
            onClick={() => navigate('/owner/bookings')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors"
          >
            <Icon name="calendar_month" className="text-2xl" />
            <span className="text-[10px] font-medium tracking-wide">
              Bookings
            </span>
          </button>
          <div className="relative -top-6">
            <button className="flex items-center justify-center size-14 rounded-full bg-slate-900 dark:bg-white text-primary shadow-lg hover:scale-105 transition-all">
              <Icon name="add" className="text-3xl" />
            </button>
          </div>
          <button
            onClick={() => navigate('/owner/campsite/edit')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors"
          >
            <Icon name="camping" className="text-2xl" />
            <span className="text-[10px] font-medium tracking-wide">
              My Site
            </span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors"
          >
            <Icon name="person" className="text-2xl" />
            <span className="text-[10px] font-medium tracking-wide">
              Profile
            </span>
          </button>
        </div>
      </nav>
    </div>
  )
}
