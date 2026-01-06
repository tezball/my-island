import { useState } from 'react'
import { useBookingWizard } from '@/context/BookingWizardContext'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

interface BookingWizardFooterProps {
  onNext: () => void
  isLoading?: boolean
}

export default function BookingWizardFooter({ onNext, isLoading = false }: BookingWizardFooterProps) {
  const {
    state,
    canProceed,
    isFirstStep,
    isLastStep,
    prevStep,
    priceBreakdown,
    nights,
  } = useBookingWizard()

  const [showBreakdown, setShowBreakdown] = useState(false)
  const canContinue = canProceed()

  // Get button text based on current step
  const getButtonText = () => {
    switch (state.currentStep) {
      case 'dates':
        return 'Select Accommodation'
      case 'type':
        return 'Set Guest Count'
      case 'guests':
        return 'Choose Extras'
      case 'extras':
        return 'Continue to Payment'
      case 'payment':
        return 'Confirm Booking'
      default:
        return 'Continue'
    }
  }

  // Show price preview when we have lot type selected
  const selectedLotType = state.availableLotTypes.find(
    (lt) => lt.type === state.selectedLotType
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 px-4 py-4 safe-area-inset-bottom z-40">
      <div className="max-w-lg mx-auto">
        {/* Price Summary (when available) */}
        {priceBreakdown ? (
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  €{priceBreakdown.total.toFixed(2)}
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-primary font-medium flex items-center gap-1"
                onClick={() => setShowBreakdown(!showBreakdown)}
              >
                {showBreakdown ? 'Hide' : 'View'} breakdown
                <Icon name={showBreakdown ? 'expand_less' : 'expand_more'} size={16} />
              </button>
            </div>
            {showBreakdown && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>€{priceBreakdown.nightlyRate.toFixed(2)} × {priceBreakdown.nights} {priceBreakdown.nights === 1 ? 'night' : 'nights'}</span>
                  <span>€{priceBreakdown.accommodationTotal.toFixed(2)}</span>
                </div>
                {priceBreakdown.extrasTotal > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Extras</span>
                    <span>€{priceBreakdown.extrasTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Service fee (5%)</span>
                  <span>€{priceBreakdown.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Total</span>
                  <span>€{priceBreakdown.total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        ) : selectedLotType && nights > 0 ? (
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-slate-500">Estimated from</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                €{(selectedLotType.minPrice * nights).toFixed(2)}
              </p>
            </div>
            <p className="text-sm text-slate-500">
              {nights} {nights === 1 ? 'night' : 'nights'}
            </p>
          </div>
        ) : null}

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {!isFirstStep && (
            <Button
              variant="secondary"
              onClick={prevStep}
              className="flex-shrink-0"
            >
              <Icon name="arrow_back" size={20} />
            </Button>
          )}
          <Button
            variant="primary"
            onClick={onNext}
            disabled={!canContinue || isLoading}
            isLoading={isLoading}
            className="flex-1"
            rightIcon={isLastStep ? undefined : 'arrow_forward'}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </div>
  )
}
