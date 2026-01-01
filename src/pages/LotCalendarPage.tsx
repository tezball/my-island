import { useState, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Calendar from '../components/ui/Calendar'
import Icon from '../components/ui/Icon'
import { getCampsiteById, getLotsByCampsite, getLotAvailability } from '../data/mockData'

export default function LotCalendarPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialLotId = searchParams.get('lot')

  const campsite = getCampsiteById(id || '')
  const lots = getLotsByCampsite(id || '')
  const [selectedLotId, setSelectedLotId] = useState(initialLotId || lots[0]?.id || '')
  const [selectedDates, setSelectedDates] = useState<string[]>([])

  const availability = useMemo(() => {
    return getLotAvailability(selectedLotId)
  }, [selectedLotId])

  const availableDates = availability
    .filter(a => a.status === 'available')
    .map(a => a.date)

  const bookedDates = availability
    .filter(a => a.status === 'booked')
    .map(a => a.date)

  const blockedDates = availability
    .filter(a => a.status === 'blocked' || a.status === 'maintenance')
    .map(a => a.date)

  const selectedLot = lots.find(l => l.id === selectedLotId)

  if (!campsite) {
    return (
      <AppShell showBack headerTitle="Calendar">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Campsite not found</p>
        </div>
      </AppShell>
    )
  }

  const handleRangeSelect = (start: string, end: string) => {
    setSelectedDates([start, end])
  }

  const calculateNights = () => {
    if (selectedDates.length !== 2) return 0
    const start = new Date(selectedDates[0])
    const end = new Date(selectedDates[1])
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const totalPrice = nights * (selectedLot?.pricePerNight || 0)

  const handleContinue = () => {
    if (selectedDates.length === 2) {
      navigate(`/book/${id}?lot=${selectedLotId}&checkIn=${selectedDates[0]}&checkOut=${selectedDates[1]}`)
    }
  }

  return (
    <AppShell showBack headerTitle="Select Dates" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Lot selector */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Select Pitch/Accommodation
          </label>
          <select
            value={selectedLotId}
            onChange={(e) => {
              setSelectedLotId(e.target.value)
              setSelectedDates([])
            }}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white"
          >
            {lots.map(lot => (
              <option key={lot.id} value={lot.id}>
                {lot.name} - €{lot.pricePerNight}/night
              </option>
            ))}
          </select>
        </div>

        {/* Selected lot info */}
        {selectedLot && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <img
                src={selectedLot.images[0]}
                alt={selectedLot.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {selectedLot.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedLot.type.charAt(0).toUpperCase() + selectedLot.type.slice(1)} • Up to {selectedLot.capacity} guests
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">€{selectedLot.pricePerNight}</p>
                <p className="text-xs text-slate-500">per night</p>
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="p-4">
          <Calendar
            selectedDates={selectedDates}
            availableDates={availableDates}
            bookedDates={bookedDates}
            blockedDates={blockedDates}
            onDateSelect={(date) => {
              if (selectedDates.length === 0 || selectedDates.length === 2) {
                setSelectedDates([date])
              } else {
                const start = selectedDates[0] < date ? selectedDates[0] : date
                const end = selectedDates[0] < date ? date : selectedDates[0]
                setSelectedDates([start, end])
              }
            }}
            onRangeSelect={handleRangeSelect}
            rangeMode
          />
        </div>

        {/* Selected dates summary */}
        {selectedDates.length > 0 && (
          <div className="p-4 mx-4 mb-4 bg-primary/10 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="event" size={20} className="text-primary" />
                <span className="font-medium text-slate-900 dark:text-white">
                  {selectedDates.length === 1
                    ? `Selected: ${new Date(selectedDates[0]).toLocaleDateString()}`
                    : `${new Date(selectedDates[0]).toLocaleDateString()} - ${new Date(selectedDates[1]).toLocaleDateString()}`
                  }
                </span>
              </div>
              <button
                onClick={() => setSelectedDates([])}
                className="text-sm text-primary font-medium"
              >
                Clear
              </button>
            </div>
            {nights > 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {nights} night{nights !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        <div className="h-32" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              €{totalPrice}
            </p>
          </div>
          {nights > 0 && (
            <p className="text-sm text-slate-500">
              €{selectedLot?.pricePerNight} x {nights} nights
            </p>
          )}
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={selectedDates.length !== 2}
          onClick={handleContinue}
        >
          Continue to Booking
        </Button>
      </div>
    </AppShell>
  )
}
