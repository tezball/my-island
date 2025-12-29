import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui'
import { TopAppBar, StickyFooter } from '@/components/layout'
import { GuestCounter, ExtrasToggle } from '@/components/booking'
import { useBooking } from '@/context/BookingContext'
import { mockExtras } from '@/mocks/data/campsites'

export function GuestExtrasPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { booking, setGuests, toggleExtra, totalPrice } = useBooking()

  const maxGuests = booking.lot?.maxGuests || 6

  const handleContinue = () => {
    navigate(`/book/${id}/summary`)
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
      <TopAppBar
        showHome
        title="Guests & Extras" />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Guests Section */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Guests
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Maximum {maxGuests} guests for this pitch
          </p>

          <GuestCounter
            label="Adults"
            description="Ages 13+"
            value={booking.guests.adults}
            min={1}
            max={maxGuests}
            onChange={(adults) =>
              setGuests({ ...booking.guests, adults })
            }
          />
          <GuestCounter
            label="Children"
            description="Ages 2-12"
            value={booking.guests.children}
            min={0}
            max={maxGuests - booking.guests.adults}
            onChange={(children) =>
              setGuests({ ...booking.guests, children })
            }
          />
        </div>

        {/* Extras Section */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Add Extras
          </h3>
          <div className="space-y-3">
            {mockExtras.map((extra) => (
              <ExtrasToggle
                key={extra.id}
                extra={extra}
                selected={booking.extras.some((e) => e.id === extra.id)}
                onToggle={() => toggleExtra(extra)}
              />
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
          <Button className="flex-1" size="lg" onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </StickyFooter>
    </div>
  )
}
