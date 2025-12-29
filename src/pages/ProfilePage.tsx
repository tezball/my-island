import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { Button, Icon, Toggle } from '@/components/ui'
import { TopAppBar, AppShell } from '@/components/layout'

interface SettingItemProps {
  icon: string
  label: string
  onClick?: () => void
  toggle?: boolean
  toggleValue?: boolean
  onToggle?: (value: boolean) => void
  danger?: boolean
}

function SettingItem({
  icon,
  label,
  onClick,
  toggle,
  toggleValue,
  onToggle,
  danger,
}: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon
          name={icon}
          className={danger ? 'text-red-500' : 'text-slate-400'}
        />
        <span
          className={`font-medium ${
            danger ? 'text-red-500' : 'text-slate-900 dark:text-white'
          }`}
        >
          {label}
        </span>
      </div>
      {toggle ? (
        <Toggle checked={toggleValue || false} onChange={onToggle || (() => {})} />
      ) : (
        <Icon name="chevron_right" className="text-slate-400" />
      )}
    </button>
  )
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!isAuthenticated) {
    return (
      <AppShell>
        <TopAppBar title="Profile" showBack={false} />
        <div className="px-4 py-12 text-center">
          <Icon
            name="account_circle"
            size="xl"
            className="text-slate-300 dark:text-slate-600 mx-auto mb-4 text-6xl"
          />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to my-island
          </h2>
          <p className="text-slate-500 mb-6">
            Sign in to manage your bookings and favorites
          </p>
          <Button onClick={() => navigate('/login')} size="lg">
            Sign In
          </Button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <TopAppBar title="Profile" showBack={false} />

      <div className="px-4 pb-28">
        {/* Profile Header */}
        <div className="flex flex-col items-center py-6">
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary">
                <Icon name="person" size="xl" className="text-primary text-4xl" />
              </div>
            )}
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Icon name="edit" size="sm" className="text-white" />
            </button>
          </div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white mt-3">
            {user?.name}
          </h2>
          <p className="text-sm text-primary flex items-center gap-1">
            <Icon name="location_on" size="sm" />
            Island Camper
          </p>
          <button className="mt-3 px-6 py-2 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Stats Widget */}
        <div className="flex bg-white dark:bg-surface-dark rounded-2xl shadow-card mb-6 divide-x divide-slate-100 dark:divide-slate-700">
          <div className="flex-1 py-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {user?.savedCampsites?.length || 0}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Campsites</p>
          </div>
          <div className="flex-1 py-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Alerts</p>
          </div>
          <div className="flex-1 py-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">8</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Reviews</p>
          </div>
        </div>

        {/* Settings Groups */}
        <div className="space-y-4">
          {/* Appearance */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden">
            <h3 className="px-4 pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase">
              Appearance
            </h3>
            <SettingItem
              icon="dark_mode"
              label="Dark Mode"
              toggle
              toggleValue={theme === 'dark'}
              onToggle={toggleTheme}
            />
          </div>

          {/* Account */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden">
            <h3 className="px-4 pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase">
              Account
            </h3>
            <SettingItem icon="person" label="Edit Profile" />
            <SettingItem icon="notifications" label="Notifications" />
            <SettingItem icon="security" label="Privacy & Security" />
            <SettingItem icon="payment" label="Payment Methods" />
          </div>

          {/* Support */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden">
            <h3 className="px-4 pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase">
              Support
            </h3>
            <SettingItem icon="help" label="Help Center" />
            <SettingItem icon="feedback" label="Send Feedback" />
            <SettingItem icon="description" label="Terms of Service" />
            <SettingItem icon="privacy_tip" label="Privacy Policy" />
          </div>

          {/* Logout */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden">
            <SettingItem
              icon="logout"
              label="Sign Out"
              danger
              onClick={handleLogout}
            />
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-slate-400 mt-6">
          my-island v0.0.1
        </p>
      </div>
    </AppShell>
  )
}
