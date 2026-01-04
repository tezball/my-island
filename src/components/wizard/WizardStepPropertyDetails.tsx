import { useState, useEffect } from 'react'
import { useCampsiteWizard } from '../../context/CampsiteWizardContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Icon from '../ui/Icon'
import MapView from '../ui/MapView'

const IRISH_COUNTIES = [
  'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway',
  'Kerry', 'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick',
  'Longford', 'Louth', 'Mayo', 'Meath', 'Monaghan', 'Offaly',
  'Roscommon', 'Sligo', 'Tipperary', 'Waterford', 'Westmeath',
  'Wexford', 'Wicklow',
]

const DEFAULT_CENTER: [number, number] = [53.5, -8]

export default function WizardStepPropertyDetails() {
  const { state, dispatch, canProceed } = useCampsiteWizard()

  // Basic Info fields
  const [name, setName] = useState(state.name)
  const [description, setDescription] = useState(state.description)

  // Location fields
  const [address, setAddress] = useState(state.address)
  const [county, setCounty] = useState(state.county)
  const [lat, setLat] = useState<number | null>(state.lat)
  const [lng, setLng] = useState<number | null>(state.lng)

  // Geolocation state
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Get user's current location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    setIsLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
        setIsLocating(false)
      },
      (error) => {
        setIsLocating(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.')
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

  // Update context when basic info changes
  useEffect(() => {
    dispatch({ type: 'UPDATE_BASIC_INFO', name, description })
  }, [name, description, dispatch])

  // Update context when location changes
  useEffect(() => {
    if (lat !== null && lng !== null) {
      dispatch({ type: 'UPDATE_LOCATION', address, county, lat, lng })
    }
  }, [address, county, lat, lng, dispatch])

  const handleNext = () => {
    if (canProceed()) {
      dispatch({ type: 'NEXT_STEP' })
    }
  }

  const mapMarkers = lat !== null && lng !== null
    ? [{ id: 'location', position: [lat, lng] as [number, number], name: address || 'Selected Location', type: 'campsite' as const }]
    : []

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        {/* Section Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Tell us about your property
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Add basic details and location information.
          </p>
        </div>

        {/* === Basic Info Section === */}
        <Input
          label="Campsite Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Whispering Pines Campground"
          helperText="Choose a name that captures the essence of your location"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
            placeholder="Tell guests what makes your campsite special. Describe the scenery, atmosphere, and unique features..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{description.length}/2000</p>
        </div>

        {/* === Visual Separator === */}
        <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

        {/* === Location Section === */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Location
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Help guests find you by providing your location details.
          </p>
        </div>

        <Input
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g., Beach Road, Clifden"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            County
          </label>
          <select
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select a county</option>
            {IRISH_COUNTIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Map for pin location */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Pin Your Location
          </label>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            Click on the map or use your current location
          </p>

          {/* Use My Location Button */}
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 text-primary font-medium hover:bg-primary/10 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name={isLocating ? 'sync' : 'my_location'} size={20} className={isLocating ? 'animate-spin' : ''} />
            {isLocating ? 'Getting your location...' : 'Use my current location'}
          </button>

          {locationError && (
            <p className="text-sm text-red-500 mb-3 flex items-center gap-1">
              <Icon name="error" size={16} />
              {locationError}
            </p>
          )}

          <div className="h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <MapView
              center={lat && lng ? [lat, lng] : DEFAULT_CENTER}
              zoom={lat && lng ? 14 : 7}
              markers={mapMarkers}
              onMarkerClick={() => {}}
              onMapClick={(clickedLat, clickedLng) => {
                setLat(clickedLat)
                setLng(clickedLng)
              }}
              height="100%"
            />
          </div>
          {lat !== null && lng !== null && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
              📍 Location set: {lat.toFixed(6)}, {lng.toFixed(6)}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Input
              label="Latitude"
              type="number"
              step="0.000001"
              value={lat?.toString() || ''}
              onChange={(e) => setLat(e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="e.g., 53.489"
            />
            <Input
              label="Longitude"
              type="number"
              step="0.000001"
              value={lng?.toString() || ''}
              onChange={(e) => setLng(e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="e.g., -10.019"
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 p-4 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800">
        <Button className="w-full" onClick={handleNext} disabled={!canProceed()}>
          Next: Facilities & Media
        </Button>
      </div>
    </div>
  )
}
