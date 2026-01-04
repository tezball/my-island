import {
  useCampsiteWizard,
  LOT_TYPE_DEFAULTS,
  LOT_TYPE_LABELS,
  WIZARD_LOT_TYPES,
  type LotBatch,
} from '../../context/CampsiteWizardContext'
import type { LotType } from '../../data/types'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Input from '../ui/Input'

interface LotTypeOption {
  id: LotType
  label: string
  icon: string
}

const LOT_TYPE_ICONS: Record<string, string> = {
  tent: 'camping',
  campervan: 'rv_hookup',
  caravan: 'directions_car',
  glamping: 'cottage',
  cabin: 'cabin',
  yurt: 'home',
  pod: 'night_shelter',
  treehouse: 'park',
}

const LOT_TYPES: LotTypeOption[] = WIZARD_LOT_TYPES.map((id) => ({
  id,
  label: LOT_TYPE_LABELS[id] || id,
  icon: LOT_TYPE_ICONS[id] || 'home',
}))

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

interface BatchCardProps {
  batch: LotBatch
  index: number
  canRemove: boolean
  onUpdate: (updates: Partial<LotBatch>) => void
  onRemove: () => void
}

function BatchCard({ batch, index, canRemove, onUpdate, onRemove }: BatchCardProps) {
  const handleTypeChange = (newType: LotType) => {
    const defaults = LOT_TYPE_DEFAULTS[newType] || { capacity: 4, amenities: [] }
    const label = LOT_TYPE_LABELS[newType] || newType
    onUpdate({
      type: newType,
      capacity: defaults.capacity,
      amenities: [...defaults.amenities],
      namePrefix: label,
    })
  }

  const toggleAmenity = (amenity: string) => {
    const newAmenities = batch.amenities.includes(amenity)
      ? batch.amenities.filter((a) => a !== amenity)
      : [...batch.amenities, amenity]
    onUpdate({ amenities: newAmenities })
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Accommodation Type {index + 1}
        </h3>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-600 p-1"
          >
            <Icon name="delete" size={20} />
          </button>
        )}
      </div>

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Type
        </label>
        <div className="grid grid-cols-4 gap-2">
          {LOT_TYPES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleTypeChange(option.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                batch.type === option.id
                  ? 'border-primary bg-primary/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon
                name={option.icon}
                size={24}
                className={batch.type === option.id ? 'text-primary' : 'text-slate-500'}
              />
              <span
                className={`text-xs font-medium ${
                  batch.type === option.id ? 'text-primary' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Count and Name Prefix */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            How many?
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onUpdate({ count: Math.max(1, batch.count - 1) })}
              className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Icon name="remove" size={20} />
            </button>
            <span className="text-xl font-bold text-slate-900 dark:text-white w-8 text-center">
              {batch.count}
            </span>
            <button
              type="button"
              onClick={() => onUpdate({ count: Math.min(50, batch.count + 1) })}
              className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Icon name="add" size={20} />
            </button>
          </div>
        </div>

        <Input
          label="Name Prefix"
          value={batch.namePrefix}
          onChange={(e) => onUpdate({ namePrefix: e.target.value })}
          placeholder="e.g., Lakeside Pitch"
        />
      </div>

      {/* Preview */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Will create: {batch.namePrefix} 1{batch.count > 1 && `, ${batch.namePrefix} 2`}
        {batch.count > 2 && `, ... ${batch.namePrefix} ${batch.count}`}
      </p>

      {/* Capacity and Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Max Guests
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onUpdate({ capacity: Math.max(1, batch.capacity - 1) })}
              className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Icon name="remove" size={20} />
            </button>
            <span className="text-xl font-bold text-slate-900 dark:text-white w-8 text-center">
              {batch.capacity}
            </span>
            <button
              type="button"
              onClick={() => onUpdate({ capacity: Math.min(20, batch.capacity + 1) })}
              className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Icon name="add" size={20} />
            </button>
          </div>
        </div>

        <Input
          label="Price per Night"
          type="number"
          min="1"
          value={batch.pricePerNight.toString()}
          onChange={(e) => onUpdate({ pricePerNight: Math.max(1, parseInt(e.target.value) || 1) })}
          leftIcon="euro"
        />
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Amenities
        </label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((amenity) => {
            const isSelected = batch.amenities.includes(amenity)
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary text-slate-900'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {amenity}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function WizardStepAccommodations() {
  const { state, prevStep, canProceed, addLotBatch, removeLotBatch, updateLotBatch, getTotalLots } =
    useCampsiteWizard()

  const totalLots = getTotalLots()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Add your accommodations
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Tell us about the spaces guests can book. Add multiple types if needed.
          </p>
        </div>

        {/* Batch Cards */}
        <div className="space-y-4">
          {state.lotBatches.map((batch, index) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              index={index}
              canRemove={state.lotBatches.length > 1}
              onUpdate={(updates) => updateLotBatch(batch.id, updates)}
              onRemove={() => removeLotBatch(batch.id)}
            />
          ))}
        </div>

        {/* Add Another Type Button */}
        <button
          type="button"
          onClick={addLotBatch}
          className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="add" size={20} />
          Add Another Accommodation Type
        </button>

        {/* Total Summary */}
        <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Total accommodations to create:
          </span>
          <span className="text-2xl font-bold text-primary">{totalLots}</span>
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
