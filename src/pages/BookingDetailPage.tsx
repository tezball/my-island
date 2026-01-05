import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'
import bookingsApi from '../lib/api/bookings'
import type { BookingResponse } from '../lib/api/bookings'

const statusLabels: Record<string, string> = {
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

// Normalize API status (uppercase) to display status (lowercase)
const normalizeStatus = (status: string): string => {
  return status.toLowerCase().replace('_', '_')
}

export default function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [booking, setBooking] = useState<BookingResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) return

      try {
        setIsLoading(true)
        const data = await bookingsApi.getById(bookingId)
        setBooking(data)
      } catch (err) {
        console.error('Failed to fetch booking:', err)
        setError('Booking not found')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Booking Details" showNotifications={false}>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <Skeleton variant="rectangular" height={50} className="rounded-xl" />
          <Skeleton variant="rectangular" height={200} className="rounded-xl" />
          <Skeleton variant="rectangular" height={150} className="rounded-xl" />
          <Skeleton variant="rectangular" height={100} className="rounded-xl" />
        </div>
      </AppShell>
    )
  }

  if (error || !booking) {
    return (
      <AppShell showBack headerTitle="Booking">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">{error || 'Booking not found'}</p>
        </div>
      </AppShell>
    )
  }

  const status = normalizeStatus(booking.status)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const isUpcoming = status === 'confirmed' || status === 'checked_in'

  return (
    <AppShell showBack headerTitle="Booking Details" showNotifications={false}>
      <div className="flex-1 overflow-auto">
        {/* Status Banner */}
        <div className={`px-4 py-3 flex items-center gap-3 ${
          isUpcoming
            ? 'bg-emerald-50 dark:bg-emerald-900/20'
            : 'bg-slate-50 dark:bg-slate-800'
        }`}>
          <Icon
            name={isUpcoming ? 'check_circle' : 'schedule'}
            size={24}
            className={isUpcoming ? 'text-emerald-600' : 'text-slate-600'}
            filled
          />
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {statusLabels[status] || status}
            </p>
            <p className="text-sm text-slate-500">
              Booking #{booking.id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Campsite Card */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
            {booking.campsite?.imageUrl ? (
              <img
                src={booking.campsite.imageUrl}
                alt={booking.campsite?.name}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <Icon name="camping" size={48} className="text-slate-400" />
              </div>
            )}
            <div className="p-4">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                {booking.campsite?.name}
              </h2>
              {booking.campsite?.county && (
                <p className="text-slate-500 flex items-center gap-1 mt-1">
                  <Icon name="location_on" size={16} />
                  {booking.campsite.county}
                </p>
              )}
              <p className="text-sm text-slate-500 mt-1">
                {booking.lot?.name}
              </p>
              {booking.campsite?.county && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  leftIcon="directions"
                  onClick={() => {
                    const address = encodeURIComponent(booking.campsite?.county || '')
                    window.open(`https://maps.google.com/?q=${address}`, '_blank')
                  }}
                >
                  Get Directions
                </Button>
              )}
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
          {booking.extras && booking.extras.length > 0 && (
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                Extras
              </h3>
              <div className="space-y-2">
                {booking.extras.map((extra) => (
                  <div key={extra.extraId} className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      {extra.name} {extra.quantity > 1 ? `(x${extra.quantity})` : ''}
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      €{extra.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              Payment Summary
            </h3>
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">
                  €{(booking.lotPrice / booking.nights).toFixed(2)} × {booking.nights} night{booking.nights !== 1 ? 's' : ''}
                </span>
                <span className="text-slate-900 dark:text-white">
                  €{booking.lotPrice.toFixed(2)}
                </span>
              </div>
              {booking.extrasPrice > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Extras</span>
                  <span className="text-slate-900 dark:text-white">€{booking.extrasPrice.toFixed(2)}</span>
                </div>
              )}
              {booking.serviceFee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Service fee</span>
                  <span className="text-slate-900 dark:text-white">€{booking.serviceFee.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white">Total Paid</span>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                €{booking.totalPrice.toFixed(2)}
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

          {status === 'completed' && (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              leftIcon="rate_review"
              onClick={() => navigate(`/campsite/${booking.campsite?.id}/review`)}
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
