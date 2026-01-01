import { useState, useEffect } from 'react'
import { useCampsiteWizard, type WizardLot } from '../../context/CampsiteWizardContext'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Input from '../ui/Input'

interface LotTypeOption {
  id: WizardLot['type']
  label: string
  icon: string
  description: string
}

const LOT_TYPES: LotTypeOption[] = [
  { id: 'tent', label: 'Tent Site', icon: 'camping', description: 'Basic pitch for tent camping' },
  { id: 'campervan', label: 'Campervan', icon: 'rv_hookup', description: 'Space for campervans and RVs' },
  { id: 'caravan', label: 'Caravan', icon: 'directions_car', description: 'Pitch for touring caravans' },
  { id: 'glamping', label: 'Glamping', icon: 'cottage', description: 'Luxury camping experience' },
  { id: 'cabin', label: 'Cabin', icon: 'cabin', description: 'Self-contained cabin or pod' },
]

const AMENITIES = [
  'Electric Hookup',
  'Water Hookup',
  'Fire Pit',
  'Picnic Table',
  'Wi-Fi',
  'Private Bathroom',
  'BBQ Grill',
  'Shade',
  'Lake View',
  'Sea View',
  'Mountain View',
  'Pet Friendly',
]

export default function WizardStepLot() {
  const { state, dispatch, prevStep, canProceed } = useCampsiteWizard()
  const [name, setName] = useState(state.lot?.name || '')
  const [type, setType] = useState<WizardLot['type']>(state.lot?.type || 'tent')
  const [capacity, setCapacity] = useState(state.lot?.capacity || 4)
  const [price, setPrice] = useState(state.lot?.pricePerNight || 25)
  const [amenities, setAmenities] = useState<string[]>(state.lot?.amenities || [])

  // Update context when values change
  useEffect(() => {
    if (name.trim()) {
      const lot: WizardLot = {
        name,
        type,
        capacity,
        pricePerNight: price,
        amenities,
      }
      dispatch({ type: 'UPDATE_LOT', lot })
    }
  }, [name, type, capacity, price, amenities, dispatch])

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Add your first accommodation
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Define a type of space guests can book. You can add more later.
          </p>
        </div>

        <Input
          label="Lot Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Seaside Pitch 1, Woodland Cabin"
        />

        {/* Lot Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Accommodation Type
          </label>
          <div className="space-y-2">
            {LOT_TYPES.map((option) => (
              <button
                key={option.id}
                onClick={() => setType(option.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  type === option.id
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon
                  name={option.icon}
                  size={28}
                  className={type === option.id ? 'text-primary' : 'text-slate-500'}
                />
                <div className="text-left flex-1">
                  <p className={`font-medium ${type === option.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                    {option.label}
                  </p>
                  <p className="text-sm text-slate-500">{option.description}</p>
                </div>
                {type === option.id && (
                  <Icon name="check_circle" size={24} className="text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Capacity and Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Max Guests
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCapacity(Math.max(1, capacity - 1))}
                className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center"
              >
                <Icon name="remove" size={20} />
              </button>
              <span className="text-xl font-bold text-slate-900 dark:text-white w-8 text-center">
                {capacity}
              </span>
              <button
                onClick={() => setCapacity(Math.min(20, capacity + 1))}
                className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center"
              >
                <Icon name="add" size={20} />
              </button>
            </div>
          </div>

          <Input
            label="Price per Night"
            type="number"
            min="1"
            value={price.toString()}
            onChange={(e) => setPrice(Math.max(1, parseInt(e.target.value) || 1))}
            leftIcon="euro"
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Lot Amenities
          </label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((amenity) => {
              const isSelected = amenities.includes(amenity)
              return (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-primary text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {amenity}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 p-4 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={prevStep}>
            Back
          </Button>
          <Button className="flex-1" disabled={!canProceed()} type="submit" form="wizard-form">
            Create Campsite
          </Button>
        </div>
      </div>
    </div>
  )
}
