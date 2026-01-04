import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { APP_VERSION } from '../constants'
import { getInitials } from '../lib/utils'

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
      { icon: 'favorite', label: 'Saved Campsites', path: '/favorites' },
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
  const navigate = useNavigate()
  const { user, logout, isLoading } = useAuth()
  const toast = useToast()

  const memberSince = user?.memberSince
    ? new Date(user.memberSince).toLocaleDateString('en-IE', {
        month: 'long',
        year: 'numeric',
      })
    : ''

  const handleLogout = () => {
    logout()
    toast.success('Logged out', 'You have been logged out successfully.')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <AppShell headerTitle="Profile" showLogo>
        <div className="flex-1 p-4 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={80} height={80} />
            <div className="space-y-2">
              <Skeleton variant="text" className="w-32 h-5" />
              <Skeleton variant="text" className="w-48" />
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell headerTitle="Profile" showLogo>
      <div className="flex-1 overflow-auto">
        {/* Profile Header */}
        <div className="px-4 py-6 bg-gradient-to-br from-primary/10 to-emerald-50 dark:from-primary/5 dark:to-slate-900">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="size-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
              />
            ) : (
              <div className="size-20 rounded-full bg-primary/20 border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {getInitials(user?.name || '')}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {user?.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                {user?.email}
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

        {/* Supplier Dashboard Link - shown only for suppliers */}
        {user?.isSupplier && (
          <div className="px-4 pt-4">
            <Link
              to="/supplier"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-emerald-50 dark:from-primary/20 dark:to-emerald-900/20 rounded-2xl border border-primary/20"
            >
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="storefront" size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">Supplier Dashboard</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage your business profile and offers
                </p>
              </div>
              <Icon name="chevron_right" size={20} className="text-primary" />
            </Link>
          </div>
        )}

        {/* Owner Dashboard Link - shown only for owners */}
        {user?.isOwner && (
          <div className="px-4 pt-4">
            <Link
              to="/owner"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-emerald-50 dark:from-primary/20 dark:to-emerald-900/20 rounded-2xl border border-primary/20"
            >
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="dashboard" size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">Owner Dashboard</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage your campsites and bookings
                </p>
              </div>
              <Icon name="chevron_right" size={20} className="text-primary" />
            </Link>
          </div>
        )}

        {/* Become Owner CTA - shown for non-owners */}
        {!user?.isOwner && (
          <div className="px-4 pt-4">
            <Link
              to="/become-owner"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-emerald-50 dark:from-primary/20 dark:to-emerald-900/20 rounded-2xl border border-primary/20"
            >
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="add_business" size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">Become a Host</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  List your campsite and start earning
                </p>
              </div>
              <Icon name="chevron_right" size={20} className="text-primary" />
            </Link>
          </div>
        )}

        {/* Become Supplier CTA - shown for non-suppliers */}
        {!user?.isSupplier && (
          <div className="px-4 pt-4">
            <Link
              to="/become-supplier"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800"
            >
              <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                <Icon name="storefront" size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">Become a Supplier</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Partner with campsites and offer your services
                </p>
              </div>
              <Icon name="chevron_right" size={20} className="text-amber-600 dark:text-amber-400" />
            </Link>
          </div>
        )}

        {/* Menu Sections */}
        <div className="p-4 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                {section.title}
              </h2>
              <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {section.items.map((item, index) => (
                  <Link
                    key={`${section.title}-${index}`}
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
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
