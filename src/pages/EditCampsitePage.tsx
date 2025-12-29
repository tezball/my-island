import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Button, Toggle } from '@/components/ui'
import { cn } from '@/utils/cn'

// Edit Campsite Page - from design
const FACILITIES = [
  { icon: 'wifi', label: 'WiFi', checked: false },
  { icon: 'shower', label: 'Showers', checked: true },
  { icon: 'pets', label: 'Pet Friendly', checked: false },
  { icon: 'local_fire_department', label: 'Fire Pit', checked: false },
  { icon: 'water_drop', label: 'Potable Water', checked: false },
  { icon: 'electric_bolt', label: 'Power', checked: false },
]

export function EditCampsitePage() {
  const navigate = useNavigate()

  const [campsiteName, setCampsiteName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [facilities, setFacilities] = useState(FACILITIES)

  const toggleFacility = (label: string) => {
    setFacilities((prev) =>
      prev.map((f) => (f.label === label ? { ...f, checked: !f.checked } : f))
    )
  }

  const handleSave = () => {
    // Would save via API
    navigate('/owner')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors"
        >
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-center">
          Edit Campsite
        </h1>
        <button
          onClick={handleSave}
          className="text-primary font-bold text-base hover:text-green-600 transition-colors"
        >
          Save
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Photos Section */}
        <section className="mt-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-lg font-bold">Photos</h2>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              0/5
            </span>
          </div>
          <div className="flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar snap-x">
            {/* Add Photo Button */}
            <button className="flex-none w-32 h-32 flex flex-col items-center justify-center gap-2 bg-gray-100 dark:bg-surface-dark rounded-xl border-2 border-dashed border-primary/40 hover:border-primary transition-colors snap-start">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Icon name="add_a_photo" />
              </div>
              <span className="text-xs font-semibold text-primary">Add Photo</span>
            </button>

            {/* Example Photos */}
            <div className="flex-none w-32 h-32 relative group snap-start">
              <div
                className="w-full h-full bg-center bg-cover rounded-xl shadow-sm"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200")',
                }}
              />
              <button className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <Icon name="close" className="text-sm" />
              </button>
            </div>
          </div>
        </section>

        {/* Basic Info Section */}
        <section className="px-4 mt-4 space-y-5">
          <h2 className="text-lg font-bold">Basic Info</h2>
          <div className="space-y-4">
            {/* Campsite Name */}
            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1"
                htmlFor="campsite-name"
              >
                Campsite Name
              </label>
              <input
                id="campsite-name"
                type="text"
                value={campsiteName}
                onChange={(e) => setCampsiteName(e.target.value)}
                placeholder="e.g. Whispering Pines"
                className="w-full bg-gray-100 dark:bg-surface-dark border-transparent focus:border-primary focus:ring-primary rounded-xl px-4 py-3 placeholder-gray-400 font-medium"
              />
            </div>

            {/* Price */}
            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1"
                htmlFor="price"
              >
                Price per night
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-gray-500 font-semibold">$</span>
                </div>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="block w-full rounded-xl border-transparent bg-gray-100 dark:bg-surface-dark py-3 pl-8 pr-12 focus:border-primary focus:ring-primary placeholder-gray-400 font-medium"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="text-gray-500 text-sm">USD</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                placeholder="Tell guests what makes your site unique..."
                rows={4}
                className="w-full bg-gray-100 dark:bg-surface-dark border-transparent focus:border-primary focus:ring-primary rounded-xl px-4 py-3 placeholder-gray-400 resize-none"
              />
              <div className="text-right text-xs text-gray-500 mt-1 mr-1">
                {description.length}/500
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="px-4 mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Location</h2>
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:text-green-600 transition-colors">
              <Icon name="my_location" className="text-lg" />
              Use Current
            </button>
          </div>
          <div className="bg-gray-100 dark:bg-surface-dark rounded-xl p-1 shadow-sm overflow-hidden">
            <div className="relative w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer">
              {/* Map Placeholder */}
              <div
                className="w-full h-full bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400")',
                }}
              />
              {/* Pin Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon
                  name="location_on"
                  className="text-4xl text-primary drop-shadow-md animate-bounce"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/80 px-2 py-1 rounded text-xs font-semibold shadow-sm backdrop-blur-sm">
                Edit on Map
              </div>
            </div>
            <div className="p-3">
              <div className="relative">
                <span className="absolute top-3.5 left-0 text-gray-500 text-xl">
                  <Icon name="search" />
                </span>
                <input
                  type="text"
                  placeholder="Enter address or coordinates"
                  className="w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 pl-8 pr-2 py-3 placeholder-gray-400 text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="px-4 mt-8 mb-6">
          <h2 className="text-lg font-bold mb-4">What does this site offer?</h2>
          <div className="grid grid-cols-2 gap-3">
            {facilities.map(({ icon, label, checked }) => (
              <button
                key={label}
                onClick={() => toggleFacility(label)}
                className={cn(
                  'relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                  checked
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-transparent bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-800'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full transition-colors',
                    checked
                      ? 'bg-primary/20 text-primary'
                      : 'bg-white dark:bg-gray-700 text-gray-500'
                  )}
                >
                  <Icon name={icon} className="text-xl" />
                </div>
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    checked ? 'text-primary' : ''
                  )}
                >
                  {label}
                </span>
                {checked && (
                  <div className="absolute top-3 right-3 text-primary">
                    <Icon name="check" className="text-lg font-bold" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 max-w-md mx-auto z-40">
        <Button
          className="w-full h-14"
          size="lg"
          onClick={handleSave}
          leftIcon="save"
        >
          Save Listing
        </Button>
      </div>
    </div>
  )
}
