import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Button, Toggle } from '@/components/ui'
import { cn } from '@/utils/cn'

// Add Campsite Lot Page - from design
type LotType = 'tent' | 'rv' | 'cabin' | 'glamping'

const LOT_TYPES: { type: LotType; icon: string; label: string }[] = [
  { type: 'tent', icon: 'camping', label: 'Tent Site' },
  { type: 'rv', icon: 'rv_hookup', label: 'RV Spot' },
  { type: 'cabin', icon: 'cabin', label: 'Cabin' },
  { type: 'glamping', icon: 'hotel_class', label: 'Glamping' },
]

const AMENITIES = [
  { icon: 'bolt', label: 'Electric' },
  { icon: 'water_drop', label: 'Water' },
  { icon: 'wifi', label: 'Wi-Fi' },
  { icon: 'local_fire_department', label: 'Fire Pit' },
  { icon: 'pets', label: 'Pets Allowed' },
  { icon: 'deck', label: 'Picnic Table' },
]

export function AddLotPage() {
  const navigate = useNavigate()
  const [lotName, setLotName] = useState('')
  const [selectedType, setSelectedType] = useState<LotType>('tent')
  const [maxGuests, setMaxGuests] = useState(4)
  const [size, setSize] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Electric'])
  const [isAvailable, setIsAvailable] = useState(true)

  const toggleAmenity = (label: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(label)
        ? prev.filter((a) => a !== label)
        : [...prev, label]
    )
  }

  const handleSave = () => {
    // Would save via API
    navigate('/owner/lots')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon name="close" className="text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="text-lg font-bold">Add New Lot</h2>
        <button
          onClick={() => {
            setLotName('')
            setSelectedType('tent')
            setMaxGuests(4)
            setSize('')
            setSelectedAmenities(['Electric'])
          }}
          className="text-sm font-semibold text-primary hover:text-green-400"
        >
          Reset
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col gap-6 p-4 pb-32">
        {/* Essentials Section */}
        <section>
          <h3 className="text-xl font-bold mb-4 px-1">Essentials</h3>
          <div className="space-y-4">
            {/* Lot Name */}
            <label className="block">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-1 mb-1.5 block">
                Lot Name or Number
              </span>
              <input
                type="text"
                value={lotName}
                onChange={(e) => setLotName(e.target.value)}
                placeholder="e.g., Riverside Spot 04"
                className="w-full h-14 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark px-4 text-base focus:border-primary focus:ring-primary placeholder-gray-400"
              />
            </label>

            {/* Lot Type */}
            <div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-1 mb-2 block">
                Lot Type
              </span>
              <div className="grid grid-cols-2 gap-3">
                {LOT_TYPES.map(({ type, icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      'relative flex flex-col items-center justify-center gap-2 rounded-xl p-4 cursor-pointer transition-all',
                      selectedType === type
                        ? 'border-2 border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark hover:border-primary/50'
                    )}
                  >
                    {selectedType === type && (
                      <div className="absolute top-2 right-2 text-primary">
                        <Icon name="check_circle" className="text-xl font-bold" />
                      </div>
                    )}
                    <Icon
                      name={icon}
                      className={cn(
                        'text-3xl',
                        selectedType === type ? 'text-primary' : 'text-gray-400'
                      )}
                    />
                    <span
                      className={cn(
                        'font-semibold text-sm',
                        selectedType === type
                          ? ''
                          : 'text-gray-600 dark:text-gray-300'
                      )}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Capacity & Size */}
        <section>
          <div className="h-px bg-gray-200 dark:bg-gray-800 w-full my-2" />
          <h3 className="text-xl font-bold mt-6 mb-4 px-1">Capacity & Size</h3>
          <div className="flex gap-4">
            {/* Guest Stepper */}
            <div className="flex-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 p-4 flex flex-col justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Max Guests
              </span>
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => setMaxGuests(Math.max(1, maxGuests - 1))}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 flex items-center justify-center text-gray-600 dark:text-gray-300"
                >
                  <Icon name="remove" className="text-lg" />
                </button>
                <span className="text-xl font-bold">{maxGuests}</span>
                <button
                  onClick={() => setMaxGuests(maxGuests + 1)}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-90"
                >
                  <Icon name="add" className="text-lg text-black" />
                </button>
              </div>
            </div>

            {/* Size Input */}
            <div className="flex-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 p-4 flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Size (ft)
              </span>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 20x20"
                className="w-full bg-transparent border-0 p-0 text-xl font-bold placeholder-gray-300 focus:ring-0"
              />
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section>
          <div className="h-px bg-gray-200 dark:bg-gray-800 w-full my-2" />
          <h3 className="text-xl font-bold mt-6 mb-4 px-1">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map(({ icon, label }) => (
              <button
                key={label}
                onClick={() => toggleAmenity(label)}
                className={cn(
                  'group flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all active:scale-95',
                  selectedAmenities.includes(label)
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark hover:border-primary/50'
                )}
              >
                <Icon
                  name={icon}
                  className={cn(
                    'text-lg',
                    selectedAmenities.includes(label)
                      ? 'text-primary'
                      : 'text-gray-400 group-hover:text-primary'
                  )}
                />
                <span
                  className={cn(
                    'text-sm',
                    selectedAmenities.includes(label)
                      ? 'font-semibold'
                      : 'font-medium text-gray-600 dark:text-gray-300'
                  )}
                >
                  {label}
                </span>
              </button>
            ))}
            <button className="group flex items-center gap-2 px-3 py-2.5 rounded-full border border-dashed border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-surface-dark transition-all">
              <Icon name="add" className="text-lg text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Add</span>
            </button>
          </div>
        </section>

        {/* Photos */}
        <section>
          <div className="h-px bg-gray-200 dark:bg-gray-800 w-full my-2" />
          <h3 className="text-xl font-bold mt-6 mb-4 px-1">Photos</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button className="shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-surface-dark flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors">
              <Icon name="add_a_photo" className="text-2xl mb-1" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Add Photo
              </span>
            </button>
          </div>
        </section>

        {/* Status */}
        <section className="mt-2">
          <div className="rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-base">Initial Status</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Make available for booking immediately?
              </p>
            </div>
            <Toggle checked={isAvailable} onChange={setIsAvailable} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="flex flex-col gap-3">
          <Button
            className="w-full h-14"
            size="lg"
            onClick={handleSave}
            leftIcon="save"
          >
            Save Lot
          </Button>
          <button className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            Save & Add Another
          </button>
        </div>
      </div>
    </div>
  )
}
