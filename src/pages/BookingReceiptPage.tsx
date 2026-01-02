import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'
import bookingsApi from '../lib/api/bookings'
import { campsitesApi } from '../lib/api/campsites'

interface BookingData {
  id: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  campsiteId: string
  campsiteName: string
  campsiteImage?: string
  campsiteAddress?: string
}

export default function BookingReceiptPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) return

      try {
        setIsLoading(true)
        const bookingData = await bookingsApi.getById(bookingId)

        // If booking doesn't have campsite address, fetch it
        let campsiteAddress = ''
        if (!bookingData.campsiteLocation) {
          try {
            const campsiteData = await campsitesApi.getById(bookingData.campsiteId)
            campsiteAddress = campsiteData.location.address
          } catch {
            // Use location from booking if available
            campsiteAddress = bookingData.campsiteLocation || ''
          }
        }

        setBooking({
          id: bookingData.id,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          totalPrice: bookingData.totalPrice,
          campsiteId: bookingData.campsiteId,
          campsiteName: bookingData.campsiteName,
          campsiteImage: bookingData.campsiteImage,
          campsiteAddress: campsiteAddress || bookingData.campsiteLocation,
        })
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
      <AppShell showBack headerTitle="Receipt">
        <div className="flex-1 overflow-auto p-4">
          <Skeleton variant="rectangular" height={400} className="rounded-2xl" />
        </div>
      </AppShell>
    )
  }

  if (error || !booking) {
    return (
      <AppShell showBack headerTitle="Receipt">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">{error || 'Booking not found'}</p>
        </div>
      </AppShell>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const calculateNights = () => {
    const start = new Date(booking.checkIn)
    const end = new Date(booking.checkOut)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const pricePerNight = booking.totalPrice / nights

  const handleDownload = () => {
    // In real app, would generate PDF
    alert('Receipt download would start here')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Booking Receipt',
        text: `My Island Booking - ${booking.campsiteName}`,
      })
    }
  }

  return (
    <AppShell
      showBack
      headerTitle="Receipt"
      showNav={false}
      headerRightAction={
        <button onClick={handleShare}>
          <Icon name="share" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Receipt Card */}
        <div className="p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-primary text-white text-center">
              <Icon name="receipt_long" size={40} className="mx-auto mb-2" />
              <h2 className="text-xl font-bold">Booking Receipt</h2>
              <p className="text-primary-light/80 text-sm">Thank you for your booking</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Booking Reference */}
              <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Booking Reference
                </p>
                <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                  #{bookingId?.slice(-8).toUpperCase()}
                </p>
              </div>

              {/* Campsite Info */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Accommodation
                </p>
                <div className="flex items-center gap-3">
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
                    <p className="font-medium text-slate-900 dark:text-white">
                      {booking.campsiteName}
                    </p>
                    <p className="text-sm text-slate-500">{booking.campsiteAddress}</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Check-in
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {formatDate(booking.checkIn)}
                  </p>
                  <p className="text-sm text-slate-500">After 2:00 PM</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Check-out
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {formatDate(booking.checkOut)}
                  </p>
                  <p className="text-sm text-slate-500">Before 11:00 AM</p>
                </div>
              </div>

              {/* Guests */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Guests
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">
                  Price Breakdown
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      €{pricePerNight.toFixed(2)} × {nights} night{nights !== 1 ? 's' : ''}
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      €{booking.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Service fee</span>
                    <span className="text-slate-900 dark:text-white">€0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">VAT (23%)</span>
                    <span className="text-slate-900 dark:text-white">Included</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">Total Paid</span>
                    <span className="font-bold text-lg text-primary">
                      €{booking.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Payment Method
                </p>
                <div className="flex items-center gap-2">
                  <Icon name="credit_card" size={20} className="text-slate-400" />
                  <span className="text-slate-900 dark:text-white">•••• 4242</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">
                My Island Camping Ltd • VAT: IE1234567X
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Generated on {new Date().toLocaleDateString('en-IE')}
              </p>
            </div>
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button
          className="w-full"
          leftIcon="download"
          onClick={handleDownload}
        >
          Download PDF
        </Button>
      </div>
    </AppShell>
  )
}
