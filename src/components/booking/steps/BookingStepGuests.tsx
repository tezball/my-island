import { useBookingWizard } from '@/context/BookingWizardContext'
import Icon from '@/components/ui/Icon'

interface GuestCounterProps {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

function GuestCounter({
  label,
  description,
  value,
  onChange,
  min = 0,
  max = 10,
}: GuestCounterProps) {
  const canDecrement = value > min
  const canIncrement = value < max

  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={!canDecrement}
          className={`
            size-10 rounded-full border flex items-center justify-center transition-colors
            ${canDecrement
              ? 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:border-primary hover:text-primary'
              : 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
            }
          `}
        >
          <Icon name="remove" size={20} />
        </button>
        <span className="w-8 text-center font-bold text-lg text-slate-900 dark:text-white">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={!canIncrement}
          className={`
            size-10 rounded-full border flex items-center justify-center transition-colors
            ${canIncrement
              ? 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:border-primary hover:text-primary'
              : 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
            }
          `}
        >
          <Icon name="add" size={20} />
        </button>
      </div>
    </div>
  )
}

export default function BookingStepGuests() {
  const { state, setGuests, totalGuests } = useBookingWizard()

  const remainingCapacity = state.maxCapacity - totalGuests

  const handleAdultsChange = (adults: number) => {
    const maxAdults = state.maxCapacity - state.children
    setGuests(Math.min(adults, maxAdults), state.children)
  }

  const handleChildrenChange = (children: number) => {
    const maxChildren = state.maxCapacity - state.adults
    setGuests(state.adults, Math.min(children, maxChildren))
  }

  return (
    <div className="p-4 pb-32">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        How many guests?
      </h2>
      <p className="text-slate-500 mb-6">
        Maximum {state.maxCapacity} guests for this accommodation type
      </p>

      <div className="bg-white dark:bg-surface-dark rounded-xl px-4">
        <GuestCounter
          label="Adults"
          description="Ages 13+"
          value={state.adults}
          onChange={handleAdultsChange}
          min={1}
          max={state.maxCapacity}
        />
        <GuestCounter
          label="Children"
          description="Ages 2-12"
          value={state.children}
          onChange={handleChildrenChange}
          min={0}
          max={state.maxCapacity - 1}
        />
      </div>

      {/* Guest Summary */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="group" size={20} className="text-slate-400" />
            <span className="text-slate-900 dark:text-white font-medium">
              Total guests
            </span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">
            {totalGuests} of {state.maxCapacity}
          </span>
        </div>
        {remainingCapacity > 0 && (
          <p className="text-sm text-slate-500 mt-2">
            You can add {remainingCapacity} more {remainingCapacity === 1 ? 'guest' : 'guests'}
          </p>
        )}
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <Icon name="info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Infants under 2 years old stay free and don't count towards the guest limit.
        </p>
      </div>
    </div>
  )
}
