import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Icon, Toggle } from '@/components/ui'
import { TopAppBar } from '@/components/layout'

// Mock M39: Owner Settings Page
export function OwnerSettingsPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        showHome
        title="Settings" />

      <div className="flex-1 px-4 pb-8">
        {/* Campsite Settings */}
        <section className="mt-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Campsite
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            <SettingItem
              icon="edit"
              label="Edit Campsite Details"
              onClick={() => navigate('/owner/campsite/edit')}
              color="bg-primary/10 text-primary"
            />
            <SettingItem
              icon="camping"
              label="Manage Lots"
              onClick={() => navigate('/owner/lots')}
              color="bg-green-100 dark:bg-green-900/20 text-green-600"
            />
            <SettingItem
              icon="calendar_month"
              label="Availability Calendar"
              color="bg-blue-100 dark:bg-blue-900/20 text-blue-600"
            />
            <SettingItem
              icon="attach_money"
              label="Pricing & Fees"
              color="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600"
              isLast
            />
          </div>
        </section>

        {/* Business Settings */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Business
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            <SettingItem
              icon="local_offer"
              label="Manage Offers"
              onClick={() => navigate('/owner/offers')}
              color="bg-purple-100 dark:bg-purple-900/20 text-purple-600"
            />
            <SettingItem
              icon="bar_chart"
              label="View Statistics"
              onClick={() => navigate('/owner/statistics')}
              color="bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600"
            />
            <SettingItem
              icon="payments"
              label="Revenue Dashboard"
              onClick={() => navigate('/owner/revenue')}
              color="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600"
              isLast
            />
          </div>
        </section>

        {/* Notifications */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Notifications
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            <ToggleItem
              icon="notifications"
              label="Booking Alerts"
              description="Get notified for new bookings"
              defaultChecked={true}
              color="bg-blue-100 dark:bg-blue-900/20 text-blue-600"
            />
            <ToggleItem
              icon="chat"
              label="Guest Messages"
              description="Receive guest inquiries"
              defaultChecked={true}
              color="bg-green-100 dark:bg-green-900/20 text-green-600"
            />
            <ToggleItem
              icon="star"
              label="Review Notifications"
              description="New reviews and ratings"
              defaultChecked={true}
              color="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600"
              isLast
            />
          </div>
        </section>

        {/* Account */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Account
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            <SettingItem
              icon="account_balance"
              label="Payout Settings"
              color="bg-teal-100 dark:bg-teal-900/20 text-teal-600"
            />
            <SettingItem
              icon="security"
              label="Security"
              color="bg-red-100 dark:bg-red-900/20 text-red-600"
            />
            <SettingItem
              icon="help"
              label="Help & Support"
              onClick={() => navigate('/support')}
              color="bg-orange-100 dark:bg-orange-900/20 text-orange-600"
              isLast
            />
          </div>
        </section>

        {/* Logout */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 font-bold py-4 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="logout" className="text-xl" />
            Log Out
          </button>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-gray-400 mt-6">
          my-island Owner v1.0.2
        </p>
      </div>
    </div>
  )
}

interface SettingItemProps {
  icon: string
  label: string
  onClick?: () => void
  color: string
  isLast?: boolean
}

function SettingItem({ icon, label, onClick, color, isLast }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left ${
        !isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon name={icon} />
      </div>
      <p className="flex-1 font-medium">{label}</p>
      <Icon name="chevron_right" className="text-gray-400" />
    </button>
  )
}

interface ToggleItemProps {
  icon: string
  label: string
  description: string
  defaultChecked: boolean
  color: string
  isLast?: boolean
}

function ToggleItem({
  icon,
  label,
  description,
  defaultChecked,
  color,
  isLast,
}: ToggleItemProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 ${
        !isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon name={icon} />
      </div>
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <Toggle checked={defaultChecked} onChange={() => {}} />
    </div>
  )
}
