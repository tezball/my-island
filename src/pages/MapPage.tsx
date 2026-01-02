import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import MapView from '../components/ui/MapView'
import Icon from '../components/ui/Icon'
import { campsitesApi, type CampsiteResponse } from '../lib/api/campsites'

export default function MapPage() {
  const navigate = useNavigate()
  const [campsites, setCampsites] = useState<CampsiteResponse[]>([])
  const [selectedCampsite, setSelectedCampsite] = useState<CampsiteResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCampsites() {
      try {
        const response = await campsitesApi.searchPaged({})
        setCampsites(response.content)
      } catch (error) {
        console.error('Failed to fetch campsites:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampsites()
  }, [])

  const markers = campsites.map((campsite) => ({
    id: campsite.id,
    position: [campsite.location.lat, campsite.location.lng] as [number, number],
    price: campsite.priceFrom,
    name: campsite.name,
  }))

  const handleMarkerClick = (id: string) => {
    const campsite = campsites.find((c) => c.id === id)
    if (campsite) {
      setSelectedCampsite(campsite)
    }
  }

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Map" showNav={false}>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell showBack headerTitle="Explore Map" showNav={false}>
      <div className="flex-1 flex flex-col relative">
        {/* Map */}
        <div className="flex-1">
          <MapView
            center={[53.5, -8]}
            zoom={7}
            markers={markers}
            onMarkerClick={handleMarkerClick}
            height="100%"
            className="rounded-none"
          />
        </div>

        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-4 right-4">
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <Icon name="search" size={20} className="text-slate-400" />
            <span className="text-slate-500">Search campsites...</span>
          </button>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => navigate('/search')}
          className="absolute top-4 right-4 p-3 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hidden"
        >
          <Icon name="tune" size={20} className="text-slate-600 dark:text-slate-300" />
        </button>

        {/* Selected Campsite Card */}
        {selectedCampsite && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setSelectedCampsite(null)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-black/50 rounded-full text-white"
              >
                <Icon name="close" size={16} />
              </button>
              <div
                className="flex gap-3 p-3 cursor-pointer"
                onClick={() => navigate(`/campsite/${selectedCampsite.id}`)}
              >
                <img
                  src={selectedCampsite.images[0]}
                  alt={selectedCampsite.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1 py-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {selectedCampsite.name}
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Icon name="location_on" size={14} />
                    {selectedCampsite.location.county}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon name="star" size={14} className="text-amber-400" filled />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {selectedCampsite.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-400">
                      ({selectedCampsite.reviewCount})
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="font-bold text-primary">
                      €{selectedCampsite.priceFrom}
                    </span>
                    <span className="text-slate-500 text-sm">/night</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campsite Count */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          {!selectedCampsite && (
            <div className="px-4 py-2 bg-slate-900/80 dark:bg-white/90 text-white dark:text-slate-900 rounded-full text-sm font-medium backdrop-blur-sm">
              {campsites.length} campsites
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
