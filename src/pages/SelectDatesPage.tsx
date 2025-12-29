import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui'
import { TopAppBar, StickyFooter } from '@/components/layout'
import { DateRangePicker } from '@/components/booking'
import { useBooking } from '@/context/BookingContext'
import { apiFetch } from '@/utils/api'

export function SelectDatesPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { booking, setDates, nights, totalPrice } = useBooking()

  const { data: availabilityData } = useQuery({
    queryKey: ['availability', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/campsites/${id}/availability`)
      return res.json()
    },
  })

  const unavailableDates: string[] = availabilityData?.unavailableDates || []

  const handleContinue = () => {
    if (booking.checkIn && booking.checkOut) {
      navigate(`/book/${id}/guests`)
    }
  }

  const canContinue = booking.checkIn && booking.checkOut && nights > 0

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
      <TopAppBar title="Select Dates" />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Campsite Summary */}
        {booking.campsite && (
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800">
            <img
              src={booking.campsite.imageUrl}
              alt={booking.campsite.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {booking.campsite.name}
              </h3>
              <p className="text-sm text-slate-500">{booking.lot?.name}</p>
            </div>
          </div>
        )}

        {/* Date Picker */}
        <DateRangePicker
          checkIn={booking.checkIn}
          checkOut={booking.checkOut}
          unavailableDates={unavailableDates}
          onSelect={setDates}
        />

        {/* Summary */}
        {nights > 0 && (
          <div className="p-4 bg-primary/10 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                {nights} night{nights > 1 ? 's' : ''}
              </span>
              <span className="font-bold text-primary">€{totalPrice}</span>
            </div>
          </div>
        )}
      </div>

      <StickyFooter>
        <Button
          className="w-full"
          size="lg"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </StickyFooter>
    </div>
  )
}
