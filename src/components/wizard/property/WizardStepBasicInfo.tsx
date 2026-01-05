import { useState } from 'react'
import { usePropertyWizard } from '@/context/PropertyWizardContext'
import Icon from '@/components/ui/Icon'
import MapView from '@/components/ui/MapView'
import ImageUpload from '@/components/ui/ImageUpload'

const IRISH_COUNTIES = [
  'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Derry', 'Donegal',
  'Down', 'Dublin', 'Fermanagh', 'Galway', 'Kerry', 'Kildare', 'Kilkenny',
  'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath',
  'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Tyrone',
  'Waterford', 'Westmeath', 'Wexford', 'Wicklow',
]

export function WizardStepBasicInfo() {
  const { state, dispatch } = usePropertyWizard()
  const [isLocating, setIsLocating] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === 'name' || name === 'description') {
      dispatch({
        type: 'UPDATE_BASIC_INFO',
        name: name === 'name' ? value : state.name,
        description: name === 'description' ? value : state.description,
      })
    }
  }

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    dispatch({
      type: 'UPDATE_LOCATION',
      address: name === 'address' ? value : state.address,
      county: name === 'county' ? value : state.county,
      lat: state.lat ?? 53.3498,
      lng: state.lng ?? -6.2603,
    })
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch({
          type: 'UPDATE_LOCATION',
          address: state.address,
          county: state.county,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLocating(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        setIsLocating(false)
        alert('Unable to get your location. Please enter coordinates manually.')
      }
    )
  }

  const handleMapClick = (lat: number, lng: number) => {
    dispatch({
      type: 'UPDATE_LOCATION',
      address: state.address,
      county: state.county,
      lat,
      lng,
    })
  }

  const handleCoordChange = (coord: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      dispatch({
        type: 'UPDATE_LOCATION',
        address: state.address,
        county: state.county,
        lat: coord === 'lat' ? numValue : (state.lat ?? 53.3498),
        lng: coord === 'lng' ? numValue : (state.lng ?? -6.2603),
      })
    }
  }

  const handleImagesChange = (images: string[]) => {
    dispatch({ type: 'UPDATE_IMAGES', images })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          Basic Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about your property
        </p>
      </div>

      {/* Property Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Property Name *
        </label>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="e.g., Lakeside Camping Retreat"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          minLength={3}
          maxLength={100}
        />
        <p className="mt-1 text-xs text-gray-500">
          {state.name.length}/100 characters (minimum 3)
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={state.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe what makes your property special..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          maxLength={2000}
        />
        <p className="mt-1 text-xs text-gray-500">
          {state.description.length}/2000 characters
        </p>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address *
        </label>
        <input
          type="text"
          name="address"
          value={state.address}
          onChange={handleLocationChange}
          placeholder="e.g., Lakeside Road, Glendalough"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* County */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          County *
        </label>
        <select
          name="county"
          value={state.county}
          onChange={handleLocationChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select county...</option>
          {IRISH_COUNTIES.map((county) => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          GPS Location *
        </label>

        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isLocating}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Icon name="near_me" size={16} />
            {isLocating ? 'Locating...' : 'Use my location'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={state.lat ?? ''}
              onChange={(e) => handleCoordChange('lat', e.target.value)}
              placeholder="53.3498"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={state.lng ?? ''}
              onChange={(e) => handleCoordChange('lng', e.target.value)}
              placeholder="-6.2603"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
            />
          </div>
        </div>

        {/* Map Preview */}
        {state.lat !== null && state.lng !== null && (
          <div className="h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <MapView
              center={[state.lat, state.lng]}
              zoom={13}
              markers={[
                {
                  id: 'property-location',
                  position: [state.lat, state.lng],
                  name: state.name || 'Your property',
                  type: 'campsite' as const,
                },
              ]}
              onMapClick={handleMapClick}
              className="h-full w-full"
            />
          </div>
        )}
        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <Icon name="location_on" size={12} />
          Click on the map to adjust the pin location
        </p>
      </div>

      {/* Property Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Property Photos
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Add high-quality photos to showcase your property. Great photos help attract more guests!
        </p>
        <ImageUpload
          images={state.images}
          onChange={handleImagesChange}
          maxImages={10}
        />
      </div>
    </div>
  )
}

export default WizardStepBasicInfo
