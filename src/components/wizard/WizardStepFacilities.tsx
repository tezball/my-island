import { useState, useEffect } from 'react'
import { useCampsiteWizard } from '../../context/CampsiteWizardContext'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import type { Facility } from '../../data/types'

interface FacilityOption {
  id: Facility
  label: string
  icon: string
}

const FACILITIES: FacilityOption[] = [
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'electric', label: 'Electric Hookup', icon: 'electrical_services' },
  { id: 'water', label: 'Water Hookup', icon: 'water_drop' },
  { id: 'toilet', label: 'Toilets', icon: 'wc' },
  { id: 'shower', label: 'Showers', icon: 'shower' },
  { id: 'laundry', label: 'Laundry', icon: 'local_laundry_service' },
  { id: 'shop', label: 'Shop', icon: 'store' },
  { id: 'restaurant', label: 'Restaurant', icon: 'restaurant' },
  { id: 'playground', label: 'Playground', icon: 'toys' },
  { id: 'beach', label: 'Beach Access', icon: 'beach_access' },
  { id: 'fishing', label: 'Fishing', icon: 'phishing' },
  { id: 'hiking', label: 'Hiking Trails', icon: 'hiking' },
  { id: 'cycling', label: 'Cycling', icon: 'directions_bike' },
  { id: 'pets', label: 'Pet Friendly', icon: 'pets' },
]

export default function WizardStepFacilities() {
  const { state, dispatch, prevStep } = useCampsiteWizard()
  const [selected, setSelected] = useState<Facility[]>(state.facilities)

  // Update context when values change
  useEffect(() => {
    dispatch({ type: 'UPDATE_FACILITIES', facilities: selected })
  }, [selected, dispatch])

  const toggleFacility = (facility: Facility) => {
    setSelected((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    )
  }

  const handleNext = () => {
    dispatch({ type: 'NEXT_STEP' })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            What facilities do you offer?
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Select all the amenities available at your campsite. This helps guests find what they need.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {FACILITIES.map((facility) => {
            const isSelected = selected.includes(facility.id)
            return (
              <button
                key={facility.id}
                onClick={() => toggleFacility(facility.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Icon
                  name={facility.icon}
                  size={24}
                  className={isSelected ? 'text-primary' : 'text-slate-500'}
                />
                <span
                  className={`text-sm font-medium ${
                    isSelected ? 'text-primary' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {facility.label}
                </span>
              </button>
            )
          })}
        </div>

        {selected.length > 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {selected.length} {selected.length === 1 ? 'facility' : 'facilities'} selected
          </p>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 p-4 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={prevStep}>
            Back
          </Button>
          <Button className="flex-1" onClick={handleNext}>
            Next: Photos
          </Button>
        </div>
      </div>
    </div>
  )
}
