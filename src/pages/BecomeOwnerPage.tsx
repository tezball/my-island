import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ownerApi } from '../lib/api/owner'

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true'

const benefits = [
  {
    icon: 'payments',
    title: 'Earn Extra Income',
    description: 'Turn your land into a source of revenue by hosting campers and glampers.',
  },
  {
    icon: 'calendar_month',
    title: 'Flexible Schedule',
    description: 'You control when your site is available. Block dates whenever you need.',
  },
  {
    icon: 'groups',
    title: 'Meet New People',
    description: 'Connect with travelers from around the world who share your love of nature.',
  },
  {
    icon: 'support_agent',
    title: 'Full Support',
    description: 'Our team helps with listings, bookings, and any issues that arise.',
  },
]

export default function BecomeOwnerPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  // If already an owner, redirect to owner dashboard
  useEffect(() => {
    if (user?.isOwner) {
      navigate('/owner', { replace: true })
    }
  }, [user?.isOwner, navigate])

  // Don't render content if user is already an owner (will redirect)
  if (user?.isOwner) {
    return null
  }

  const handleBecomeOwner = async () => {
    if (!agreed) {
      toast.warning('Agreement Required', 'Please accept the terms to continue.')
      return
    }

    setIsLoading(true)
    try {
      if (USE_REAL_API) {
        await ownerApi.becomeOwner()
      } else {
        // Mock mode: simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      updateUser({ ...user, isOwner: true })
      toast.success('Welcome!', 'You are now registered as a property owner.')
      navigate('/owner/property/new')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register as owner'
      toast.error('Error', message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppShell showBack headerTitle="Become a Host" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <div className="relative h-48 bg-gradient-to-br from-primary to-emerald-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Icon name="add_business" size={48} className="mb-2" />
              <h1 className="text-2xl font-bold">Start Hosting Today</h1>
              <p className="text-white/80">Share your space with adventurers</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Benefits */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Why become a host?
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex gap-4 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800"
                >
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={benefit.icon} size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              How it works
            </h2>
            <div className="space-y-3">
              {[
                { step: 1, text: 'Create your first campsite listing' },
                { step: 2, text: 'Add photos and set your prices' },
                { step: 3, text: 'Start receiving bookings' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-primary text-slate-900 font-bold flex items-center justify-center text-sm">
                    {step}
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Terms Agreement */}
          <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 size-5 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                I agree to the{' '}
                <button className="text-primary font-medium">Host Terms of Service</button> and{' '}
                <button className="text-primary font-medium">Community Guidelines</button>. I
                understand that I am responsible for my listings and guest interactions.
              </span>
            </label>
          </section>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="sticky bottom-0 p-4 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800">
        <Button
          className="w-full"
          size="lg"
          onClick={handleBecomeOwner}
          isLoading={isLoading}
          disabled={!agreed}
        >
          Start Hosting
        </Button>
      </div>
    </AppShell>
  )
}
