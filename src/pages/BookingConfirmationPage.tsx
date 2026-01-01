import { useParams, useNavigate, useLocation } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { getCampsiteById } from '../data/mockData'

export default function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const bookingState = location.state as {
    checkIn: string
    checkOut: string
    guests: number
    totalPrice: number
    bookingId: string
  }

  const campsite = getCampsiteById(id || '')

  if (!campsite || !bookingState) {
    return (
      <AppShell showNav={false} showHeader={false}>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Booking not found</p>
        </div>
      </AppShell>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <AppShell showNav={false} showHeader={false}>
      <div className="flex-1 flex flex-col px-6 py-12">
        {/* Success Animation */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
            <Icon name="check_circle" size={56} className="text-primary" filled />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Your adventure awaits
          </p>

          {/* Booking Card */}
          <div className="w-full bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
            <img
              src={campsite.images[0]}
              alt={campsite.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    {campsite.name}
                  </h2>
                  <p className="text-sm text-slate-500">{campsite.location.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Confirmation #</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                    {bookingState.bookingId.slice(-8)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Check-in</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {formatDate(bookingState.checkIn)}
                  </p>
                  <p className="text-sm text-slate-500">From 2:00 PM</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Check-out</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {formatDate(bookingState.checkOut)}
                  </p>
                  <p className="text-sm text-slate-500">By 11:00 AM</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Icon name="group" size={18} className="text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">
                    {bookingState.guests} guest{bookingState.guests !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="font-bold text-lg text-slate-900 dark:text-white">
                  €{bookingState.totalPrice}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="w-full grid grid-cols-3 gap-3 mt-6">
            <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Icon name="calendar_add_on" size={24} className="text-primary" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Add to Calendar</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Icon name="share" size={24} className="text-primary" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Share</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Icon name="directions" size={24} className="text-primary" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Directions</span>
            </button>
          </div>

          {/* Email Confirmation */}
          <div className="flex items-center gap-2 mt-6 text-sm text-slate-500">
            <Icon name="mail" size={16} />
            <span>Confirmation sent to your email</span>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="space-y-3 mt-6">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/bookings')}
          >
            View My Bookings
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
