import { useState, useEffect } from 'react'
import { useCampsiteWizard } from '../../context/CampsiteWizardContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import MapView from '../ui/MapView'

const IRISH_COUNTIES = [
  'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway',
  'Kerry', 'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick',
  'Longford', 'Louth', 'Mayo', 'Meath', 'Monaghan', 'Offaly',
  'Roscommon', 'Sligo', 'Tipperary', 'Waterford', 'Westmeath',
  'Wexford', 'Wicklow',
]

// Default center of Ireland
const DEFAULT_CENTER: [number, number] = [53.5, -8]

export default function WizardStepLocation() {
  const { state, dispatch, canProceed, prevStep } = useCampsiteWizard()
  const [address, setAddress] = useState(state.address)
  const [county, setCounty] = useState(state.county)
  const [lat, setLat] = useState<number | null>(state.lat)
  const [lng, setLng] = useState<number | null>(state.lng)

  // Update context when values change
  useEffect(() => {
    if (lat !== null && lng !== null) {
      dispatch({ type: 'UPDATE_LOCATION', address, county, lat, lng })
    }
  }, [address, county, lat, lng, dispatch])

  // const handleMapClick = (position: [number, number]) => {
  //   setLat(position[0])
  //   setLng(position[1])
  // }

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
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Where is your campsite?
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
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
            Click on the map to set your exact location
          </p>
          <div className="h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <MapView
              center={lat && lng ? [lat, lng] : DEFAULT_CENTER}
              zoom={lat && lng ? 14 : 7}
              markers={mapMarkers}
              onMarkerClick={() => {}}
              height="100%"
            />
          </div>
          {lat !== null && lng !== null && (
            <p className="text-sm text-slate-500 mt-2">
              Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            Note: Map clicking is simulated. Enter coordinates manually below for now.
          </p>
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
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={prevStep}>
            Back
          </Button>
          <Button className="flex-1" onClick={handleNext} disabled={!canProceed()}>
            Next: Facilities
          </Button>
        </div>
      </div>
    </div>
  )
}
