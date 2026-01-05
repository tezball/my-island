import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'
import bookingsApi from '../lib/api/bookings'

const cancellationReasons = [
  'Change of plans',
  'Found alternative accommodation',
  'Weather concerns',
  'Health reasons',
  'Work/schedule conflict',
  'Other',
]

interface BookingData {
  id: string
  campsiteName: string
  campsiteImage?: string
  checkIn: string
  checkOut: string
  totalPrice: number
}

export default function CancelConfirmPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()

  const [booking, setBooking] = useState<BookingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReason, setSelectedReason] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) return

      try {
        setIsLoading(true)
        const data = await bookingsApi.getById(bookingId)
        setBooking({
          id: data.id,
          campsiteName: data.campsite?.name || '',
          campsiteImage: data.campsite?.imageUrl || '',
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          totalPrice: data.totalPrice,
        })
      } catch (error) {
        console.error('Failed to fetch booking:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Cancel Booking" showNav={false}>
        <div className="flex-1 overflow-auto p-4">
          <Skeleton variant="rectangular" height={100} className="rounded-xl mb-4" />
          <Skeleton variant="rectangular" height={150} className="rounded-xl" />
        </div>
      </AppShell>
    )
  }

  if (!booking) {
    return (
      <AppShell showBack headerTitle="Cancel Booking">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Booking not found</p>
        </div>
      </AppShell>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  // Calculate refund (mock - would be based on cancellation policy)
  const refundAmount = booking.totalPrice * 0.8 // 80% refund for demo

  const handleCancel = async () => {
    if (!selectedReason || !bookingId) return

    setIsCancelling(true)
    try {
      await bookingsApi.cancel(bookingId, { reason: selectedReason })
      navigate(`/bookings/${bookingId}/cancelled`)
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <AppShell showBack headerTitle="Cancel Booking" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Warning Banner */}
        <div className="p-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Icon name="warning" size={24} className="text-red-600 shrink-0" />
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">
                  Are you sure you want to cancel?
                </p>
                <p className="text-sm text-red-600 dark:text-red-400/80 mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="p-4 pt-0">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              {booking.campsiteImage ? (
                <img
                  src={booking.campsiteImage}
                  alt={booking.campsiteName}
                  className="w-16 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <Icon name="camping" size={20} className="text-slate-400" />
                </div>
              )}
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{booking.campsiteName}</p>
                <p className="text-sm text-slate-500">
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Info */}
        <div className="p-4 pt-0">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Refund Details
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Original amount</span>
                <span className="text-slate-900 dark:text-white">€{booking.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Cancellation fee (20%)</span>
                <span className="text-red-600">-€{(booking.totalPrice * 0.2).toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <span className="font-semibold text-slate-900 dark:text-white">Refund amount</span>
                <span className="font-bold text-lg text-emerald-600">
                  €{refundAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Refund will be processed to your original payment method within 5-10 business days.
            </p>
          </div>
        </div>

        {/* Reason Selection */}
        <div className="p-4 pt-0">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Reason for Cancellation
          </h3>
          <div className="space-y-2">
            {cancellationReasons.map(reason => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-colors ${
                  selectedReason === reason
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className={selectedReason === reason ? 'text-primary font-medium' : 'text-slate-700 dark:text-slate-300'}>
                  {reason}
                </span>
                {selectedReason === reason && (
                  <Icon name="check_circle" size={20} className="text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        {selectedReason && (
          <div className="p-4 pt-0">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Additional Information (Optional)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Help us improve by sharing more details..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
            />
          </div>
        )}

        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            Keep Booking
          </Button>
          <Button
            variant="primary"
            className="flex-1 !bg-red-600 hover:!bg-red-700"
            onClick={handleCancel}
            disabled={!selectedReason}
            isLoading={isCancelling}
          >
            Cancel Booking
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
