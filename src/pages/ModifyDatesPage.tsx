import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Calendar from '../components/ui/Calendar'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'
import bookingsApi, { type BookingResponse } from '../lib/api/bookings'

interface BookingData {
  id: string
  lotId: string
  lotName: string
  campsiteName: string
  campsiteImage?: string
  checkIn: string
  checkOut: string
  guests: number
  pricePerNight: number
}

export default function ModifyDatesPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()

  const [booking, setBooking] = useState<BookingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [bookedDates, setBookedDates] = useState<string[]>([])

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) return

      try {
        setIsLoading(true)
        const data = await bookingsApi.getById(bookingId)
        setBooking({
          id: data.id,
          lotId: data.lotId,
          lotName: data.lotName,
          campsiteName: data.campsiteName,
          campsiteImage: data.campsiteImage,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          guests: data.guests,
          pricePerNight: data.pricePerNight,
        })
        setSelectedDates([data.checkIn, data.checkOut])

        // Generate available dates (next 90 days)
        const dates: string[] = []
        const today = new Date()
        for (let i = 0; i < 90; i++) {
          const date = new Date(today)
          date.setDate(today.getDate() + i)
          dates.push(date.toISOString().split('T')[0])
        }
        setAvailableDates(dates)
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
      <AppShell showBack headerTitle="Modify Dates">
        <div className="flex-1 overflow-auto p-4">
          <Skeleton variant="rectangular" height={80} className="rounded-xl mb-4" />
          <Skeleton variant="rectangular" height={300} className="rounded-xl" />
        </div>
      </AppShell>
    )
  }

  if (!booking) {
    return (
      <AppShell showBack headerTitle="Modify Dates">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Booking not found</p>
        </div>
      </AppShell>
    )
  }

  const originalNights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  )

  const newNights = selectedDates.length === 2
    ? Math.ceil(
        (new Date(selectedDates[1]).getTime() - new Date(selectedDates[0]).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0

  const originalPrice = originalNights * booking.pricePerNight
  const newPrice = newNights * booking.pricePerNight
  const priceDifference = newPrice - originalPrice

  const hasChanges =
    selectedDates[0] !== booking.checkIn ||
    selectedDates[1] !== booking.checkOut

  const handleReset = () => {
    setSelectedDates([booking.checkIn, booking.checkOut])
  }

  const handleUpdate = () => {
    // In real app, would call API to update booking
    navigate(`/bookings/${bookingId}`)
  }

  return (
    <AppShell
      showBack
      headerTitle="Modify Dates"
      showNav={false}
      headerRightAction={
        hasChanges ? (
          <button onClick={handleReset} className="text-primary font-medium text-sm">
            Reset
          </button>
        ) : null
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Current booking info */}
        <div className="p-4 bg-primary/10">
          <div className="flex items-center gap-3">
            {booking.campsiteImage ? (
              <img
                src={booking.campsiteImage}
                alt={booking.campsiteName}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <Icon name="camping" size={24} className="text-slate-400" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {booking.lotName}
              </h3>
              <p className="text-sm text-slate-500">
                {booking.campsiteName} • {booking.guests} guests
              </p>
            </div>
          </div>
        </div>

        {/* Date selection cards */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="calendar_month" size={18} className="text-primary" />
              <span className="text-xs text-slate-500">Check-in</span>
            </div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {selectedDates[0]
                ? new Date(selectedDates[0]).toLocaleDateString('en-IE', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Select date'
              }
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="calendar_month" size={18} className="text-primary" />
              <span className="text-xs text-slate-500">Check-out</span>
            </div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {selectedDates[1]
                ? new Date(selectedDates[1]).toLocaleDateString('en-IE', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Select date'
              }
            </p>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-4">
          <Calendar
            selectedDates={selectedDates}
            availableDates={availableDates}
            bookedDates={bookedDates}
            initialMonth={new Date(booking.checkIn)}
            onDateSelect={(date) => {
              if (selectedDates.length === 0 || selectedDates.length === 2) {
                setSelectedDates([date])
              } else {
                const start = selectedDates[0] < date ? selectedDates[0] : date
                const end = selectedDates[0] < date ? date : selectedDates[0]
                setSelectedDates([start, end])
              }
            }}
            onRangeSelect={(start, end) => setSelectedDates([start, end])}
            rangeMode
          />
        </div>

        {/* Price adjustment banner */}
        {hasChanges && newNights > 0 && (
          <div className={`mx-4 p-4 rounded-xl ${
            priceDifference > 0
              ? 'bg-amber-50 dark:bg-amber-900/20'
              : priceDifference < 0
              ? 'bg-emerald-50 dark:bg-emerald-900/20'
              : 'bg-slate-50 dark:bg-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  name={priceDifference > 0 ? 'arrow_upward' : priceDifference < 0 ? 'arrow_downward' : 'check'}
                  size={20}
                  className={
                    priceDifference > 0
                      ? 'text-amber-600'
                      : priceDifference < 0
                      ? 'text-emerald-600'
                      : 'text-slate-600'
                  }
                />
                <span className="font-medium text-slate-900 dark:text-white">
                  Price Adjustment
                </span>
              </div>
              <span className={`font-bold ${
                priceDifference > 0
                  ? 'text-amber-600'
                  : priceDifference < 0
                  ? 'text-emerald-600'
                  : 'text-slate-600'
              }`}>
                {priceDifference > 0 ? '+' : ''}€{priceDifference.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              New total: €{newPrice.toFixed(2)} ({newNights} nights)
            </p>
          </div>
        )}

        <div className="h-32" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button
          className="w-full"
          size="lg"
          disabled={!hasChanges || selectedDates.length !== 2}
          onClick={handleUpdate}
          leftIcon="check"
        >
          Update Booking
        </Button>
      </div>
    </AppShell>
  )
}
