import { useParams, useNavigate } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'

export function CancellationSuccessPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
        {/* Success Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="event_available" className="text-6xl text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
            <Icon name="check" className="text-background-dark text-2xl" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-center mb-3">Booking Cancelled</h1>
        <p className="text-center text-gray-500 mb-8 max-w-xs">
          Your booking has been successfully cancelled. We've sent a confirmation to your email.
        </p>

        {/* Refund Info */}
        <div className="w-full bg-white dark:bg-surface-dark rounded-2xl p-4 mb-6 space-y-4">
          <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wide">
            Refund Details
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Original amount</span>
              <span className="font-medium">€150.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Cancellation fee (50%)</span>
              <span className="font-medium text-red-500">-€75.00</span>
            </div>
            <div className="flex justify-between text-sm pt-3 border-t border-gray-100 dark:border-gray-800">
              <span className="font-bold">Refund amount</span>
              <span className="font-bold text-primary">€75.00</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-xl">
            <Icon name="schedule" className="text-primary text-xl mt-0.5" />
            <div>
              <p className="text-sm font-medium">Refund in 5-10 business days</p>
              <p className="text-xs text-gray-500">
                The refund will be credited to your original payment method.
              </p>
            </div>
          </div>
        </div>

        {/* Cancelled Booking Summary */}
        <div className="w-full bg-gray-50 dark:bg-surface-dark rounded-xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden grayscale">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200')",
                }}
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-400 line-through">
                Whispering Pines Campsite
              </p>
              <p className="text-xs text-gray-400">Oct 12 - Oct 14, 2024</p>
            </div>
            <div className="px-2 py-1 bg-red-100 dark:bg-red-900/20 rounded text-xs font-bold text-red-600 dark:text-red-400">
              Cancelled
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button className="w-full" size="lg" onClick={() => navigate('/search')}>
            <Icon name="search" className="mr-2" />
            Find Another Campsite
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => navigate('/bookings')}
          >
            View My Bookings
          </Button>
        </div>
      </div>

      {/* Bottom Help */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Need help?</p>
            <p className="text-xs text-gray-500">Contact our support team</p>
          </div>
          <button className="text-primary font-bold text-sm flex items-center gap-1">
            <Icon name="support_agent" className="text-lg" />
            Get Help
          </button>
        </div>
      </div>
    </div>
  )
}
