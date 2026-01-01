import { Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Icon from '../components/ui/Icon'
import { currentUser } from '../data/mockData'
import { APP_VERSION } from '../constants'

interface MenuItem {
  icon: string
  label: string
  path: string
  badge?: string
}

const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Account',
    items: [
      { icon: 'person', label: 'Personal Info', path: '/profile/personal-info' },
      { icon: 'security', label: 'Login & Security', path: '/settings' },
      { icon: 'credit_card', label: 'Payment Methods', path: '/payment-methods' },
      { icon: 'link', label: 'Linked Accounts', path: '/profile/linked-accounts' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'notifications', label: 'Notifications', path: '/profile/notifications' },
      { icon: 'language', label: 'Language', path: '/settings', badge: 'English' },
      { icon: 'dark_mode', label: 'Appearance', path: '/settings', badge: 'System' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help', label: 'Help Center', path: '/support' },
      { icon: 'contact_support', label: 'Contact Us', path: '/support/contact' },
      { icon: 'description', label: 'Terms & Policies', path: '/settings' },
    ],
  },
]

export default function ProfilePage() {
  const memberSince = new Date(currentUser.memberSince).toLocaleDateString('en-IE', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <AppShell headerTitle="Profile" showLogo>
      <div className="flex-1 overflow-auto">
        {/* Profile Header */}
        <div className="px-4 py-6 bg-gradient-to-br from-primary/10 to-emerald-50 dark:from-primary/5 dark:to-slate-900">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="size-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                {currentUser.email}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Member since {memberSince}
              </p>
            </div>
          </div>
          <Link
            to="/profile/edit"
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-surface-dark rounded-xl font-medium text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
          >
            <Icon name="edit" size={18} />
            Edit Profile
          </Link>
        </div>

        {/* Menu Sections */}
        <div className="p-4 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                {section.title}
              </h2>
              <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Icon name={item.icon} size={22} className="text-slate-500" />
                    <span className="flex-1 font-medium text-slate-900 dark:text-white">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-sm text-slate-400">{item.badge}</span>
                    )}
                    <Icon name="chevron_right" size={20} className="text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          <button className="w-full flex items-center justify-center gap-2 py-3 text-red-500 font-medium">
            <Icon name="logout" size={20} />
            Log Out
          </button>

          {/* Version */}
          <p className="text-center text-sm text-slate-400">
            Version {APP_VERSION}
          </p>
        </div>
      </div>
    </AppShell>
  )
}
