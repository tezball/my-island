import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import GuestCounter from '../components/ui/GuestCounter'
import Toggle from '../components/ui/Toggle'
import Icon from '../components/ui/Icon'
import { getBookingById, getCampsiteById, getLotById } from '../data/mockData'

interface Extra {
  id: string
  name: string
  price: number
  quantity: number
  isToggle?: boolean
}

const availableExtras: Extra[] = [
  { id: 'tent-setup', name: 'Large Tent Setup', price: 15, quantity: 0, isToggle: true },
  { id: 'extra-vehicle', name: 'Extra Vehicle', price: 10, quantity: 0 },
  { id: 'pet-fee', name: 'Pet Fee', price: 5, quantity: 0, isToggle: true },
  { id: 'firewood', name: 'Firewood Bundle', price: 8, quantity: 0 },
]

export default function ModifyGuestsPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()

  const booking = getBookingById(bookingId || '')
  const campsite = booking ? getCampsiteById(booking.campsiteId) : null
  const lot = booking ? getLotById(booking.lotId) : null

  const [adults, setAdults] = useState(booking?.guests || 2)
  const [children, setChildren] = useState(0)
  const [extras, setExtras] = useState<Extra[]>(() => {
    // Merge with booking extras
    return availableExtras.map(extra => {
      const bookingExtra = booking?.extras.find(e => e.id === extra.id)
      return bookingExtra ? { ...extra, quantity: bookingExtra.quantity } : extra
    })
  })

  if (!booking || !campsite || !lot) {
    return (
      <AppShell showBack headerTitle="Modify Booking">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Booking not found</p>
        </div>
      </AppShell>
    )
  }

  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  )

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const updateExtra = (id: string, quantity: number) => {
    setExtras(prev => prev.map(e => e.id === id ? { ...e, quantity } : e))
  }

  const toggleExtra = (id: string) => {
    setExtras(prev => prev.map(e => e.id === id ? { ...e, quantity: e.quantity > 0 ? 0 : 1 } : e))
  }

  const totalGuests = adults + children
  const hasGuestChange = totalGuests !== booking.guests

  const originalExtrasTotal = booking.extras.reduce((sum, e) => sum + e.price * e.quantity, 0)
  const newExtrasTotal = extras.reduce((sum, e) => sum + e.price * e.quantity * nights, 0)
  const extrasChange = newExtrasTotal - originalExtrasTotal

  const basePrice = lot.pricePerNight * nights
  const totalPrice = basePrice + newExtrasTotal

  const hasChanges = hasGuestChange || extrasChange !== 0

  const handleConfirm = () => {
    // In real app, would call API to update booking
    navigate(`/bookings/${bookingId}`)
  }

  const handleReset = () => {
    setAdults(booking.guests)
    setChildren(0)
    setExtras(availableExtras.map(extra => {
      const bookingExtra = booking.extras.find(e => e.id === extra.id)
      return bookingExtra ? { ...extra, quantity: bookingExtra.quantity } : extra
    }))
  }

  return (
    <AppShell
      showBack
      headerTitle="Modify Booking"
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
        {/* Booking info */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <img
              src={campsite.images[0]}
              alt={campsite.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div>
              <p className="text-xs text-slate-500 mb-1">{lot.name}</p>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {campsite.name}
              </h3>
              <p className="text-sm text-slate-500">
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {nights} nights • Flexible cancellation
              </p>
            </div>
          </div>
        </div>

        {/* Guest Details */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Guest Details
          </h3>
          <GuestCounter
            label="Adults"
            description="Age 13+"
            value={adults}
            onChange={setAdults}
            min={1}
            max={lot.capacity}
          />
          <GuestCounter
            label="Children"
            description="Age 2-12"
            value={children}
            onChange={setChildren}
            min={0}
            max={Math.max(0, lot.capacity - adults)}
          />
          {totalGuests >= lot.capacity && (
            <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
              <Icon name="info" size={16} />
              Maximum capacity reached
            </p>
          )}
        </div>

        {/* Extras & Add-ons */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Extras & Add-ons
          </h3>
          <div className="space-y-4">
            {extras.map(extra => (
              <div key={extra.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {extra.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    €{extra.price}/night
                  </p>
                </div>
                {extra.isToggle ? (
                  <Toggle
                    checked={extra.quantity > 0}
                    onChange={() => toggleExtra(extra.id)}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateExtra(extra.id, Math.max(0, extra.quantity - 1))}
                      disabled={extra.quantity === 0}
                      className={`size-8 rounded-full border flex items-center justify-center ${
                        extra.quantity === 0
                          ? 'border-slate-200 text-slate-300'
                          : 'border-slate-300 text-slate-600 hover:border-primary hover:text-primary'
                      }`}
                    >
                      <Icon name="remove" size={16} />
                    </button>
                    <span className="w-6 text-center font-medium">
                      {extra.quantity}
                    </span>
                    <button
                      onClick={() => updateExtra(extra.id, extra.quantity + 1)}
                      className="size-8 rounded-full border border-slate-300 text-slate-600 hover:border-primary hover:text-primary flex items-center justify-center"
                    >
                      <Icon name="add" size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Price summary */}
        <div className="p-4 mx-4 mb-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500">Accommodation</span>
            <span className="font-medium text-slate-900 dark:text-white">
              €{basePrice.toFixed(2)}
            </span>
          </div>
          {newExtrasTotal > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500">Extras</span>
              <span className="font-medium text-slate-900 dark:text-white">
                €{newExtrasTotal.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-900 dark:text-white">Total</span>
            <span className="font-bold text-lg text-slate-900 dark:text-white">
              €{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="h-32" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button
          className="w-full"
          size="lg"
          disabled={!hasChanges}
          onClick={handleConfirm}
          leftIcon="check"
        >
          Confirm Changes
        </Button>
      </div>
    </AppShell>
  )
}
