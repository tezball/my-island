import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { Icon, Toggle } from '@/components/ui'
import { TopAppBar, AppShell } from '@/components/layout'
import { cn } from '@/utils/cn'

export function SettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <AppShell>
      <TopAppBar
        showHome
        title="Settings" />

      <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-6">
        {/* Profile Section */}
        <section
          onClick={() => navigate('/profile/edit')}
          className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full h-16 w-16 ring-4 ring-background-light dark:ring-surface-dark"
                style={{
                  backgroundImage: `url("${user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLAFzCiEJLBQHAyKxOBxv4DPaJk5QJOtdWlt7A9iJh64gS_qTJvUjzTIFZMf0HgtHHiU-lJKDjAfQ9cHXE7qZKB_OFlhx98Aithl6bhHdRVqk8oJU0vgDtp4AxQsqxJrOgc1BOpiuqtOkkgSv2H8rlVGT8ArRCyC8zMpCVh-bHeqNQML6iEVXqoVusyOxfs3TrCiKe-sAkqiF8Uc6r8YpUSjfaX9nZDYN4kRuEuA2RekYrvabzH1FiLhqNjwRFRqFwUUV1XpWKaA'}")`,
                }}
              />
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-white dark:border-surface-dark flex items-center justify-center">
                <Icon name="edit" className="text-white text-xs font-bold" />
              </div>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold leading-tight truncate">
                  {user?.name || 'Alex Walker'}
                </p>
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Pro Camper
                </span>
              </div>
              <p className="text-gray-500 text-sm truncate">
                {user?.email || 'alex.walker@example.com'}
              </p>
            </div>
            <Icon name="chevron_right" className="text-gray-400" />
          </div>
        </section>

        {/* Notification Preferences */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Notifications
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            {/* Item 1 */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="bg-green-50 dark:bg-green-900/20 text-primary rounded-xl p-2 flex items-center justify-center">
                <Icon name="camping" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base">Campsite Alerts</p>
                <p className="text-xs text-gray-500">
                  Get notified when spots open up
                </p>
              </div>
              <Toggle checked={true} onChange={() => {}} />
            </div>
            {/* Item 2 */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl p-2 flex items-center justify-center">
                <Icon name="local_offer" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base">Supplier Offers</p>
                <p className="text-xs text-gray-500">
                  Discounts on gear & rentals
                </p>
              </div>
              <Toggle checked={false} onChange={() => {}} />
            </div>
            {/* Item 3 */}
            <div className="flex items-center gap-4 p-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl p-2 flex items-center justify-center">
                <Icon name="event_available" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base">Reservation Updates</p>
                <p className="text-xs text-gray-500">
                  Booking confirmations & reminders
                </p>
              </div>
              <Toggle checked={true} onChange={() => {}} />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            App Experience
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl p-2 flex items-center justify-center">
                <Icon name="dark_mode" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base">Theme</p>
              </div>
            </div>
            {/* Segmented Control */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <button
                onClick={() => setTheme('system')}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                  theme === 'system'
                    ? 'bg-white dark:bg-surface-dark shadow-sm font-bold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                System
              </button>
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                  theme === 'light'
                    ? 'bg-white dark:bg-surface-dark shadow-sm font-bold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                  theme === 'dark'
                    ? 'bg-white dark:bg-surface-dark shadow-sm font-bold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* Support & Privacy */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Support & Privacy
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => navigate('/support')}
              className="w-full flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
            >
              <div className="bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-xl p-2 flex items-center justify-center">
                <Icon name="help" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base">Help Center</p>
              </div>
              <Icon name="chevron_right" className="text-gray-400 text-xl" />
            </button>
            <button className="w-full flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left">
              <div className="bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-xl p-2 flex items-center justify-center">
                <Icon name="lock" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base">Privacy Policy</p>
              </div>
              <Icon name="chevron_right" className="text-gray-400 text-xl" />
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left">
              <div className="bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-xl p-2 flex items-center justify-center">
                <Icon name="description" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base">Terms of Service</p>
              </div>
              <Icon name="chevron_right" className="text-gray-400 text-xl" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 pb-8 flex flex-col items-center gap-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold py-4 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="logout" className="text-xl" />
            Log Out
          </button>
          <p className="text-xs text-gray-400">Version 1.0.2 Build 2045</p>
        </div>
      </div>
    </AppShell>
  )
}
