import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import Icon from '../ui/Icon'

interface BookingExpiredStateProps {
  campsiteId?: string
  title?: string
  message?: string
}

/**
 * Displayed when a user navigates to a booking page but the booking context is missing.
 * This can happen when:
 * - User refreshes the page and session storage is cleared
 * - User navigates directly to a booking URL
 * - Booking data has expired
 */
export default function BookingExpiredState({
  campsiteId,
  title = 'Booking session expired',
  message = 'Your booking session has expired or the page was refreshed. Please start a new booking.',
}: BookingExpiredStateProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="size-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto flex items-center justify-center mb-6">
          <Icon name="event_busy" size={40} className="text-amber-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h1>

        {/* Message */}
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {campsiteId ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate(`/campsite/${campsiteId}`)}
            >
              Back to Campsite
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/search')}
            >
              Browse Campsites
            </Button>
          )}
          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </div>

        {/* Help text */}
        <p className="text-xs text-slate-400 mt-8">
          If you believe this is an error, please{' '}
          <a href="/support/contact" className="text-primary hover:underline">
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  )
}
