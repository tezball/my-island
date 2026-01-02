import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import CampsiteCard from '../components/ui/CampsiteCard'
import Icon from '../components/ui/Icon'
import MapView from '../components/ui/MapView'
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton'
import { campsitesApi, type CampsiteResponse } from '../lib/api/campsites'
import type { Campsite, Facility } from '../data/types'

type ViewMode = 'list' | 'map'

// Map API response to Campsite type
function mapToCampsite(data: CampsiteResponse): Campsite {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    location: data.location,
    images: data.images,
    rating: data.rating,
    reviewCount: data.reviewCount,
    pricePerNight: data.priceFrom,
    facilities: data.facilities.map(f => f.toLowerCase() as Facility),
    ownerId: data.ownerId,
    lots: [],
    featured: data.featured,
  }
}

export default function DiscoverPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isLoading, setIsLoading] = useState(true)
  const [campsites, setCampsites] = useState<Campsite[]>([])
  const [featured, setFeatured] = useState<Campsite[]>([])
  const navigate = useNavigate()

  // Fetch campsites from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [allCampsites, featuredCampsites] = await Promise.all([
          campsitesApi.search({}),
          campsitesApi.getFeatured(),
        ])
        setCampsites(allCampsites.map(mapToCampsite))
        setFeatured(featuredCampsites.map(mapToCampsite))
      } catch (error) {
        console.error('Failed to fetch campsites:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Prepare markers for map view
  const mapMarkers = campsites.map(campsite => ({
    id: campsite.id,
    position: [campsite.location.lat, campsite.location.lng] as [number, number],
    price: campsite.pricePerNight,
    name: campsite.name,
  }))

  return (
    <AppShell showLogo showHeader>
      <div className="flex-1 overflow-auto">
        {/* Hero Search */}
        <div className="px-4 py-6 bg-gradient-to-br from-primary/10 to-emerald-50 dark:from-primary/5 dark:to-slate-900">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Find your perfect campsite
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Explore Ireland's best camping destinations
          </p>
          <Link
            to="/search"
            className="flex items-center gap-3 bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <Icon name="search" size={20} className="text-slate-400" />
            <span className="text-slate-400">Where do you want to go?</span>
          </Link>

          {/* Quick filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-4 px-4">
            {['Near me', 'Beach', 'Mountains', 'Pet Friendly', 'Glamping'].map((filter) => (
              <button
                key={filter}
                className="flex-shrink-0 px-4 py-2 bg-white dark:bg-surface-dark rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-sm text-slate-500">
            {isLoading ? 'Loading...' : `${campsites.length} campsites`}
          </span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Icon name="view_list" size={18} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Icon name="map" size={18} />
            </button>
          </div>
        </div>

        {viewMode === 'map' ? (
          /* Map View */
          <div className="h-[calc(100vh-220px)]">
            <MapView
              center={[53.5, -8]}
              zoom={7}
              markers={mapMarkers}
              onMarkerClick={(id) => navigate(`/campsite/${id}`)}
              height="100%"
            />
          </div>
        ) : isLoading ? (
          /* Loading State */
          <div className="px-4 py-4 space-y-6">
            {/* Featured Section Skeleton */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <Skeleton variant="text" className="w-40 h-6" />
                <Skeleton variant="text" className="w-16 h-4" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-shrink-0 w-64">
                    <Skeleton variant="rectangular" height={160} className="rounded-xl mb-2" />
                    <Skeleton variant="text" className="w-3/4 h-5 mb-1" />
                    <Skeleton variant="text" className="w-1/2 h-4" />
                  </div>
                ))}
              </div>
            </section>

            {/* All Campsites Skeleton */}
            <section>
              <Skeleton variant="text" className="w-36 h-6 mb-3" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* List View */
          <div className="px-4 py-4 space-y-6">
            {/* Featured Section */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Featured Campsites
                </h2>
                <Link to="/search?featured=true" className="text-sm text-primary font-medium">
                  See all
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
                {featured.map((campsite) => (
                  <CampsiteCard
                    key={campsite.id}
                    campsite={campsite}
                    variant="featured"
                  />
                ))}
              </div>
            </section>

            {/* All Campsites */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Popular Near You
              </h2>
              <div className="space-y-4">
                {campsites.map((campsite) => (
                  <CampsiteCard key={campsite.id} campsite={campsite} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </AppShell>
  )
}
