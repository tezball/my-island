import { Link, useParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function CancellationSuccessPage() {
  const { bookingId } = useParams<{ bookingId: string }>()

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
          <Icon name="check_circle" size={40} className="text-emerald-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Booking Cancelled
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">
          Your booking has been successfully cancelled.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          A confirmation email has been sent to your registered email address.
        </p>

        {/* Refund Info */}
        <div className="w-full max-w-xs p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl mb-8">
          <div className="flex items-center gap-3 justify-center mb-2">
            <Icon name="payments" size={24} className="text-emerald-600" />
            <span className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
              €112.00 Refund
            </span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400/80">
            Will be processed within 5-10 business days
          </p>
        </div>

        <div className="w-full max-w-xs space-y-3">
          <Link to="/">
            <Button className="w-full" leftIcon="explore">
              Explore Campsites
            </Button>
          </Link>

          <Link to="/bookings">
            <Button variant="secondary" className="w-full">
              View My Bookings
            </Button>
          </Link>
        </div>

        {/* Reference */}
        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-sm">
          <p className="text-xs text-slate-500 mb-1">Cancellation Reference</p>
          <p className="font-mono text-sm text-slate-700 dark:text-slate-300">
            CAN-{bookingId?.slice(-8).toUpperCase() || 'XXXXXXXX'}
          </p>
        </div>
      </div>
    </div>
  )
}
