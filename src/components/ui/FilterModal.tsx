import { useState } from 'react'
import { Icon, Button } from '@/components/ui'
import { cn } from '@/utils/cn'

// Mock M09: Filter Modal Component
interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterState) => void
}

interface FilterState {
  priceRange: [number, number]
  campsiteTypes: string[]
  amenities: string[]
  rating: number | null
}

const CAMPSITE_TYPES = [
  { id: 'tent', label: 'Tent', icon: 'camping' },
  { id: 'rv', label: 'RV/Caravan', icon: 'rv_hookup' },
  { id: 'cabin', label: 'Cabin', icon: 'cabin' },
  { id: 'glamping', label: 'Glamping', icon: 'holiday_village' },
]

const AMENITIES = [
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'shower', label: 'Showers', icon: 'shower' },
  { id: 'electric', label: 'Electric Hookup', icon: 'electrical_services' },
  { id: 'water', label: 'Water Hookup', icon: 'water_drop' },
  { id: 'pets', label: 'Pet Friendly', icon: 'pets' },
  { id: 'bbq', label: 'BBQ Area', icon: 'outdoor_grill' },
  { id: 'pool', label: 'Pool', icon: 'pool' },
  { id: 'playground', label: 'Playground', icon: 'attractions' },
]

export function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200],
    campsiteTypes: [],
    amenities: [],
    rating: null,
  })

  if (!isOpen) return null

  const toggleType = (typeId: string) => {
    setFilters((prev) => ({
      ...prev,
      campsiteTypes: prev.campsiteTypes.includes(typeId)
        ? prev.campsiteTypes.filter((t) => t !== typeId)
        : [...prev.campsiteTypes, typeId],
    }))
  }

  const toggleAmenity = (amenityId: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }))
  }

  const handleReset = () => {
    setFilters({
      priceRange: [0, 200],
      campsiteTypes: [],
      amenities: [],
      rating: null,
    })
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const activeCount =
    filters.campsiteTypes.length +
    filters.amenities.length +
    (filters.rating ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 200 ? 1 : 0)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background-light dark:bg-background-dark rounded-t-3xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={handleReset}
            className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
          >
            Reset
          </button>
          <h2 className="text-lg font-bold">Filters</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Icon name="close" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="text-sm font-bold mb-3">Price per night</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Min</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: [Number(e.target.value), prev.priceRange[1]],
                      }))
                    }
                    className="w-full h-12 pl-8 pr-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark"
                  />
                </div>
              </div>
              <span className="text-gray-400 mt-5">—</span>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Max</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], Number(e.target.value)],
                      }))
                    }
                    className="w-full h-12 pl-8 pr-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Campsite Type */}
          <div>
            <h3 className="text-sm font-bold mb-3">Type of stay</h3>
            <div className="grid grid-cols-2 gap-2">
              {CAMPSITE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                    filters.campsiteTypes.includes(type.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  )}
                >
                  <Icon
                    name={type.icon}
                    className={cn(
                      'text-xl',
                      filters.campsiteTypes.includes(type.id) ? 'text-primary' : 'text-gray-400'
                    )}
                  />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-sm font-bold mb-3">Minimum rating</h3>
            <div className="flex gap-2">
              {[null, 3, 3.5, 4, 4.5].map((rating) => (
                <button
                  key={rating ?? 'any'}
                  onClick={() => setFilters((prev) => ({ ...prev, rating }))}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    filters.rating === rating
                      ? 'bg-primary text-text-main'
                      : 'bg-gray-100 dark:bg-surface-dark text-gray-600 dark:text-gray-400'
                  )}
                >
                  {rating ? (
                    <>
                      <Icon name="star" filled className="text-sm" />
                      {rating}+
                    </>
                  ) : (
                    'Any'
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-bold mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((amenity) => (
                <button
                  key={amenity.id}
                  onClick={() => toggleAmenity(amenity.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    filters.amenities.includes(amenity.id)
                      ? 'bg-primary text-text-main'
                      : 'bg-gray-100 dark:bg-surface-dark text-gray-600 dark:text-gray-400'
                  )}
                >
                  <Icon name={amenity.icon} className="text-base" />
                  {amenity.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 pb-8 border-t border-gray-100 dark:border-gray-800 bg-background-light dark:bg-background-dark">
          <Button className="w-full" size="lg" onClick={handleApply}>
            Show Results {activeCount > 0 && `(${activeCount} filters)`}
          </Button>
        </div>
      </div>
    </div>
  )
}
