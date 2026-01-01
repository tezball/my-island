import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Icon from '../components/ui/Icon'

const faqs = [
  {
    id: '1',
    category: 'booking',
    question: 'How do I make a booking?',
    answer: 'Browse campsites, select your dates and guests, choose a lot, and proceed to payment. Your booking will be confirmed immediately after successful payment.',
  },
  {
    id: '2',
    category: 'booking',
    question: 'Can I modify my booking?',
    answer: 'Yes, you can modify your dates or guest count from the booking details page up to 48 hours before check-in. Changes may affect the total price.',
  },
  {
    id: '3',
    category: 'booking',
    question: 'What is the cancellation policy?',
    answer: 'Cancellation policies vary by campsite. Most offer full refunds for cancellations made 7+ days before check-in. Check the specific campsite\'s policy before booking.',
  },
  {
    id: '4',
    category: 'payment',
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, and Google Pay.',
  },
  {
    id: '5',
    category: 'payment',
    question: 'Is my payment information secure?',
    answer: 'Yes, all payments are processed through Stripe with industry-standard encryption. We never store your full card details.',
  },
  {
    id: '6',
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email, and follow the link sent to your inbox to create a new password.',
  },
  {
    id: '7',
    category: 'campsite',
    question: 'How do I contact the host?',
    answer: 'Once you have a confirmed booking, you can message the host directly from your booking details page using the "Contact Host" button.',
  },
]

export default function FAQPage() {
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = !categoryFilter || faq.category === categoryFilter
    const matchesSearch = !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <AppShell showBack headerTitle="FAQs" showNav={false}>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Category filter chips */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <Link
              to="/support/faq"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !categoryFilter
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              All
            </Link>
            {['booking', 'payment', 'account', 'campsite'].map(cat => (
              <Link
                key={cat}
                to={`/support/faq?category=${cat}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                  categoryFilter === cat
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="px-4 space-y-3 pb-6">
          {filteredFaqs.map(faq => (
            <div
              key={faq.id}
              className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-slate-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <Icon
                  name={expandedId === faq.id ? 'expand_less' : 'expand_more'}
                  size={24}
                  className="text-slate-400 shrink-0"
                />
              </button>
              {expandedId === faq.id && (
                <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {faq.answer}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-xs text-slate-400">Was this helpful?</span>
                    <button className="text-sm text-primary font-medium flex items-center gap-1">
                      <Icon name="thumb_up" size={16} />
                      Yes
                    </button>
                    <button className="text-sm text-slate-500 font-medium flex items-center gap-1">
                      <Icon name="thumb_down" size={16} />
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <Icon name="search_off" size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No FAQs found</p>
            </div>
          )}
        </div>

        {/* Still need help */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-primary/5 rounded-xl text-center">
            <p className="font-medium text-slate-900 dark:text-white mb-2">
              Still need help?
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Our support team is here for you
            </p>
            <Link
              to="/support/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
            >
              <Icon name="mail" size={18} />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
