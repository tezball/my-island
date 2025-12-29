import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { Booking } from '@/types'
import { Button, Icon } from '@/components/ui'
import { apiFetch } from '@/utils/api'

export function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/bookings/${id}`)
      return res.json()
    },
  })

  const booking: Booking | undefined = data?.booking

  if (isLoading || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="progress_activity" className="animate-spin text-primary text-4xl" />
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check_circle" filled size="xl" className="text-primary text-5xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-slate-500">
            Your adventure awaits. See you there!
          </p>
        </div>

        {/* Booking Reference */}
        <div className="bg-primary/10 rounded-2xl p-4 text-center mb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Booking Reference
          </p>
          <p className="text-2xl font-bold text-primary">#{booking.reference}</p>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-card mb-6">
          <img
            src={booking.campsite.imageUrl}
            alt={booking.campsite.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {booking.campsite.name}
              </h3>
              <p className="text-sm text-slate-500">{booking.lot.name}</p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Icon name="calendar_today" className="text-primary" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </p>
                <p className="text-xs text-slate-500">
                  {booking.nights} night{booking.nights > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Icon name="group" className="text-primary" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {booking.guests.adults} adult{booking.guests.adults > 1 ? 's' : ''}
                  {booking.guests.children > 0 &&
                    `, ${booking.guests.children} child${booking.guests.children > 1 ? 'ren' : ''}`}
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white">Total Paid</span>
              <span className="font-bold text-xl text-primary">€{booking.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link to="/bookings">
            <Button className="w-full" size="lg">
              View My Bookings
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" className="w-full" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
