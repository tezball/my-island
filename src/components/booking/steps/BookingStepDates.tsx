import { useBookingWizard } from '@/context/BookingWizardContext'
import Calendar from '@/components/ui/Calendar'
import Icon from '@/components/ui/Icon'

export default function BookingStepDates() {
  const { state, setDates, setCheckIn, nights } = useBookingWizard()

  const selectedDates: string[] = []
  if (state.checkIn) {
    selectedDates.push(state.checkIn.toISOString().split('T')[0])
  }
  if (state.checkOut) {
    selectedDates.push(state.checkOut.toISOString().split('T')[0])
  }

  const handleDateSelect = (dateStr: string) => {
    // First click - set check-in date
    setCheckIn(new Date(dateStr))
  }

  const handleRangeSelect = (startDate: string, endDate: string) => {
    // Second click - set both dates (completing the range)
    setDates(new Date(startDate), new Date(endDate))
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date'
    return date.toLocaleDateString('en-IE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className="p-4 pb-32">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        When are you visiting?
      </h2>
      <p className="text-slate-500 mb-6">
        Select your check-in and check-out dates
      </p>

      {/* Date Summary */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <div className="flex-1">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
            Check-in
          </p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {formatDate(state.checkIn)}
          </p>
        </div>
        <Icon name="arrow_forward" size={20} className="text-slate-400" />
        <div className="flex-1">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
            Check-out
          </p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {formatDate(state.checkOut)}
          </p>
        </div>
        {nights > 0 && (
          <div className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-full text-sm">
            {nights} {nights === 1 ? 'night' : 'nights'}
          </div>
        )}
      </div>

      {/* Calendar */}
      <Calendar
        selectedDates={selectedDates}
        rangeMode
        onDateSelect={handleDateSelect}
        onRangeSelect={handleRangeSelect}
        initialMonth={state.checkIn || new Date()}
        className="shadow-sm"
      />

      {/* Tip */}
      <div className="flex items-start gap-3 mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
        <Icon name="lightbulb" size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Tip: Weekday stays often have better availability and lower prices.
        </p>
      </div>
    </div>
  )
}
