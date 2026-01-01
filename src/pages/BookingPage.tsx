import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Badge from '../components/ui/Badge'
import { getCampsiteById, getLotsByCampsite } from '../data/mockData'
import type { Lot } from '../data/types'

interface BookingExtras {
  id: string
  name: string
  price: number
  icon: string
}

const availableExtras: BookingExtras[] = [
  { id: 'firewood', name: 'Firewood Bundle', price: 8, icon: 'local_fire_department' },
  { id: 'breakfast', name: 'Breakfast Basket', price: 15, icon: 'egg_alt' },
  { id: 'kayak', name: 'Kayak Rental', price: 25, icon: 'kayaking' },
  { id: 'bike', name: 'Bike Rental', price: 20, icon: 'pedal_bike' },
]

export default function BookingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const campsite = getCampsiteById(id || '')
  const lots = getLotsByCampsite(id || '')

  const [checkIn, setCheckIn] = useState('2025-01-20')
  const [checkOut, setCheckOut] = useState('2025-01-23')
  const [guests, setGuests] = useState(2)
  const [selectedLot, setSelectedLot] = useState<Lot | null>(lots[0] || null)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])

  if (!campsite) {
    return (
      <AppShell showBack headerTitle="Book" showNav={false}>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Campsite not found</p>
        </div>
      </AppShell>
    )
  }

  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  )

  const lotPrice = selectedLot ? selectedLot.pricePerNight * nights : 0
  const extrasPrice = selectedExtras.reduce((sum, extId) => {
    const extra = availableExtras.find((e) => e.id === extId)
    return sum + (extra?.price || 0)
  }, 0)
  const totalPrice = lotPrice + extrasPrice

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    )
  }

  const handleContinue = () => {
    navigate(`/book/${id}/payment`, {
      state: {
        checkIn,
        checkOut,
        guests,
        lotId: selectedLot?.id,
        extras: selectedExtras,
        totalPrice,
      },
    })
  }

  return (
    <AppShell showBack headerTitle="Book Your Stay" showNav={false} showNotifications={false}>
      <div className="flex-1 overflow-auto">
        {/* Campsite Preview */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex gap-3">
            <img
              src={campsite.images[0]}
              alt={campsite.name}
              className="size-20 rounded-xl object-cover"
            />
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                {campsite.name}
              </h2>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Icon name="location_on" size={14} />
                {campsite.location.county}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Icon name="star" size={14} className="text-amber-500" filled />
                <span className="text-sm font-medium">{campsite.rating}</span>
                <span className="text-sm text-slate-400">
                  ({campsite.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Dates */}
          <section>
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              Select Dates
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-500 mb-1 block">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 mb-1 block">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              {nights} night{nights !== 1 ? 's' : ''}
            </p>
          </section>

          {/* Guests */}
          <section>
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              Guests
            </h3>
            <div className="flex items-center justify-between bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <span className="text-slate-700 dark:text-slate-300">Number of guests</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Icon name="remove" size={20} />
                </button>
                <span className="w-8 text-center font-bold text-slate-900 dark:text-white">
                  {guests}
                </span>
                <button
                  onClick={() => setGuests(Math.min(10, guests + 1))}
                  className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Icon name="add" size={20} />
                </button>
              </div>
            </div>
          </section>

          {/* Pitch Selection */}
          <section>
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              Select Pitch
            </h3>
            <div className="space-y-3">
              {lots.map((lot) => (
                <button
                  key={lot.id}
                  onClick={() => lot.available && setSelectedLot(lot)}
                  disabled={!lot.available}
                  className={`w-full flex gap-3 p-3 rounded-xl border-2 text-left transition-colors ${
                    selectedLot?.id === lot.id
                      ? 'border-primary bg-primary/5'
                      : lot.available
                      ? 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                      : 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <img
                    src={lot.images[0]}
                    alt={lot.name}
                    className="size-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                        {lot.name}
                      </h4>
                      {selectedLot?.id === lot.id && (
                        <Icon name="check_circle" size={20} className="text-primary" filled />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 capitalize">
                      {lot.type} • Up to {lot.capacity} guests
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant={lot.available ? 'success' : 'error'} size="sm">
                        {lot.available ? 'Available' : 'Booked'}
                      </Badge>
                      <p className="text-primary font-bold">€{lot.pricePerNight}/night</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Extras */}
          <section>
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              Add Extras
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {availableExtras.map((extra) => (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${
                    selectedExtras.includes(extra.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Icon
                    name={extra.icon}
                    size={24}
                    className={selectedExtras.includes(extra.id) ? 'text-primary' : 'text-slate-400'}
                  />
                  <p className="font-medium text-slate-900 dark:text-white mt-2">
                    {extra.name}
                  </p>
                  <p className="text-sm text-primary font-bold">+€{extra.price}</p>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom spacing */}
        <div className="h-32" />
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              €{totalPrice}
            </p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>€{selectedLot?.pricePerNight || 0} x {nights} nights</p>
            {extrasPrice > 0 && <p>+ €{extrasPrice} extras</p>}
          </div>
        </div>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          rightIcon="arrow_forward"
          onClick={handleContinue}
          disabled={!selectedLot}
        >
          Continue to Payment
        </Button>
      </div>
    </AppShell>
  )
}
