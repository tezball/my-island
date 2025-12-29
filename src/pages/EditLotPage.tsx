import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon, Button, Toggle } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { cn } from '@/utils/cn'

// Edit Lot Details Page - from design
const AMENITIES = [
  { icon: 'deck', label: 'Picnic Table', checked: true },
  { icon: 'local_fire_department', label: 'Fire Pit', checked: true },
  { icon: 'electrical_services', label: 'Electric', checked: false },
  { icon: 'water_drop', label: 'Water', checked: false },
  { icon: 'wifi', label: 'Wifi', checked: true },
  { icon: 'pets', label: 'Pets', checked: false },
]

export function EditLotPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [lotNumber, setLotNumber] = useState('A-14')
  const [lotType, setLotType] = useState('rv')
  const [price, setPrice] = useState('45.00')
  const [maxCapacity, setMaxCapacity] = useState(6)
  const [amenities, setAmenities] = useState(AMENITIES)
  const [isAvailable, setIsAvailable] = useState(true)

  const toggleAmenity = (label: string) => {
    setAmenities((prev) =>
      prev.map((a) =>
        a.label === label ? { ...a, checked: !a.checked } : a
      )
    )
  }

  const handleSave = () => {
    // Would save via API
    navigate('/owner/lots')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar title="Edit Lot Details" />

      <div className="flex-1 flex flex-col pb-24">
        {/* Hero Image */}
        <div className="w-full mb-2 px-4 py-3">
          <div
            className="relative bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl min-h-[180px] shadow-sm"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%), url("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400")`,
            }}
          >
            <div className="flex flex-col p-5">
              <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
                Current Lot
              </span>
              <p className="text-white tracking-tight text-2xl font-bold leading-tight">
                Lot {lotNumber} (Lakeview)
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="px-4 py-2">
          <h3 className="text-lg font-bold mb-4 px-1">Basic Information</h3>

          {/* Lot Number */}
          <div className="flex flex-col gap-1 mb-5">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 pl-1">
              Lot Number/Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                className="w-full h-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark px-4 pr-12 text-base focus:border-primary focus:ring-primary shadow-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                <Icon name="edit" />
              </div>
            </div>
          </div>

          {/* Lot Type */}
          <div className="flex flex-col gap-1 mb-5">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 pl-1">
              Lot Type
            </label>
            <div className="relative">
              <select
                value={lotType}
                onChange={(e) => setLotType(e.target.value)}
                className="w-full h-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark px-4 pr-12 text-base focus:border-primary focus:ring-primary shadow-sm appearance-none"
              >
                <option value="rv">RV Spot</option>
                <option value="tent">Tent Site</option>
                <option value="cabin">Cabin</option>
                <option value="glamping">Glamping Pod</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                <Icon name="expand_more" />
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1 mb-5">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 pl-1">
              Lot-Specific Pricing{' '}
              <span className="text-gray-400 text-xs font-normal ml-1">
                (per night)
              </span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                $
              </div>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark pl-9 pr-12 text-base focus:border-primary focus:ring-primary shadow-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                <Icon name="payments" />
              </div>
            </div>
          </div>

          {/* Max Capacity */}
          <div className="flex items-center gap-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl px-4 h-16 justify-between mb-2 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background-light dark:bg-background-dark text-primary">
                <Icon name="groups" />
              </div>
              <p className="text-base font-medium">Max Capacity</p>
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMaxCapacity(Math.max(1, maxCapacity - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-background-light dark:bg-gray-700 hover:bg-primary hover:text-black transition-colors border border-gray-200 dark:border-transparent"
                >
                  <Icon name="remove" className="text-lg" />
                </button>
                <span className="text-lg font-bold w-6 text-center">
                  {maxCapacity}
                </span>
                <button
                  onClick={() => setMaxCapacity(maxCapacity + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-background-light dark:bg-gray-700 hover:bg-primary hover:text-black transition-colors border border-gray-200 dark:border-transparent"
                >
                  <Icon name="add" className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 w-[90%] mx-auto my-4" />

        {/* Amenities */}
        <div className="px-4 py-2">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-lg font-bold">Amenities</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Select all that apply
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {amenities.map(({ icon, label, checked }) => (
              <button
                key={label}
                onClick={() => toggleAmenity(label)}
                className={cn(
                  'relative flex items-center gap-3 p-3 rounded-xl border transition-all',
                  checked
                    ? 'bg-primary/10 border-primary shadow-[0_0_0_1px_rgba(19,236,91,1)]'
                    : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full transition-colors',
                    checked
                      ? 'bg-primary text-black'
                      : 'bg-background-light dark:bg-background-dark text-gray-500'
                  )}
                >
                  <Icon name={icon} />
                </div>
                <span className="text-sm font-medium">{label}</span>
                {checked && (
                  <Icon
                    name="check_circle"
                    className="absolute right-3 text-primary text-xl"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 w-[90%] mx-auto my-4" />

        {/* Availability Toggle */}
        <div className="px-4 py-2 mb-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon name="calendar_month" className="text-primary" />
                <p className="text-base font-bold">Currently Available</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 pl-8">
                Make this lot visible for bookings
              </p>
            </div>
            <Toggle checked={isAvailable} onChange={setIsAvailable} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full p-4 pb-6 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 z-30">
        <div className="flex gap-3 max-w-xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 h-14 rounded-full bg-transparent border border-gray-200 dark:border-gray-700 font-bold text-base hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 h-14 rounded-full bg-primary text-black font-bold text-base shadow-lg shadow-green-500/20 hover:brightness-105 transition-all active:scale-[0.98]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
