import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Icon from '../components/ui/Icon'

const topics = [
  'Booking Issue',
  'Payment Problem',
  'Cancellation Request',
  'Account Issue',
  'Technical Problem',
  'Feedback',
  'Other',
]

export default function ContactSupportPage() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic || !subject.trim() || !message.trim()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    navigate('/support/tickets')
  }

  return (
    <AppShell showBack headerTitle="Contact Us" showNav={false}>
      <div className="flex-1 overflow-auto">
        <form onSubmit={handleSubmit}>
          {/* Topic Selection */}
          <div className="p-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              What can we help you with?
            </label>
            <div className="flex flex-wrap gap-2">
              {topics.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    topic === t
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-4 pt-0 space-y-4">
            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please provide as much detail as possible..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Attachment */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Attachments (Optional)
              </label>
              <button
                type="button"
                className="w-full p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center gap-2 hover:border-primary transition-colors"
              >
                <Icon name="attach_file" size={24} className="text-slate-400" />
                <span className="text-sm text-slate-500">
                  Add screenshots or documents
                </span>
              </button>
            </div>
          </div>

          {/* Alternative Contact */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
              Other Ways to Reach Us
            </h3>
            <div className="space-y-2">
              <a
                href="tel:+353123456789"
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
              >
                <Icon name="phone" size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    +353 1 234 5678
                  </p>
                  <p className="text-xs text-slate-500">Mon-Fri, 9am - 6pm</p>
                </div>
              </a>
              <a
                href="mailto:support@myisland.ie"
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
              >
                <Icon name="mail" size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    support@myisland.ie
                  </p>
                  <p className="text-xs text-slate-500">Response within 24 hours</p>
                </div>
              </a>
            </div>
          </div>

          <div className="h-24" />

          {/* Submit Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
            <Button
              type="submit"
              className="w-full"
              disabled={!topic || !subject.trim() || !message.trim()}
              isLoading={isSubmitting}
              leftIcon="send"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
