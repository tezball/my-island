import { Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Icon from '../components/ui/Icon'

const supportOptions = [
  {
    id: 'faq',
    icon: 'help',
    title: 'FAQs',
    description: 'Find answers to common questions',
    link: '/support/faq',
  },
  {
    id: 'contact',
    icon: 'mail',
    title: 'Contact Us',
    description: 'Get in touch with our support team',
    link: '/support/contact',
  },
  {
    id: 'ticket',
    icon: 'confirmation_number',
    title: 'Support Tickets',
    description: 'View and manage your support requests',
    link: '/support/tickets',
  },
]

const faqCategories = [
  { id: 'booking', icon: 'calendar_today', label: 'Bookings', count: 12 },
  { id: 'payment', icon: 'payments', label: 'Payments', count: 8 },
  { id: 'account', icon: 'person', label: 'Account', count: 6 },
  { id: 'campsite', icon: 'camping', label: 'Campsites', count: 10 },
]

export default function SupportPage() {
  return (
    <AppShell showBack headerTitle="Help & Support" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Icon
              name="search"
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Support Options */}
        <div className="px-4 pb-4">
          <div className="space-y-3">
            {supportOptions.map(option => (
              <Link
                key={option.id}
                to={option.link}
                className="block bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name={option.icon} size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {option.title}
                    </p>
                    <p className="text-sm text-slate-500">{option.description}</p>
                  </div>
                  <Icon name="chevron_right" size={24} className="text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Browse by Category
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {faqCategories.map(cat => (
              <Link
                key={cat.id}
                to={`/support/faq?category=${cat.id}`}
                className="p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <Icon name={cat.icon} size={24} className="text-primary mb-2" />
                <p className="font-medium text-slate-900 dark:text-white">{cat.label}</p>
                <p className="text-sm text-slate-500">{cat.count} articles</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Icon name="chat" size={20} className="text-primary" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Live Chat (Available 9am - 6pm)
              </span>
            </button>
            <a
              href="tel:+35312345678"
              className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
            >
              <Icon name="phone" size={20} className="text-primary" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Call Support: +353 1 234 5678
              </span>
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
