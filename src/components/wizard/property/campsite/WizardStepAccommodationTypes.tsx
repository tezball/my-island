import { usePropertyWizard } from '@/context/PropertyWizardContext'
import type { AccommodationType } from '@/data/types'
import { ACCOMMODATION_LABELS } from '@/data/types'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

// Icons for each accommodation type (Google Material Symbols)
const ACCOMMODATION_ICONS: Record<AccommodationType, string> = {
  TENT: 'camping',
  RV: 'rv_hookup',
  MOBILE_HOME: 'home',
  GLAMPING: 'park',
  CABIN: 'cottage',
  APARTMENT: 'apartment',
  BED_AND_BREAKFAST: 'hotel',
}

// Descriptions for each accommodation type
const ACCOMMODATION_DESCRIPTIONS: Record<AccommodationType, string> = {
  TENT: 'Traditional tent pitches with or without hookups',
  RV: 'Pitches for RVs and motorhomes with full facilities',
  MOBILE_HOME: 'Permanent or semi-permanent mobile home pitches',
  GLAMPING: 'Luxury camping pods, yurts, and safari tents',
  CABIN: 'Wooden cabins and cottages',
  APARTMENT: 'Self-contained apartment units',
  BED_AND_BREAKFAST: 'Traditional B&B rooms with breakfast',
}

// Available types for campsite (excludes B&B)
const CAMPSITE_TYPES: AccommodationType[] = [
  'TENT',
  'RV',
  'MOBILE_HOME',
  'GLAMPING',
  'CABIN',
  'APARTMENT',
]

export function WizardStepAccommodationTypes() {
  const { state, toggleAccommodationType } = usePropertyWizard()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          Accommodation Types
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select all the types of accommodations you offer
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CAMPSITE_TYPES.map((type) => {
          const iconName = ACCOMMODATION_ICONS[type]
          const isSelected = state.selectedAccommodationTypes.includes(type)

          return (
            <button
              key={type}
              onClick={() => toggleAccommodationType(type)}
              className={cn(
                'relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all',
                isSelected
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              {/* Checkbox indicator */}
              <div
                className={cn(
                  'absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                  isSelected
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                )}
              >
                {isSelected && <Icon name="check" size={16} />}
              </div>

              {/* Icon */}
              <div
                className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                  isSelected
                    ? 'bg-green-100 dark:bg-green-900/40'
                    : 'bg-gray-100 dark:bg-gray-800'
                )}
              >
                <Icon
                  name={iconName}
                  size={24}
                  className={cn(
                    isSelected
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-8">
                <h3
                  className={cn(
                    'font-semibold mb-1',
                    isSelected
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-gray-900 dark:text-white'
                  )}
                >
                  {ACCOMMODATION_LABELS[type]}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {ACCOMMODATION_DESCRIPTIONS[type]}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selection summary */}
      {state.selectedAccommodationTypes.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-700 dark:text-green-400">
            <span className="font-semibold">
              {state.selectedAccommodationTypes.length} type
              {state.selectedAccommodationTypes.length !== 1 ? 's' : ''} selected
            </span>
            {' - '}
            {state.selectedAccommodationTypes
              .map((t) => ACCOMMODATION_LABELS[t])
              .join(', ')}
          </p>
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        You&apos;ll configure each type in the following steps
      </p>
    </div>
  )
}

export default WizardStepAccommodationTypes
