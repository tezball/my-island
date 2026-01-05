import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../context/ToastContext'
import { ownerApi, type CampsiteResponse } from '../../lib/api/owner'
import { extrasApi, type ExtraResponse } from '../../lib/api/extras'

export default function ExtraFormPage() {
  const { extraId } = useParams<{ extraId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEditing = !!extraId

  const [campsites, setCampsites] = useState<CampsiteResponse[]>([])
  const [existingExtra, setExistingExtra] = useState<ExtraResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [campsiteId, setCampsiteId] = useState(searchParams.get('campsiteId') || '')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [perNight, setPerNight] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch campsites for the dropdown
        const campsitesData = await ownerApi.getMyCampsites()
        setCampsites(campsitesData)

        // Set default campsite if not already set
        if (!campsiteId && campsitesData.length > 0) {
          setCampsiteId(campsitesData[0].id)
        }

        // If editing, fetch the extra
        if (extraId) {
          const extra = await extrasApi.getOwnerExtra(extraId)
          setExistingExtra(extra)
          setCampsiteId(extra.campsiteId)
          setName(extra.name)
          setDescription(extra.description || '')
          setPrice(extra.price.toString())
          setPerNight(extra.perNight)
          setImageUrl(extra.imageUrl || '')
          setIsAvailable(extra.available)
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
        toast.error('Error', 'Failed to load data. Please try again.')
        navigate('/owner/extras')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [extraId])

  const handleSave = async () => {
    if (!name.trim() || !price || !campsiteId) return

    setIsSaving(true)
    try {
      if (isEditing && extraId) {
        await extrasApi.updateExtra(extraId, {
          name: name.trim(),
          description: description.trim() || undefined,
          price: parseFloat(price),
          perNight,
          imageUrl: imageUrl.trim() || undefined,
          available: isAvailable,
        })
        toast.success('Extra updated', `"${name}" has been updated.`)
      } else {
        await extrasApi.createExtra({
          campsiteId,
          name: name.trim(),
          description: description.trim() || undefined,
          price: parseFloat(price),
          perNight,
          imageUrl: imageUrl.trim() || undefined,
          available: isAvailable,
        })
        toast.success('Extra created', `"${name}" has been added.`)
      }
      navigate('/owner/extras')
    } catch (err) {
      console.error('Failed to save extra:', err)
      toast.error('Error', 'Failed to save extra. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (existingExtra) {
      setCampsiteId(existingExtra.campsiteId)
      setName(existingExtra.name)
      setDescription(existingExtra.description || '')
      setPrice(existingExtra.price.toString())
      setPerNight(existingExtra.perNight)
      setImageUrl(existingExtra.imageUrl || '')
      setIsAvailable(existingExtra.available)
    } else {
      setName('')
      setDescription('')
      setPrice('')
      setPerNight(false)
      setImageUrl('')
      setIsAvailable(true)
    }
  }

  if (isLoading) {
    return (
      <AppShell showBack headerTitle={isEditing ? 'Edit Extra' : 'Add New Extra'} showNav={false}>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      showBack
      headerTitle={isEditing ? 'Edit Extra' : 'Add New Extra'}
      showNav={false}
      headerRightAction={
        <button onClick={handleReset} className="text-primary font-medium text-sm">
          Reset
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Campsite Selection */}
        <div className="p-4 space-y-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Campsite
          </h3>

          {campsites.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Select Campsite
              </label>
              <select
                value={campsiteId}
                onChange={(e) => setCampsiteId(e.target.value)}
                disabled={isEditing}
                className={`w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white ${
                  isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {campsites.map(campsite => (
                  <option key={campsite.id} value={campsite.id}>
                    {campsite.name}
                  </option>
                ))}
              </select>
              {isEditing && (
                <p className="text-xs text-slate-400 mt-1">
                  Campsite cannot be changed after creation
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                You need to create a campsite first before adding extras.
              </p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Details
          </h3>

          <Input
            label="Extra Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Firewood Bundle, Bike Rental, Breakfast"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what's included with this extra..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Pricing
          </h3>

          <Input
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="e.g., 15.00"
            leftIcon="euro"
          />

          <Toggle
            checked={perNight}
            onChange={setPerNight}
            label="Charge per night"
            description={perNight
              ? "Price is multiplied by the number of nights"
              : "One-time charge regardless of stay length"
            }
          />
        </div>

        {/* Image */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Image (optional)
          </h3>

          <Input
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            leftIcon="image"
          />

          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-24 h-24 rounded-xl object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Status */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Toggle
            checked={isAvailable}
            onChange={setIsAvailable}
            label="Make available for booking"
            description="This extra will be visible to guests in the booking flow"
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
            onClick={() => navigate('/owner/extras')}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!name.trim() || !price || !campsiteId || campsites.length === 0}
            isLoading={isSaving}
            onClick={handleSave}
            leftIcon="save"
          >
            {isEditing ? 'Save Changes' : 'Add Extra'}
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
