import { useState, useEffect } from 'react'
import { useCampsiteWizard } from '../../context/CampsiteWizardContext'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Input from '../ui/Input'

export default function WizardStepPhotos() {
  const { state, dispatch, prevStep } = useCampsiteWizard()
  const [images, setImages] = useState<string[]>(state.images)
  const [newImageUrl, setNewImageUrl] = useState('')

  // Update context when values change
  useEffect(() => {
    dispatch({ type: 'UPDATE_IMAGES', images })
  }, [images, dispatch])

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
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Add photos of your campsite
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Great photos help attract guests. Add URLs to your best images.
          </p>
        </div>

        {/* Add image URL */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL (https://...)"
              onKeyDown={(e) => e.key === 'Enter' && addImage()}
            />
          </div>
          <Button onClick={addImage} disabled={!newImageUrl.trim()}>
            Add
          </Button>
        </div>

        {/* Image preview grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
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
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
            <Icon name="add_photo_alternate" size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              No photos added yet
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Add image URLs above to showcase your campsite
            </p>
          </div>
        )}

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          <h3 className="font-medium text-slate-900 dark:text-white mb-2">Photo Tips</h3>
          <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
            <li>• Use high-quality, well-lit photos</li>
            <li>• Show different areas of your campsite</li>
            <li>• Include scenic views and amenities</li>
            <li>• The first photo will be your cover image</li>
          </ul>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 p-4 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={prevStep}>
            Back
          </Button>
          <Button className="flex-1" onClick={handleNext}>
            Next: Add a Lot
          </Button>
        </div>
      </div>
    </div>
  )
}
