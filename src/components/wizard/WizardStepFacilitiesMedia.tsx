import { useState, useEffect } from 'react'
import { useCampsiteWizard } from '../../context/CampsiteWizardContext'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Input from '../ui/Input'
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

export default function WizardStepFacilitiesMedia() {
  const { state, dispatch, prevStep } = useCampsiteWizard()

  // Facilities state
  const [selected, setSelected] = useState<Facility[]>(state.facilities)

  // Photos state
  const [images, setImages] = useState<string[]>(state.images)
  const [newImageUrl, setNewImageUrl] = useState('')

  // Update context when facilities change
  useEffect(() => {
    dispatch({ type: 'UPDATE_FACILITIES', facilities: selected })
  }, [selected, dispatch])

  // Update context when images change
  useEffect(() => {
    dispatch({ type: 'UPDATE_IMAGES', images })
  }, [images, dispatch])

  const toggleFacility = (facility: Facility) => {
    setSelected((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    )
  }

  const addImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    dispatch({ type: 'NEXT_STEP' })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        {/* Section Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Facilities & Media
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Select amenities and add photos to attract guests.
          </p>
        </div>

        {/* === Facilities Section === */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            What facilities do you offer?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {FACILITIES.map((facility) => {
              const isSelected = selected.includes(facility.id)
              return (
                <button
                  key={facility.id}
                  type="button"
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
              {selected.length} {selected.length === 1 ? 'facility' : 'facilities'} selected
            </p>
          )}
        </div>

        {/* === Visual Separator === */}
        <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

        {/* === Photos Section === */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Photos
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Great photos help attract guests. Add URLs to your best images.
          </p>

          {/* Add image URL */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL (https://...)"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              />
            </div>
            <Button type="button" onClick={addImage} disabled={!newImageUrl.trim()}>
              Add
            </Button>
          </div>

          {/* Image preview grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {images.map((url, index) => (
                <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img
                    src={url}
                    alt={`Campsite photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Invalid+Image'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 size-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                  >
                    <Icon name="close" size={18} className="text-white" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-slate-900 text-xs font-bold rounded">
                      Cover Photo
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center mt-4">
              <Icon name="add_photo_alternate" size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No photos added yet
              </p>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mt-4">
            <h4 className="font-medium text-slate-900 dark:text-white mb-2 text-sm">Photo Tips</h4>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <li>• Use high-quality, well-lit photos</li>
              <li>• Show different areas of your campsite</li>
              <li>• The first photo will be your cover image</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 p-4 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={prevStep}>
            Back
          </Button>
          <Button className="flex-1" onClick={handleNext}>
            Next: Add Accommodation
          </Button>
        </div>
      </div>
    </div>
  )
}
