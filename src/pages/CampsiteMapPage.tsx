import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import MapView from '../components/ui/MapView'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { campsitesApi } from '../lib/api/campsites'

interface CampsiteInfo {
  id: string
  name: string
  location: {
    address: string
    county: string
    lat: number
    lng: number
  }
  images: string[]
  priceFrom: number
}

export default function CampsiteMapPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [campsite, setCampsite] = useState<CampsiteInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCampsite() {
      if (!id) return

      try {
        const data = await campsitesApi.getById(id)
        setCampsite({
          id: data.id,
          name: data.name,
          location: data.location,
          images: data.images,
          priceFrom: data.priceFrom,
        })
      } catch (error) {
        console.error('Failed to fetch campsite:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampsite()
  }, [id])

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Location" showNav={false}>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      </AppShell>
    )
  }

  if (!campsite) {
    return (
      <AppShell showBack headerTitle="Location" showNav={false}>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Campsite not found</p>
        </div>
      </AppShell>
    )
  }

  const markers = [
    {
      id: campsite.id,
      position: [campsite.location.lat, campsite.location.lng] as [number, number],
      price: campsite.priceFrom,
      name: campsite.name,
      type: 'campsite' as const,
    },
  ]

  const openInMaps = () => {
    const { lat, lng } = campsite.location
    const encodedName = encodeURIComponent(campsite.name)
    // Try Apple Maps on iOS, Google Maps otherwise
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const url = isIOS
      ? `maps://maps.apple.com/?q=${encodedName}&ll=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    window.open(url, '_blank')
  }

  return (
    <AppShell showBack headerTitle="Location" showNav={false}>
      <div className="flex-1 flex flex-col">
        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            center={[campsite.location.lat, campsite.location.lng]}
            zoom={14}
            markers={markers}
            height="100%"
            className="rounded-none"
          />
        </div>

        {/* Bottom Info Card */}
        <div className="bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4">
          <div className="flex items-start gap-3 mb-4">
            <img
              src={campsite.images[0]}
              alt={campsite.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h2 className="font-bold text-slate-900 dark:text-white">
                {campsite.name}
              </h2>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Icon name="location_on" size={14} />
                {campsite.location.address}
              </p>
              <p className="text-sm text-slate-400">
                {campsite.location.county}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              leftIcon="directions"
              onClick={openInMaps}
            >
              Get Directions
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              leftIcon="calendar_today"
              onClick={() => navigate(`/book/${id}`)}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
