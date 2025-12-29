import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, Button } from '@/components/ui'
import { GuestCounter, ExtrasToggle } from '@/components/booking'
import { apiFetch } from '@/utils/api'
import type { Booking, BookingExtra } from '@/types'

export function ModifyGuestExtrasPage() {
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

  const [adults, setAdults] = useState(booking?.guests?.adults || 2)
  const [children, setChildren] = useState(booking?.guests?.children || 0)
  const [pets, setPets] = useState(booking?.guests?.pets || 0)
  const [extras, setExtras] = useState<BookingExtra[]>(booking?.extras || [])

  const availableExtras: BookingExtra[] = [
    { id: 'firewood', name: 'Firewood Bundle', price: 15, selected: false },
    { id: 'breakfast', name: 'Breakfast Package', price: 25, selected: false },
    { id: 'kayak', name: 'Kayak Rental', price: 35, selected: false },
    { id: 'bike', name: 'Bike Rental', price: 20, selected: false },
  ]

  const toggleExtra = (extraId: string) => {
    setExtras((prev) => {
      const existing = prev.find((e) => e.id === extraId)
      if (existing) {
        return prev.filter((e) => e.id !== extraId)
      } else {
        const extra = availableExtras.find((e) => e.id === extraId)
        if (extra) {
          return [...prev, { ...extra, selected: true }]
        }
        return prev
      }
    })
  }

  const handleContinue = () => {
    navigate(`/booking/${id}/modify/summary`)
  }

  const extrasCost = extras.reduce((sum, e) => sum + e.price, 0)

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
          <Icon name="arrow_back" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Modify Guests & Extras</h2>
        <div className="w-10" />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-40 px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Booking Summary */}
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800">
            <div
              className="w-16 h-16 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url('${booking.campsiteImage}')` }}
            />
            <div>
              <h3 className="font-bold text-sm">{booking.campsiteName}</h3>
              <p className="text-xs text-gray-500">
                {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Guests Section */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 space-y-4">
            <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wide">
              Guests
            </h3>

            <GuestCounter
              label="Adults"
              sublabel="Ages 13+"
              value={adults}
              onChange={setAdults}
              min={1}
              max={10}
            />

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <GuestCounter
                label="Children"
                sublabel="Ages 2-12"
                value={children}
                onChange={setChildren}
                min={0}
                max={6}
              />
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <GuestCounter
                label="Pets"
                sublabel="Dogs, cats, etc."
                value={pets}
                onChange={setPets}
                min={0}
                max={3}
              />
            </div>
          </div>

          {/* Extras Section */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 space-y-4">
            <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wide">
              Extras & Add-ons
            </h3>

            <div className="space-y-3">
              {availableExtras.map((extra) => (
                <ExtrasToggle
                  key={extra.id}
                  name={extra.name}
                  price={extra.price}
                  selected={extras.some((e) => e.id === extra.id)}
                  onToggle={() => toggleExtra(extra.id)}
                />
              ))}
            </div>

            {extras.length > 0 && (
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Extras total</span>
                  <span className="font-bold text-primary">+€{extrasCost}</span>
                </div>
              </div>
            )}
          </div>

          {/* Special Requests */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wide">
              Special Requests
            </h3>
            <textarea
              placeholder="Any special requests or notes for the host..."
              className="w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent resize-none text-sm"
              defaultValue={booking.specialRequests || ''}
            />
            <p className="text-xs text-gray-400">
              Special requests are not guaranteed but the host will do their best to accommodate.
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 p-4 pb-8 z-30">
        <div className="max-w-md mx-auto">
          <Button className="w-full h-14" size="lg" onClick={handleContinue} rightIcon="arrow_forward">
            Review Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
