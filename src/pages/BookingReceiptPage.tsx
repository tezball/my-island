import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, Button } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { apiFetch } from '@/utils/api'
import type { Booking } from '@/types'

// Mock M26: Booking Receipt Page
export function BookingReceiptPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/bookings/${id}`)
      return res.json()
    },
  })

  const booking: Booking | undefined = data?.booking

  const handleDownload = () => {
    // Would generate and download PDF
  }

  const handleEmail = () => {
    // Would send receipt via email
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="progress_activity" className="animate-spin text-primary text-4xl" />
      </div>
    )
  }

  // Mock receipt data
  const receiptNumber = `RCP-${booking.id.slice(0, 8).toUpperCase()}`
  const transactionDate = new Date(booking.checkIn).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const nights = 3 // Mock
  const accommodationCost = booking.totalPrice - 15
  const serviceFee = 15
  const taxes = Math.round(booking.totalPrice * 0.1)

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        showHome
        title="Receipt"
        rightAction={
          <button
            onClick={handleDownload}
            className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center"
          >
            <Icon name="download" />
          </button>
        }
      />

      <div className="flex-1 px-4 py-6 max-w-md mx-auto">
        {/* Receipt Card */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-card">
          {/* Header */}
          <div className="bg-primary/10 p-6 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="receipt_long" className="text-3xl text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-1">Payment Receipt</h2>
            <p className="text-sm text-gray-500">{receiptNumber}</p>
          </div>

          {/* Transaction Details */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Transaction Date</span>
              <span className="font-medium">{transactionDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium">Visa •••• 4242</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Booking Details
            </h3>
            <div className="flex gap-3 mb-3">
              <div
                className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: `url('${booking.campsiteImage}')` }}
              />
              <div>
                <p className="font-bold text-sm">{booking.campsiteName}</p>
                <p className="text-xs text-gray-500">{booking.campsiteLocation}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>{nights} nights • {booking.guests?.adults || 2} guests</p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Price Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Accommodation ({nights} nights × €{Math.round(accommodationCost / nights)})</span>
                <span>€{accommodationCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service fee</span>
                <span>€{serviceFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taxes</span>
                <span>€{taxes}</span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Paid</span>
              <span className="text-2xl font-bold text-primary">
                €{booking.totalPrice + taxes}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 text-center">
            <p className="text-xs text-gray-400">
              Thank you for booking with my-island!
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Confirmation #{booking.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <Button className="w-full" onClick={handleDownload}>
            <Icon name="download" className="mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="w-full" onClick={handleEmail}>
            <Icon name="email" className="mr-2" />
            Email Receipt
          </Button>
        </div>

        {/* Help */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-surface-dark rounded-xl">
          <div className="flex items-start gap-3">
            <Icon name="help_outline" className="text-gray-400 text-xl mt-0.5" />
            <div>
              <p className="text-sm font-medium">Need help with billing?</p>
              <p className="text-xs text-gray-500 mt-1">
                Contact our support team for any billing inquiries or disputes.
              </p>
              <button className="text-primary text-sm font-medium mt-2">
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
