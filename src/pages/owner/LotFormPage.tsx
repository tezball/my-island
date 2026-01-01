import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import Icon from '../../components/ui/Icon'
import { getLotById } from '../../data/mockData'

const lotTypes = [
  { id: 'tent', label: 'Tent Site', icon: 'camping' },
  { id: 'campervan', label: 'RV Spot', icon: 'directions_car' },
  { id: 'cabin', label: 'Cabin', icon: 'cabin' },
  { id: 'glamping', label: 'Glamping', icon: 'cottage' },
]

const amenities = [
  'Electric', 'Water', 'Wi-Fi', 'Fire Pit', 'Pets Allowed', 'Picnic Table',
  'Shade', 'Lake View', 'Sea View', 'Private Bathroom',
]

export default function LotFormPage() {
  const { lotId } = useParams<{ lotId: string }>()
  const navigate = useNavigate()
  const isEditing = !!lotId

  const existingLot = lotId ? getLotById(lotId) : null

  const [name, setName] = useState(existingLot?.name || '')
  const [type, setType] = useState<'tent' | 'caravan' | 'campervan' | 'glamping' | 'cabin'>(existingLot?.type || 'tent')
  const [capacity, setCapacity] = useState(existingLot?.capacity || 4)
  const [price, setPrice] = useState(existingLot?.pricePerNight.toString() || '')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    existingLot?.amenities || []
  )
  const [isAvailable, setIsAvailable] = useState(existingLot?.available ?? true)
  const [isSaving, setIsSaving] = useState(false)

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const handleSave = async () => {
    if (!name.trim() || !price) return

    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    navigate('/owner/lots')
  }

  const handleReset = () => {
    if (existingLot) {
      setName(existingLot.name)
      setType(existingLot.type)
      setCapacity(existingLot.capacity)
      setPrice(existingLot.pricePerNight.toString())
      setSelectedAmenities(existingLot.amenities)
      setIsAvailable(existingLot.available)
    } else {
      setName('')
      setType('tent')
      setCapacity(4)
      setPrice('')
      setSelectedAmenities([])
      setIsAvailable(true)
    }
  }

  return (
    <AppShell
      showBack
      headerTitle={isEditing ? 'Edit Lot' : 'Add New Lot'}
      showNav={false}
      headerRightAction={
        <button onClick={handleReset} className="text-primary font-medium text-sm">
          Reset
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Essentials */}
        <div className="p-4 space-y-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Essentials
          </h3>

          <Input
            label="Lot Name or Number"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Riverside Spot 04"
          />

          {/* Lot Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Lot Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {lotTypes.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as 'tent' | 'caravan' | 'campervan' | 'glamping' | 'cabin')}
                  className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-colors ${
                    type === t.id
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Icon
                    name={t.icon}
                    size={20}
                    className={type === t.id ? 'text-primary' : 'text-slate-400'}
                  />
                  <span className={`text-sm font-medium ${
                    type === t.id
                      ? 'text-primary'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {t.label}
                  </span>
                  {type === t.id && (
                    <Icon name="check_circle" size={18} className="text-primary ml-auto" filled />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Capacity & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Max Guests
              </label>
              <div className="flex items-center justify-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => setCapacity(Math.max(1, capacity - 1))}
                  className="size-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center"
                >
                  <Icon name="remove" size={18} />
                </button>
                <span className="font-bold text-xl text-slate-900 dark:text-white w-8 text-center">
                  {capacity}
                </span>
                <button
                  onClick={() => setCapacity(Math.min(20, capacity + 1))}
                  className="size-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center"
                >
                  <Icon name="add" size={18} />
                </button>
              </div>
            </div>
            <Input
              label="Price per Night"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="e.g., 45.00"
              leftIcon="euro"
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Amenities
            </h3>
            <button
              onClick={() => setSelectedAmenities(
                selectedAmenities.length === amenities.length ? [] : [...amenities]
              )}
              className="text-primary text-sm font-medium"
            >
              {selectedAmenities.length === amenities.length ? 'Clear all' : 'Select all'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {amenities.map(amenity => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedAmenities.includes(amenity)
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Photos
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {existingLot?.images.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <button className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1 hover:border-primary hover:text-primary transition-colors">
              <Icon name="add_photo_alternate" size={24} className="text-slate-400" />
              <span className="text-xs text-slate-400">Add Photo</span>
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Toggle
            checked={isAvailable}
            onChange={setIsAvailable}
            label="Make available for booking"
            description="This lot will be visible to guests immediately"
          />
        </div>

        <div className="h-32" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate('/owner/lots')}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!name.trim() || !price}
            isLoading={isSaving}
            onClick={handleSave}
            leftIcon="save"
          >
            {isEditing ? 'Save Changes' : 'Save Lot'}
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
