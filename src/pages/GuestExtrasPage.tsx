import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import GuestCounter from '../components/ui/GuestCounter'
import Icon from '../components/ui/Icon'
import BookingExpiredState from '../components/booking/BookingExpiredState'
import { getCampsiteById, extras } from '../data/mockData'

export default function GuestExtrasPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const { checkIn, checkOut } = (location.state as { checkIn?: string; checkOut?: string }) || {}

  const campsite = getCampsiteById(id || '')

  // If dates are missing, show expired state
  if (!checkIn || !checkOut) {
    return (
      <BookingExpiredState
        campsiteId={id}
        title="Booking dates missing"
        message="Please select your check-in and check-out dates to continue."
      />
    )
  }

  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [pets, setPets] = useState(0)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(e => e !== extraId)
        : [...prev, extraId]
    )
  }

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const pricePerNight = campsite?.pricePerNight || 0
  const basePrice = nights * pricePerNight

  const extrasTotal = selectedExtras.reduce((sum, extraId) => {
    const extra = extras.find(e => e.id === extraId)
    return sum + (extra?.price || 0)
  }, 0)

  const totalPrice = basePrice + extrasTotal

  if (!campsite) {
    return (
      <AppShell showBack headerTitle="Guests & Extras">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Campsite not found</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell showBack headerTitle="Guests & Extras" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Booking summary */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={campsite.images[0]}
              alt={campsite.name}
              className="w-16 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{campsite.name}</p>
              <p className="text-sm text-slate-500">
                {checkIn && checkOut ? (
                  <>
                    {new Date(checkIn).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })} -{' '}
                    {new Date(checkOut).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })} ({nights} nights)
                  </>
                ) : (
                  'Dates not selected'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Who's Coming?
          </h3>
          <div className="space-y-4">
            <GuestCounter
              label="Adults"
              description="Ages 13 or above"
              value={adults}
              onChange={setAdults}
              min={1}
              max={10}
            />
            <GuestCounter
              label="Children"
              description="Ages 2-12"
              value={children}
              onChange={setChildren}
              min={0}
              max={6}
            />
            <GuestCounter
              label="Pets"
              description="Dogs, cats, etc."
              value={pets}
              onChange={setPets}
              min={0}
              max={3}
            />
          </div>
        </div>

        {/* Extras */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Add Extras
          </h3>
          <div className="space-y-3">
            {extras.map(extra => (
              <button
                key={extra.id}
                onClick={() => toggleExtra(extra.id)}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-colors ${
                  selectedExtras.includes(extra.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Icon
                    name={extra.icon}
                    size={24}
                    className={selectedExtras.includes(extra.id) ? 'text-primary' : 'text-slate-400'}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${
                    selectedExtras.includes(extra.id)
                      ? 'text-primary'
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {extra.name}
                  </p>
                  <p className="text-sm text-slate-500">{extra.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    €{extra.price.toFixed(2)}
                  </p>
                  {selectedExtras.includes(extra.id) && (
                    <Icon name="check_circle" size={20} className="text-primary ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="h-32" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-slate-500">
              {adults + children} guest{adults + children !== 1 ? 's' : ''}{pets > 0 ? `, ${pets} pet${pets !== 1 ? 's' : ''}` : ''}
            </p>
            {selectedExtras.length > 0 && (
              <p className="text-xs text-slate-400">
                +{selectedExtras.length} extra{selectedExtras.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            €{totalPrice.toFixed(2)}
          </span>
        </div>
        <Button
          className="w-full"
          onClick={() => navigate(`/book/${id}/payment`, {
            state: {
              checkIn,
              checkOut,
              guests: { adults, children, pets },
              extras: selectedExtras,
            }
          })}
        >
          Continue to Payment
        </Button>
      </div>
    </AppShell>
  )
}
