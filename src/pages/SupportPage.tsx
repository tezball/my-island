import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { cn } from '@/utils/cn'

// Mock M31: Support/Help Center Page
const FAQ_ITEMS = [
  {
    id: '1',
    question: 'How do I cancel a booking?',
    answer:
      'You can cancel a booking by going to My Bookings, selecting the booking you want to cancel, and tapping "Cancel Booking". Refunds are processed according to the campsite\'s cancellation policy.',
  },
  {
    id: '2',
    question: 'What payment methods are accepted?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, and Apple Pay. Some campsites may also accept bank transfers.',
  },
  {
    id: '3',
    question: 'Can I modify my reservation dates?',
    answer:
      'Yes! Go to your booking details and tap "Modify Booking". You can change your check-in and check-out dates subject to availability. Price adjustments will be calculated automatically.',
  },
  {
    id: '4',
    question: 'How do I contact the campsite host?',
    answer:
      'Once you have a confirmed booking, you can message the host directly through the booking details page. Tap "Contact Host" to start a conversation.',
  },
  {
    id: '5',
    question: 'What if I have an issue during my stay?',
    answer:
      'Contact the host first through the app. If the issue isn\'t resolved, our support team is available 24/7. You can reach us through Live Chat or by calling our emergency helpline.',
  },
]

const CONTACT_OPTIONS = [
  {
    id: 'chat',
    icon: 'chat',
    label: 'Live Chat',
    description: 'Chat with support',
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'email',
    icon: 'email',
    label: 'Email',
    description: 'Get a response in 24h',
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
  },
  {
    id: 'phone',
    icon: 'phone',
    label: 'Call Us',
    description: 'Mon-Fri, 9AM-6PM',
    color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
  },
]

export function SupportPage() {
  const navigate = useNavigate()
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = FAQ_ITEMS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar title="Help Center" />

      <div className="flex-1 px-4 pb-8">
        {/* Search */}
        <div className="mt-4 relative">
          <Icon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* Quick Actions */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Contact Us
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {CONTACT_OPTIONS.map((option) => (
              <button
                key={option.id}
                className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 hover:scale-[0.98] active:scale-95 transition-transform"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${option.color}`}
                >
                  <Icon name={option.icon} className="text-2xl" />
                </div>
                <p className="font-semibold text-sm">{option.label}</p>
                <p className="text-xs text-gray-500 text-center">
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Frequently Asked Questions
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            {filteredFaqs.map((faq, idx) => (
              <div
                key={faq.id}
                className={
                  idx !== filteredFaqs.length - 1
                    ? 'border-b border-gray-100 dark:border-gray-800'
                    : ''
                }
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                  }
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <p className="font-semibold pr-4">{faq.question}</p>
                  <Icon
                    name={
                      expandedFaq === faq.id ? 'expand_less' : 'expand_more'
                    }
                    className="text-gray-400 shrink-0"
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    expandedFaq === faq.id ? 'max-h-48' : 'max-h-0'
                  )}
                >
                  <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <Icon
                name="search_off"
                className="text-5xl text-gray-300 dark:text-gray-600 mb-4"
              />
              <p className="text-gray-500">
                No results found for "{searchQuery}"
              </p>
            </div>
          )}
        </section>

        {/* Helpful Links */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Helpful Links
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            <LinkItem
              icon="gavel"
              label="Community Guidelines"
              color="text-orange-500"
            />
            <LinkItem
              icon="report_problem"
              label="Report a Problem"
              color="text-red-500"
            />
            <LinkItem
              icon="feedback"
              label="Send Feedback"
              color="text-blue-500"
              isLast
            />
          </div>
        </section>

        {/* Emergency Banner */}
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 flex gap-3">
          <Icon name="emergency" className="text-red-500 text-xl shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-300 mb-1">
              Emergency?
            </p>
            <p className="text-sm text-red-700 dark:text-red-400 mb-2">
              If you're in immediate danger, please contact local emergency
              services.
            </p>
            <button className="text-red-600 font-bold text-sm">
              View Emergency Contacts →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface LinkItemProps {
  icon: string
  label: string
  color: string
  isLast?: boolean
}

function LinkItem({ icon, label, color, isLast }: LinkItemProps) {
  return (
    <button
      className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left ${
        !isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''
      }`}
    >
      <Icon name={icon} className={`text-xl ${color}`} />
      <p className="flex-1 font-medium">{label}</p>
      <Icon name="chevron_right" className="text-gray-400" />
    </button>
  )
}
