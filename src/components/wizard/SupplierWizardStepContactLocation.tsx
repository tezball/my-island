import { useState } from 'react'
import { useSupplierWizard } from '../../context/SupplierWizardContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Icon from '../ui/Icon'
import MapView from '../ui/MapView'

interface SupplierWizardStepContactLocationProps {
  onSubmit: () => void
  isSubmitting: boolean
}

export default function SupplierWizardStepContactLocation({
  onSubmit,
  isSubmitting,
}: SupplierWizardStepContactLocationProps) {
  const { state, dispatch, prevStep, canProceed } = useSupplierWizard()

  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const updateField = (updates: Partial<{
    location: string
    contactEmail: string
    phoneNumber: string
    eircode: string
    latitude: number | null
    longitude: number | null
  }>) => {
    dispatch({
      type: 'UPDATE_CONTACT_LOCATION',
      location: updates.location ?? state.location,
      contactEmail: updates.contactEmail ?? state.contactEmail,
      phoneNumber: updates.phoneNumber ?? state.phoneNumber,
      eircode: updates.eircode ?? state.eircode,
      latitude: updates.latitude !== undefined ? updates.latitude : state.latitude,
      longitude: updates.longitude !== undefined ? updates.longitude : state.longitude,
    })
  }

  const handleSubmit = () => {
    if (canProceed()) {
      onSubmit()
    }
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    setIsLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateField({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setIsLocating(false)
      },
      (error) => {
        setIsLocating(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable it in your browser settings.')
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.')
            break
          case error.TIMEOUT:
            setLocationError('Location request timed out.')
            break
          default:
            setLocationError('An error occurred getting your location.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const clearLocation = () => {
    updateField({ latitude: null, longitude: null })
    setLocationError(null)
  }

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contactEmail)

  const mapMarkers =
    state.latitude !== null && state.longitude !== null
      ? [
          {
            id: 'supplier-location',
            position: [state.latitude, state.longitude] as [number, number],
            name: state.location || 'Your Business',
            type: 'campsite' as const,
          },
        ]
      : []

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        {/* Section Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Contact & Location
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Let customers know how to reach you and where to find you.
          </p>
        </div>

        {/* Business Address */}
        <Input
          label="Business Address"
          value={state.location}
          onChange={(e) => updateField({ location: e.target.value.slice(0, 255) })}
          placeholder="e.g., Main Street, Clifden, Co. Galway"
          helperText="Enter your full business address"
        />

        {/* Eircode */}
        <Input
          label="Eircode"
          value={state.eircode}
          onChange={(e) => updateField({ eircode: e.target.value.toUpperCase().slice(0, 10) })}
          placeholder="e.g., D02 X285"
          helperText="Irish postal code (optional but recommended)"
        />

        {/* Contact Email */}
        <div>
          <Input
            label="Contact Email"
            type="email"
            value={state.contactEmail}
            onChange={(e) => updateField({ contactEmail: e.target.value.slice(0, 255) })}
            placeholder="e.g., info@yourbusiness.ie"
            helperText="This email will be visible to customers"
          />
          {state.contactEmail && !isEmailValid && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <Icon name="error" size={14} />
              Please enter a valid email address
            </p>
          )}
        </div>

        {/* Phone Number */}
        <Input
          label="Phone Number (optional)"
          type="tel"
          value={state.phoneNumber}
          onChange={(e) => updateField({ phoneNumber: e.target.value.slice(0, 50) })}
          placeholder="e.g., +353 91 123 456"
          helperText="Customers may call you directly"
        />

        {/* GPS Location Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Map Location (optional)
            </label>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Add your location to appear on the map for nearby campers
            </p>
          </div>

          {/* Use My Location Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleUseMyLocation}
              disabled={isLocating}
            >
              {isLocating ? (
                <>
                  <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  Locating...
                </>
              ) : (
                <>
                  <Icon name="my_location" size={18} className="mr-2" />
                  Use My Location
                </>
              )}
            </Button>
            {(state.latitude !== null || state.longitude !== null) && (
              <Button
                type="button"
                variant="outline"
                onClick={clearLocation}
                className="px-3"
              >
                <Icon name="close" size={18} />
              </Button>
            )}
          </div>

          {locationError && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <Icon name="error" size={14} />
              {locationError}
            </p>
          )}

          {/* Manual Coordinate Entry */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Latitude"
              type="number"
              step="0.000001"
              value={state.latitude?.toString() || ''}
              onChange={(e) =>
                updateField({ latitude: e.target.value ? parseFloat(e.target.value) : null })
              }
              placeholder="e.g., 53.489"
            />
            <Input
              label="Longitude"
              type="number"
              step="0.000001"
              value={state.longitude?.toString() || ''}
              onChange={(e) =>
                updateField({ longitude: e.target.value ? parseFloat(e.target.value) : null })
              }
              placeholder="e.g., -10.019"
            />
          </div>

          {/* Map Preview */}
          {(state.latitude !== null && state.longitude !== null) && (
            <div className="h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <MapView
                center={[state.latitude, state.longitude]}
                zoom={14}
                markers={mapMarkers}
                onMarkerClick={() => {}}
                height="100%"
              />
            </div>
          )}
          {state.latitude === null && state.longitude === null && (
            <div className="h-32 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <div className="text-center text-slate-400">
                <Icon name="map" size={32} className="mx-auto mb-2" />
                <p className="text-sm">No location set</p>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Icon
              name="info"
              size={20}
              className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                What happens next?
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                After registration, you'll be able to access your supplier dashboard to add
                a logo, create special offers, and manage your business profile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 p-4 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 space-y-3">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!canProceed() || isSubmitting}
          isLoading={isSubmitting}
        >
          Complete Registration
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={prevStep}
          disabled={isSubmitting}
        >
          Back
        </Button>
      </div>
    </div>
  )
}
