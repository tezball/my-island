import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import {
  BookingWizardProvider,
  useBookingWizard,
  type BookingWizardStep,
} from '@/context/BookingWizardContext'
import BookingStepDates from '@/components/booking/steps/BookingStepDates'
import BookingStepType from '@/components/booking/steps/BookingStepType'
import BookingStepGuests from '@/components/booking/steps/BookingStepGuests'
import BookingStepExtras from '@/components/booking/steps/BookingStepExtras'
import BookingWizardFooter from '@/components/booking/BookingWizardFooter'
import Icon from '@/components/ui/Icon'
import { campsitesApi } from '@/lib/api/campsites'

// Step configuration
const STEPS: { id: BookingWizardStep; label: string; icon: string }[] = [
  { id: 'dates', label: 'Dates', icon: 'calendar_today' },
  { id: 'type', label: 'Type', icon: 'hotel' },
  { id: 'guests', label: 'Guests', icon: 'group' },
  { id: 'extras', label: 'Extras', icon: 'add_circle' },
  { id: 'payment', label: 'Pay', icon: 'payments' },
]

function WizardProgress() {
  const { state, currentStepIndex, goToStep } = useBookingWizard()

  return (
    <div className="bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-slate-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {STEPS.map((step, index) => {
          const isActive = state.currentStep === step.id
          const isCompleted = state.completedSteps.includes(step.id)
          const isPast = index < currentStepIndex
          const canNavigate = isPast || isCompleted

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => canNavigate && goToStep(step.id)}
              disabled={!canNavigate}
              className={`
                flex flex-col items-center gap-1 transition-colors
                ${canNavigate ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <div
                className={`
                  size-10 rounded-full flex items-center justify-center transition-colors
                  ${isActive
                    ? 'bg-primary text-slate-900'
                    : isCompleted
                    ? 'bg-primary/20 text-primary'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }
                `}
              >
                {isCompleted && !isActive ? (
                  <Icon name="check" size={20} />
                ) : (
                  <Icon name={step.icon} size={20} />
                )}
              </div>
              <span
                className={`
                  text-xs font-medium
                  ${isActive
                    ? 'text-primary'
                    : isCompleted
                    ? 'text-slate-600 dark:text-slate-400'
                    : 'text-slate-400'
                  }
                `}
              >
                {step.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function WizardContent() {
  const navigate = useNavigate()
  const { state, nextStep, autoAssignLot, canProceed, priceBreakdown, nights } = useBookingWizard()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleNext = async () => {
    if (!canProceed()) return

    // Special handling for guests step - auto-assign lot before proceeding
    if (state.currentStep === 'guests') {
      setIsProcessing(true)
      try {
        await autoAssignLot()
        nextStep()
      } catch {
        // Error is handled by context
      } finally {
        setIsProcessing(false)
      }
      return
    }

    // Special handling for extras step - navigate to payment page
    if (state.currentStep === 'extras') {
      // Navigate to payment page with booking data
      navigate(`/book/${state.campsiteId}/payment`, {
        state: {
          fromWizard: true,
          campsite: {
            id: state.campsiteId,
            name: state.campsiteName,
            image: state.campsiteImage,
          },
          lot: state.assignedLot,
          dates: {
            checkIn: state.checkIn?.toISOString(),
            checkOut: state.checkOut?.toISOString(),
          },
          guests: state.adults + state.children,
          extras: state.selectedExtras,
          nights,
          priceBreakdown,
          totalPrice: priceBreakdown?.total || 0,
        },
      })
      return
    }

    nextStep()
  }

  const renderStep = () => {
    switch (state.currentStep) {
      case 'dates':
        return <BookingStepDates />
      case 'type':
        return <BookingStepType />
      case 'guests':
        return <BookingStepGuests />
      case 'extras':
        return <BookingStepExtras />
      case 'payment':
        // This shouldn't render - we navigate away
        return null
      default:
        return null
    }
  }

  return (
    <>
      <WizardProgress />
      <div className="flex-1 overflow-auto">{renderStep()}</div>
      <BookingWizardFooter onNext={handleNext} isLoading={isProcessing || state.isLoading} />
    </>
  )
}

function WizardLoader({ campsiteId }: { campsiteId: string }) {
  const [campsite, setCampsite] = useState<{
    id: string
    name: string
    image: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampsite = async () => {
      try {
        const data = await campsitesApi.getById(campsiteId)
        setCampsite({
          id: data.id,
          name: data.name,
          image: data.images[0] || '',
        })
      } catch {
        setError('Failed to load campsite details')
      }
    }
    fetchCampsite()
  }, [campsiteId])

  if (error) {
    return (
      <AppShell showBack headerTitle="Book Your Stay" showNav={false}>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
          <Icon name="error" size={48} className="text-red-500 mb-4" />
          <p className="text-slate-900 dark:text-white font-semibold mb-2">
            Something went wrong
          </p>
          <p className="text-slate-500">{error}</p>
        </div>
      </AppShell>
    )
  }

  if (!campsite) {
    return (
      <AppShell showBack headerTitle="Book Your Stay" showNav={false}>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Icon name="progress_activity" size={32} className="text-primary animate-spin" />
        </div>
      </AppShell>
    )
  }

  return (
    <BookingWizardProvider
      campsiteId={campsite.id}
      campsiteName={campsite.name}
      campsiteImage={campsite.image}
    >
      <AppShell showBack headerTitle={campsite.name} showNav={false}>
        <WizardContent />
      </AppShell>
    </BookingWizardProvider>
  )
}

export default function BookingWizardPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <AppShell showBack headerTitle="Book Your Stay" showNav={false}>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
          <Icon name="error" size={48} className="text-red-500 mb-4" />
          <p className="text-slate-900 dark:text-white font-semibold">
            Invalid campsite
          </p>
        </div>
      </AppShell>
    )
  }

  return <WizardLoader campsiteId={id} />
}
