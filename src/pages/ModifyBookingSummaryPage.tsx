import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, Button } from '@/components/ui'
import { apiFetch } from '@/utils/api'
import type { Booking } from '@/types'

export function ModifyBookingSummaryPage() {
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

  const handleConfirm = () => {
    // Would submit modification
    navigate(`/booking/${id}`)
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="progress_activity" className="animate-spin text-primary text-4xl" />
      </div>
    )
  }

  // Mock changes for display
  const originalTotal = booking.totalPrice
  const newTotal = originalTotal + 25 // Mock price difference
  const priceDiff = newTotal - originalTotal

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon name="arrow_back" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Review Changes</h2>
        <div className="w-10" />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-48 px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Campsite Card */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            <div
              className="h-32 bg-cover bg-center"
              style={{ backgroundImage: `url('${booking.campsiteImage}')` }}
            />
            <div className="p-4">
              <h3 className="font-bold">{booking.campsiteName}</h3>
              <p className="text-sm text-gray-500">{booking.campsiteLocation}</p>
            </div>
          </div>

          {/* Changes Summary */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 space-y-4">
            <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wide flex items-center gap-2">
              <Icon name="compare_arrows" className="text-primary" />
              Changes Summary
            </h3>

            {/* Dates Change */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                <Icon name="calendar_today" className="text-sm" />
                Dates
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Original</p>
                  <p className="text-sm font-medium line-through text-gray-400">
                    {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/30">
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">New</p>
                  <p className="text-sm font-bold">
                    Aug 14 - Aug 18
                  </p>
                </div>
              </div>
            </div>

            {/* Guests Change */}
            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                <Icon name="group" className="text-sm" />
                Guests
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Original</p>
                  <p className="text-sm font-medium text-gray-400">
                    {booking.guests?.adults || 2} Adults
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/30">
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">New</p>
                  <p className="text-sm font-bold">
                    3 Adults, 1 Child
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wide">
              Price Breakdown
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Original booking</span>
                <span className="line-through">€{originalTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">New total (4 nights)</span>
                <span className="font-medium">€{newTotal}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="font-bold">Amount to pay</span>
                <span className="font-bold text-primary">
                  {priceDiff >= 0 ? '+' : ''}€{priceDiff}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Icon name="credit_card" className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Visa •••• 4242</p>
                  <p className="text-xs text-gray-500">Payment method</p>
                </div>
              </div>
              <button className="text-primary text-sm font-medium">
                Change
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-gray-50 dark:bg-surface-dark rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Icon name="info" className="text-gray-400 text-xl mt-0.5" />
              <p className="text-xs text-gray-500">
                By confirming, you agree to the updated booking terms. The price difference will be charged to your payment method immediately.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 p-4 pb-8 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-gray-500">Amount to pay</span>
            <span className="text-xl font-bold text-primary">+€{priceDiff}</span>
          </div>
          <Button className="w-full h-14" size="lg" onClick={handleConfirm} rightIcon="check_circle">
            Confirm Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
