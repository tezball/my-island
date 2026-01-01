import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { getBookingById, getCampsiteById } from '../data/mockData'

export default function ModifySummaryPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const { changes } = (location.state as { changes?: any }) || {}

  const booking = getBookingById(bookingId || '')
  const campsite = booking ? getCampsiteById(booking.campsiteId) : null

  const [isConfirming, setIsConfirming] = useState(false)

  if (!booking || !campsite) {
    return (
      <AppShell showBack headerTitle="Modify Summary">
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

  // Calculate price difference (mock)
  const originalPrice = booking.totalPrice
  const newPrice = originalPrice + 45 // Mock adjustment
  const priceDifference = newPrice - originalPrice

  const handleConfirm = async () => {
    setIsConfirming(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsConfirming(false)
    navigate(`/bookings/${bookingId}`)
  }

  return (
    <AppShell showBack headerTitle="Review Changes" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Booking Card */}
        <div className="p-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={campsite.images[0]}
                alt={campsite.name}
                className="w-16 h-12 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{campsite.name}</p>
                <p className="text-sm text-slate-500">Booking #{bookingId?.slice(-8).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Changes Summary */}
        <div className="p-4 pt-0">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Your Changes
          </h3>

          {/* Dates Change */}
          <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="event" size={20} className="text-primary" />
              <span className="font-medium text-slate-900 dark:text-white">Dates</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Original</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-through">
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </p>
              </div>
              <div>
                <p className="text-xs text-emerald-600 mb-1">New</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {formatDate(changes?.checkIn || booking.checkIn)} - {formatDate(changes?.checkOut || booking.checkOut)}
                </p>
              </div>
            </div>
          </div>

          {/* Guests Change */}
          <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="group" size={20} className="text-primary" />
              <span className="font-medium text-slate-900 dark:text-white">Guests</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Original</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-through">
                  {booking.guests} guests
                </p>
              </div>
              <div>
                <p className="text-xs text-emerald-600 mb-1">New</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {changes?.guests || booking.guests + 1} guests
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Adjustment */}
        <div className="p-4 pt-0">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Price Adjustment
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Original price</span>
                <span className="text-slate-900 dark:text-white">€{originalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  {priceDifference >= 0 ? 'Additional charge' : 'Refund'}
                </span>
                <span className={priceDifference >= 0 ? 'text-amber-600' : 'text-emerald-600'}>
                  {priceDifference >= 0 ? '+' : '-'}€{Math.abs(priceDifference).toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <span className="font-semibold text-slate-900 dark:text-white">New total</span>
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  €{newPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Note */}
        <div className="p-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Icon name="info" size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Modifications are subject to availability. Additional charges will be processed using your original payment method.
              </p>
            </div>
          </div>
        </div>

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
            Go Back
          </Button>
          <Button
            className="flex-1"
            onClick={handleConfirm}
            isLoading={isConfirming}
          >
            Confirm Changes
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
