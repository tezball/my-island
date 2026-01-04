import { usePropertyWizard } from '@/context/PropertyWizardContext'
import type { AccommodationType } from '@/data/types'
import {
  ACCOMMODATION_LABELS,
  ACCOMMODATION_AMENITIES,
} from '@/data/types'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

interface ConfigureAccommodationProps {
  type: AccommodationType
  title?: string
  description?: string
}

export function ConfigureAccommodation({
  type,
  title,
  description,
}: ConfigureAccommodationProps) {
  const { state, updateAccommodationConfig } = usePropertyWizard()

  const config = state.accommodationConfigs[type]

  if (!config) {
    return (
      <div className="text-center py-10 text-gray-500">
        No configuration found for {ACCOMMODATION_LABELS[type]}
      </div>
    )
  }

  const defaultAmenities = ACCOMMODATION_AMENITIES[type]

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(50, config.quantity + delta))
    updateAccommodationConfig(type, { quantity: newQuantity })
  }

  const handleCapacityChange = (delta: number) => {
    const newCapacity = Math.max(1, Math.min(20, config.defaultCapacity + delta))
    updateAccommodationConfig(type, { defaultCapacity: newCapacity })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value) && value >= 0) {
      updateAccommodationConfig(type, { pricePerNight: value })
    }
  }

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = config.amenities
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity]
    updateAccommodationConfig(type, { amenities: newAmenities })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {title || `Configure ${ACCOMMODATION_LABELS[type]}`}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {description || `Set up your ${ACCOMMODATION_LABELS[type].toLowerCase()}`}
        </p>
      </div>

      {/* Quantity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          How many {ACCOMMODATION_LABELS[type].toLowerCase()} do you have?
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={config.quantity <= 1}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="remove" size={20} />
          </button>
          <span className="text-3xl font-bold text-gray-900 dark:text-white w-16 text-center">
            {config.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={config.quantity >= 50}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="add" size={20} />
          </button>
        </div>
      </div>

      {/* Default Capacity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Default guest capacity per unit
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleCapacityChange(-1)}
            disabled={config.defaultCapacity <= 1}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="remove" size={20} />
          </button>
          <span className="text-3xl font-bold text-gray-900 dark:text-white w-16 text-center">
            {config.defaultCapacity}
          </span>
          <button
            onClick={() => handleCapacityChange(1)}
            disabled={config.defaultCapacity >= 20}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="add" size={20} />
          </button>
          <span className="text-gray-500 dark:text-gray-400 ml-2">
            guests
          </span>
        </div>
      </div>

      {/* Price per Night */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Price per night
        </label>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-400"></span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={config.pricePerNight}
            onChange={handlePriceChange}
            className="w-32 px-4 py-2 text-2xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <span className="text-gray-500 dark:text-gray-400">/ night</span>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Included amenities
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {defaultAmenities.map((amenity) => {
            const isSelected = config.amenities.includes(amenity)
            return (
              <button
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left',
                  isSelected
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded flex items-center justify-center flex-shrink-0',
                    isSelected
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600'
                  )}
                >
                  {isSelected && <Icon name="check" size={12} />}
                </div>
                <span className="truncate">{amenity}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <p className="text-sm text-green-700 dark:text-green-400">
          <span className="font-semibold">{config.quantity}</span>{' '}
          {ACCOMMODATION_LABELS[type].toLowerCase()} ×{' '}
          <span className="font-semibold">{config.pricePerNight}/night</span>
          {' = '}
          <span className="font-semibold">
            {(config.quantity * config.pricePerNight).toFixed(2)}/night
          </span>{' '}
          potential revenue
        </p>
      </div>
    </div>
  )
}

export default ConfigureAccommodation
