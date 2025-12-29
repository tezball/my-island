import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, Button } from '@/components/ui'
import { DateRangePicker } from '@/components/booking'
import { apiFetch } from '@/utils/api'
import type { Booking } from '@/types'

export function ModifyBookingDatesPage() {
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

  const [checkIn, setCheckIn] = useState<string | null>(booking?.checkIn || null)
  const [checkOut, setCheckOut] = useState<string | null>(booking?.checkOut || null)

  const handleDateSelect = (start: string | null, end: string | null) => {
    setCheckIn(start)
    setCheckOut(end)
  }

  const handleReset = () => {
    setCheckIn(booking?.checkIn || null)
    setCheckOut(booking?.checkOut || null)
  }

  const handleContinue = () => {
    navigate(`/booking/${id}/modify/guests`)
  }

  // Calculate nights and price difference
  const originalNights = useMemo(() => {
    if (!booking?.checkIn || !booking?.checkOut) return 0
    const start = new Date(booking.checkIn)
    const end = new Date(booking.checkOut)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }, [booking])

  const newNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }, [checkIn, checkOut])

  const pricePerNight = booking?.pricePerNight || 45
  const originalTotal = originalNights * pricePerNight
  const newTotal = newNights * pricePerNight
  const priceDiff = newTotal - originalTotal

  const hasChanges = checkIn !== booking?.checkIn || checkOut !== booking?.checkOut

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="progress_activity" className="animate-spin text-primary text-4xl" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon name="close" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Modify Dates</h2>
        <button onClick={handleReset} className="px-2">
          <span className="text-primary font-bold">Reset</span>
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-48">
        {/* Current Booking Summary */}
        <div className="px-4 py-6">
          <div className="flex items-stretch justify-between gap-4 rounded-2xl bg-white dark:bg-surface-dark p-3 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col justify-center gap-1 flex-[2_2_0px] pl-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary w-fit">
                <Icon name="camping" className="text-sm" />
                Current
              </span>
              <p className="text-base font-bold leading-tight mt-1">{booking.campsiteName}</p>
              <p className="text-gray-500 text-sm font-medium">
                {booking.lotName || 'Spot'} • {booking.guests?.adults || 2} Guests
              </p>
            </div>
            <div
              className="w-24 h-24 bg-cover bg-center rounded-xl flex-shrink-0"
              style={{ backgroundImage: `url('${booking.campsiteImage}')` }}
            />
          </div>
        </div>

        {/* Date Inputs Display */}
        <div className="flex items-center gap-3 px-4 pb-4">
          <div className="flex flex-col flex-1 gap-2">
            <label className="text-sm font-semibold text-gray-500 ml-1">Check-in</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="calendar_today" className="text-primary" />
              </div>
              <input
                className="block w-full rounded-xl border-0 bg-white dark:bg-surface-dark py-3 pl-10 pr-3 shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700 text-sm font-bold text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                readOnly
                value={checkIn ? new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select'}
              />
            </div>
          </div>
          <div className="flex h-full items-end pb-3 text-gray-300 dark:text-gray-600">
            <Icon name="arrow_forward" />
          </div>
          <div className="flex flex-col flex-1 gap-2">
            <label className="text-sm font-semibold text-gray-500 ml-1">Check-out</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="calendar_month" className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <input
                className="block w-full rounded-xl border-0 bg-white dark:bg-surface-dark py-3 pl-10 pr-3 shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700 text-sm font-bold text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                readOnly
                value={checkOut ? new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select'}
              />
            </div>
          </div>
        </div>

        {/* Calendar Picker */}
        <div className="px-4 pb-4">
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            unavailableDates={[]}
            onSelect={handleDateSelect}
          />
        </div>

        {/* Legend */}
        <div className="px-6 flex gap-4 text-xs font-medium text-gray-500 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-600" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-200 relative">
              <div className="absolute top-1/2 w-full h-px bg-gray-400" />
            </div>
            <span>Unavailable</span>
          </div>
        </div>
      </main>

      {/* Bottom Action Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 p-4 pb-8 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex flex-col gap-4">
          {/* Price Difference */}
          {hasChanges && newNights > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-full">
                  <Icon name="payments" className="text-primary text-xl" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Price Adjustment
                  </span>
                  <span className="text-sm font-bold">
                    {priceDiff >= 0 ? '+' : ''}€{priceDiff.toFixed(2)}{' '}
                    <span className="font-normal text-gray-500">
                      (New Total: €{newTotal.toFixed(2)})
                    </span>
                  </span>
                </div>
              </div>
              <Icon name="info" className="text-gray-400 cursor-pointer" />
            </div>
          )}

          {/* Primary Action Button */}
          <Button
            className="w-full h-14"
            size="lg"
            disabled={!hasChanges || newNights === 0}
            onClick={handleContinue}
            rightIcon="arrow_forward"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
