import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Icon } from '@/components/ui'
import { TopAppBar, StickyFooter } from '@/components/layout'
import { PriceBreakdown } from '@/components/booking'
import { useBooking } from '@/context/BookingContext'

export function BookingSummaryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { booking, totalPrice, nights } = useBooking()
  const [selectedPayment, setSelectedPayment] = useState('card')

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-IE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const handlePay = () => {
    navigate(`/book/${id}/payment`)
  }

  if (!booking.campsite || !booking.lot) {
    return null
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
      <TopAppBar title="Booking Summary" />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Campsite Card */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-card">
          <img
            src={booking.campsite.imageUrl}
            alt={booking.campsite.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold text-slate-900 dark:text-white">
              {booking.campsite.name}
            </h3>
            <p className="text-sm text-slate-500">{booking.lot.name}</p>
            <p className="text-sm text-slate-500">{booking.campsite.location}</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Booking Details
          </h3>

          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="calendar_today" className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
              </p>
              <p className="text-xs text-slate-500">
                {nights} night{nights > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="group" className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {booking.guests.adults} adult{booking.guests.adults > 1 ? 's' : ''}
                {booking.guests.children > 0 &&
                  `, ${booking.guests.children} child${booking.guests.children > 1 ? 'ren' : ''}`}
              </p>
              <p className="text-xs text-slate-500">Guests</p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-4">
          <PriceBreakdown
            pricePerNight={booking.lot.pricePerNight}
            nights={nights}
            extras={booking.extras}
          />
        </div>

        {/* Payment Method */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Payment Method
          </h3>
          <div className="space-y-2">
            {[
              { id: 'card', label: 'Credit/Debit Card', icon: 'credit_card' },
              { id: 'apple', label: 'Apple Pay', icon: 'phone_iphone' },
              { id: 'google', label: 'Google Pay', icon: 'payments' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  selectedPayment === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Icon
                  name={method.icon}
                  className={
                    selectedPayment === method.id
                      ? 'text-primary'
                      : 'text-slate-400'
                  }
                />
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {method.label}
                </span>
                {selectedPayment === method.id && (
                  <Icon
                    name="check_circle"
                    filled
                    className="ml-auto text-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <StickyFooter>
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">Total</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              €{totalPrice}
            </span>
          </div>
          <Button className="flex-1" size="lg" onClick={handlePay}>
            Pay Now
          </Button>
        </div>
      </StickyFooter>
    </div>
  )
}
