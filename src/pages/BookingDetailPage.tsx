import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { bookings, getCampsiteById } from '../data/mockData'
import type { Booking } from '../data/types'

const statusLabels: Record<Booking['status'], string> = {
  pending: 'Pending Confirmation',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()

  const booking = bookings.find((b) => b.id === bookingId)
  const campsite = booking ? getCampsiteById(booking.campsiteId) : null

  if (!booking || !campsite) {
    return (
      <AppShell showBack headerTitle="Booking">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Booking not found</p>
        </div>
      </AppShell>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const isUpcoming = booking.status === 'pending' || booking.status === 'confirmed'

  return (
    <AppShell showBack headerTitle="Booking Details" showNotifications={false}>
      <div className="flex-1 overflow-auto">
        {/* Status Banner */}
        <div className={`px-4 py-3 flex items-center gap-3 ${
          booking.status === 'confirmed' || booking.status === 'checked_in'
            ? 'bg-emerald-50 dark:bg-emerald-900/20'
            : booking.status === 'pending'
            ? 'bg-amber-50 dark:bg-amber-900/20'
            : 'bg-slate-50 dark:bg-slate-800'
        }`}>
          <Icon
            name={booking.status === 'confirmed' ? 'check_circle' : 'schedule'}
            size={24}
            className={
              booking.status === 'confirmed' || booking.status === 'checked_in'
                ? 'text-emerald-600'
                : booking.status === 'pending'
                ? 'text-amber-600'
                : 'text-slate-600'
            }
            filled
          />
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {statusLabels[booking.status]}
            </p>
            <p className="text-sm text-slate-500">
              Booking #{booking.id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Campsite Card */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <img
              src={campsite.images[0]}
              alt={campsite.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                {campsite.name}
              </h2>
              <p className="text-slate-500 flex items-center gap-1 mt-1">
                <Icon name="location_on" size={16} />
                {campsite.location.address}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                leftIcon="directions"
                onClick={() => {
                  const address = encodeURIComponent(campsite.location.address)
                  window.open(`https://maps.google.com/?q=${address}`, '_blank')
                }}
              >
                Get Directions
              </Button>
            </div>
          </div>

          {/* Dates & Guests */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Trip Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Check-in</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {formatDate(booking.checkIn)}
                </p>
                <p className="text-sm text-slate-500">From 2:00 PM</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Check-out</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {formatDate(booking.checkOut)}
                </p>
                <p className="text-sm text-slate-500">By 11:00 AM</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm text-slate-500">Guests</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Extras */}
          {booking.extras.length > 0 && (
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                Extras
              </h3>
              <div className="space-y-2">
                {booking.extras.map((extra) => (
                  <div key={extra.id} className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      {extra.name} x{extra.quantity}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      €{extra.price * extra.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              Payment
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500">Method</span>
              <div className="flex items-center gap-2">
                <Icon name="credit_card" size={18} className="text-slate-400" />
                <span className="text-slate-900 dark:text-white">
                  {booking.paymentMethod?.brand} ****{booking.paymentMethod?.last4}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white">Total Paid</span>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                €{booking.totalPrice}
              </span>
            </div>
          </div>

          {/* Actions */}
          {isUpcoming && (
            <div className="space-y-3">
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                leftIcon="edit_calendar"
                onClick={() => navigate(`/bookings/${booking.id}/modify-dates`)}
              >
                Modify Booking
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full text-red-500"
                leftIcon="cancel"
                onClick={() => navigate(`/bookings/${booking.id}/cancel`)}
              >
                Cancel Booking
              </Button>
            </div>
          )}

          {booking.status === 'completed' && (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              leftIcon="rate_review"
              onClick={() => navigate(`/campsite/${campsite.id}/review`)}
            >
              Write a Review
            </Button>
          )}

          {/* Contact Host */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Need help?</p>
              <p className="text-sm text-slate-500">Contact the host</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon="chat"
              onClick={() => navigate(`/bookings/${booking.id}/contact-host`)}
            >
              Message
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
