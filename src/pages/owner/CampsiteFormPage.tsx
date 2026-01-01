import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Icon from '../../components/ui/Icon'
import { getCampsiteById } from '../../data/mockData'
import type { Facility } from '../../data/types'

const facilities: { id: Facility; label: string; icon: string }[] = [
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'shower', label: 'Showers', icon: 'shower' },
  { id: 'pets', label: 'Pet Friendly', icon: 'pets' },
  { id: 'electric', label: 'Power', icon: 'electrical_services' },
  { id: 'water', label: 'Potable Water', icon: 'water_drop' },
  { id: 'toilet', label: 'Toilets', icon: 'wc' },
  { id: 'laundry', label: 'Laundry', icon: 'local_laundry_service' },
  { id: 'shop', label: 'Shop', icon: 'storefront' },
  { id: 'restaurant', label: 'Restaurant', icon: 'restaurant' },
  { id: 'playground', label: 'Playground', icon: 'attractions' },
  { id: 'beach', label: 'Beach Access', icon: 'beach_access' },
  { id: 'hiking', label: 'Hiking', icon: 'hiking' },
]

export default function CampsiteFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const campsite = getCampsiteById(id || '')

  const [name, setName] = useState(campsite?.name || '')
  const [description, setDescription] = useState(campsite?.description || '')
  const [price, setPrice] = useState(campsite?.pricePerNight.toString() || '')
  const [address, setAddress] = useState(campsite?.location.address || '')
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>(
    campsite?.facilities || []
  )
  const [isSaving, setIsSaving] = useState(false)

  if (!campsite) {
    return (
      <AppShell showBack headerTitle="Edit Campsite">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Campsite not found</p>
        </div>
      </AppShell>
    )
  }

  const toggleFacility = (facility: Facility) => {
    setSelectedFacilities(prev =>
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    )
  }

  const handleSave = async () => {
    if (!name.trim()) return

    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    navigate('/owner')
  }

  return (
    <AppShell
      showBack
      headerTitle="Edit Campsite"
      showNav={false}
      headerRightAction={
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-primary font-medium text-sm"
        >
          Save
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Photos */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Photos
          </h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {campsite.images.map((img, i) => (
              <div key={i} className="relative shrink-0">
                <img
                  src={img}
                  alt=""
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <button className="absolute -top-1 -right-1 size-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <Icon name="close" size={14} />
                </button>
              </div>
            ))}
            <button className="shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors">
              <Icon name="add" size={24} className="text-slate-400" />
              <span className="text-xs text-slate-400">Add</span>
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Basic Info
          </h3>

          <Input
            label="Campsite Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Whispering Pines"
          />

          <Input
            label="Price per Night"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="e.g., 45.00"
            leftIcon="euro"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="Tell guests what makes your site unique..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {description.length}/500
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Location
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
              <Icon name="my_location" size={18} />
              Use Current
            </button>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl h-32 flex items-center justify-center mb-3">
            <div className="text-center">
              <Icon name="map" size={32} className="text-slate-400 mx-auto mb-1" />
              <button className="text-primary text-sm font-medium">Edit on Map</button>
            </div>
          </div>

          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address or coordinates"
            leftIcon="location_on"
          />
        </div>

        {/* Facilities */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            What does this site offer?
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {facilities.map(facility => (
              <button
                key={facility.id}
                type="button"
                onClick={() => toggleFacility(facility.id)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-colors ${
                  selectedFacilities.includes(facility.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon
                  name={facility.icon}
                  size={24}
                  className={selectedFacilities.includes(facility.id) ? 'text-primary' : 'text-slate-400'}
                />
                <span className={`text-xs font-medium ${
                  selectedFacilities.includes(facility.id)
                    ? 'text-primary'
                    : 'text-slate-500'
                }`}>
                  {facility.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-32" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button
          className="w-full"
          disabled={!name.trim()}
          isLoading={isSaving}
          onClick={handleSave}
          leftIcon="save"
        >
          Save Listing
        </Button>
      </div>
    </AppShell>
  )
}
