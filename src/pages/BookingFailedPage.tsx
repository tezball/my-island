import { useNavigate, useParams } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'

// Mock M20: Booking Failed Page
export function BookingFailedPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const handleRetry = () => {
    navigate(`/book/${id}/dates`)
  }

  const handleBrowse = () => {
    navigate('/search')
  }

  const handleContactSupport = () => {
    // Would open support chat or page
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
        {/* Error Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
            <Icon name="event_busy" className="text-6xl text-orange-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Icon name="priority_high" className="text-white text-2xl" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-center mb-3">Booking Failed</h1>
        <p className="text-center text-gray-500 mb-8 max-w-xs">
          We couldn't complete your booking. This may be because the dates are no longer available.
        </p>

        {/* Error Details */}
        <div className="w-full bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/50 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Icon name="info_outline" className="text-orange-500 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                Availability Changed
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                The lot you selected was booked by someone else while you were checking out. This can happen during high-demand periods.
              </p>
            </div>
          </div>
        </div>

        {/* What happened timeline */}
        <div className="w-full mb-8">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            What happened
          </h3>
          <div className="relative pl-6 space-y-4">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700" />

            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Icon name="check" className="text-white text-xs" />
              </div>
              <div>
                <p className="text-sm font-medium">Dates selected</p>
                <p className="text-xs text-gray-500">Oct 15-18, 2024</p>
              </div>
            </div>

            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Icon name="check" className="text-white text-xs" />
              </div>
              <div>
                <p className="text-sm font-medium">Payment processed</p>
                <p className="text-xs text-gray-500">Your card was not charged</p>
              </div>
            </div>

            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <Icon name="close" className="text-white text-xs" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Booking not confirmed
                </p>
                <p className="text-xs text-gray-500">Lot no longer available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button className="w-full" size="lg" onClick={handleRetry}>
            <Icon name="refresh" className="mr-2" />
            Try Different Dates
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleBrowse}
          >
            Browse Other Campsites
          </Button>
          <button
            onClick={handleContactSupport}
            className="w-full text-sm text-primary font-medium py-2"
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* Similar alternatives suggestion */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Similar campsites available</p>
              <p className="text-xs text-gray-500">We found 5 alternatives nearby</p>
            </div>
            <button className="text-primary font-bold text-sm">
              View →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
