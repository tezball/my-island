import { useState, useEffect } from 'react'
import { useBookingWizard, type SelectedExtra } from '@/context/BookingWizardContext'
import Icon from '@/components/ui/Icon'
import Skeleton from '@/components/ui/Skeleton'
import { extrasApi, type ExtraResponse } from '@/lib/api/extras'

// Default icon for extras
const DEFAULT_EXTRA_ICON = 'add_shopping_cart'

// Map common extra names to icons
function getExtraIcon(name: string): string {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('firewood') || lowerName.includes('fire')) return 'local_fire_department'
  if (lowerName.includes('breakfast') || lowerName.includes('meal')) return 'restaurant'
  if (lowerName.includes('kayak')) return 'kayaking'
  if (lowerName.includes('bike') || lowerName.includes('bicycle')) return 'pedal_bike'
  if (lowerName.includes('canoe') || lowerName.includes('paddle')) return 'rowing'
  if (lowerName.includes('fish')) return 'phishing'
  if (lowerName.includes('tent') || lowerName.includes('camping')) return 'camping'
  if (lowerName.includes('bbq') || lowerName.includes('grill')) return 'outdoor_grill'
  if (lowerName.includes('wifi') || lowerName.includes('internet')) return 'wifi'
  if (lowerName.includes('parking')) return 'local_parking'
  if (lowerName.includes('pet') || lowerName.includes('dog')) return 'pets'
  return DEFAULT_EXTRA_ICON
}

interface ExtraCardProps {
  extra: SelectedExtra
  isSelected: boolean
  nights: number
  perNight: boolean
  onToggle: () => void
}

function ExtraCard({ extra, isSelected, nights, perNight, onToggle }: ExtraCardProps) {
  const icon = getExtraIcon(extra.name)
  const totalPrice = perNight ? extra.price * nights : extra.price

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        w-full p-4 rounded-xl border transition-all text-left
        ${isSelected
          ? 'border-primary bg-primary/5 dark:bg-primary/10'
          : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark hover:border-primary/50'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            size-12 rounded-xl flex items-center justify-center flex-shrink-0
            ${isSelected ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}
          `}
        >
          <Icon name={icon} size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {extra.name}
            </h3>
            {isSelected && (
              <Icon name="check_circle" size={20} className="text-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            €{extra.price}{perNight ? '/night' : ' one-time'}
          </p>
          {isSelected && perNight && nights > 1 && (
            <p className="text-sm text-primary font-medium mt-1">
              €{totalPrice} total ({nights} nights)
            </p>
          )}
        </div>
      </div>
    </button>
  )
}

interface ExtendedExtra extends SelectedExtra {
  perNight: boolean
}

export default function BookingStepExtras() {
  const { state, toggleExtra, nights } = useBookingWizard()
  const [availableExtras, setAvailableExtras] = useState<ExtendedExtra[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch extras from API when component mounts
  useEffect(() => {
    async function fetchExtras() {
      if (!state.campsiteId) {
        setIsLoading(false)
        return
      }

      try {
        const extras = await extrasApi.getExtrasByCampsite(state.campsiteId)
        // Convert API response to SelectedExtra format with perNight flag
        const mappedExtras: ExtendedExtra[] = extras.map((e: ExtraResponse) => ({
          id: e.id,
          name: e.name,
          price: e.price,
          quantity: 1,
          perNight: e.perNight,
        }))
        setAvailableExtras(mappedExtras)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch extras:', err)
        setError('Failed to load extras')
        setAvailableExtras([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchExtras()
  }, [state.campsiteId])

  const isSelected = (extraId: string) =>
    state.selectedExtras.some((e) => e.id === extraId)

  // Calculate total accounting for perNight flag
  const extrasTotal = state.selectedExtras.reduce((sum, selected) => {
    const extra = availableExtras.find(e => e.id === selected.id)
    const perNight = extra?.perNight ?? true
    return sum + selected.price * selected.quantity * (perNight ? nights : 1)
  }, 0)

  if (isLoading) {
    return (
      <div className="p-4 pb-32">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Add extras
        </h2>
        <p className="text-slate-500 mb-6">
          Enhance your stay with these optional extras
        </p>
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 pb-32">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Add extras
        </h2>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 pb-32">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Add extras
      </h2>
      <p className="text-slate-500 mb-6">
        Enhance your stay with these optional extras
      </p>

      {/* Extras Grid */}
      {availableExtras.length > 0 ? (
        <div className="grid gap-3">
          {availableExtras.map((extra) => (
            <ExtraCard
              key={extra.id}
              extra={extra}
              isSelected={isSelected(extra.id)}
              nights={nights}
              perNight={extra.perNight}
              onToggle={() => toggleExtra(extra)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="inventory_2" size={48} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">
            No extras available for this campsite yet.
          </p>
        </div>
      )}

      {/* Extras Summary */}
      {state.selectedExtras.length > 0 && (
        <div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {state.selectedExtras.length} {state.selectedExtras.length === 1 ? 'extra' : 'extras'} selected
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                {state.selectedExtras.map((e) => e.name).join(', ')}
              </p>
            </div>
            <p className="font-bold text-primary text-lg">
              +€{extrasTotal}
            </p>
          </div>
        </div>
      )}

      {/* Skip Info */}
      <div className="flex items-center gap-3 mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <Icon name="info" size={20} className="text-slate-400 flex-shrink-0" />
        <p className="text-sm text-slate-500">
          Extras are optional. You can proceed without selecting any.
        </p>
      </div>
    </div>
  )
}
