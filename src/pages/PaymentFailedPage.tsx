import { useNavigate, useParams } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'

// Mock M19: Payment Failed Page (P0 Critical)
export function PaymentFailedPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const handleRetry = () => {
    navigate(`/book/${id}/payment`)
  }

  const handleChangePayment = () => {
    navigate(`/book/${id}/payment-methods`)
  }

  const handleContactSupport = () => {
    // Would open support chat or page
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
        {/* Error Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Icon name="credit_card_off" className="text-6xl text-red-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <Icon name="close" className="text-white text-2xl" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-center mb-3">Payment Failed</h1>
        <p className="text-center text-gray-500 mb-8 max-w-xs">
          We couldn't process your payment. Please check your card details and try again.
        </p>

        {/* Error Details */}
        <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Icon name="error_outline" className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Transaction Declined
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Your bank declined this transaction. This could be due to insufficient funds, card restrictions, or security measures.
              </p>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="w-full space-y-3 mb-8">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
            What you can do
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl">
              <Icon name="credit_card" className="text-gray-400 text-xl" />
              <div>
                <p className="text-sm font-medium">Check your card details</p>
                <p className="text-xs text-gray-500">Make sure the card number, expiry date, and CVV are correct</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl">
              <Icon name="account_balance" className="text-gray-400 text-xl" />
              <div>
                <p className="text-sm font-medium">Check with your bank</p>
                <p className="text-xs text-gray-500">Your bank may have blocked the transaction for security</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl">
              <Icon name="swap_horiz" className="text-gray-400 text-xl" />
              <div>
                <p className="text-sm font-medium">Try a different payment method</p>
                <p className="text-xs text-gray-500">Use another card or payment option</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button className="w-full" size="lg" onClick={handleRetry}>
            <Icon name="refresh" className="mr-2" />
            Try Again
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleChangePayment}
          >
            Use Different Payment Method
          </Button>
          <button
            onClick={handleContactSupport}
            className="w-full text-sm text-primary font-medium py-2"
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* Booking still reserved notice */}
      <div className="px-6 py-4 bg-primary/10 border-t border-primary/20">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Icon name="schedule" className="text-primary text-xl" />
          <div>
            <p className="text-sm font-medium">Your booking is still reserved</p>
            <p className="text-xs text-gray-500">Complete payment within 15 minutes to secure your spot</p>
          </div>
        </div>
      </div>
    </div>
  )
}
