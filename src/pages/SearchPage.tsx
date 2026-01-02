import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import SearchBar from '../components/ui/SearchBar'
import CampsiteCard from '../components/ui/CampsiteCard'
import Icon from '../components/ui/Icon'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'
import campsitesApi from '../lib/api/campsites'
import type { Facility, Campsite } from '../data/types'
import type { CampsiteResponse } from '../lib/api/campsites'

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

const facilityFilters: { id: Facility; label: string; icon: string }[] = [
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'electric', label: 'Electric', icon: 'bolt' },
  { id: 'pets', label: 'Pets OK', icon: 'pets' },
  { id: 'beach', label: 'Beach', icon: 'beach_access' },
  { id: 'hiking', label: 'Hiking', icon: 'hiking' },
  { id: 'shower', label: 'Showers', icon: 'shower' },
]

const popularSearches: Array<{ query: string; icon: string; filters?: Facility[] }> = [
  { query: 'Glamping', icon: 'auto_awesome', filters: [] },
  { query: 'Beach camping', icon: 'beach_access', filters: ['beach'] },
  { query: 'Pet friendly', icon: 'pets', filters: ['pets'] },
  { query: 'Wild Atlantic Way', icon: 'route', filters: [] },
  { query: 'Near Dublin', icon: 'location_city', filters: [] },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Facility[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<Campsite[]>([])
  const [featured, setFeatured] = useState<Campsite[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Fetch featured campsites on mount
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await campsitesApi.getFeatured()
        setFeatured(data.map(mapToCampsite))
      } catch (err) {
        console.error('Failed to fetch featured campsites:', err)
      }
    }
    fetchFeatured()
  }, [])

  // Search with debounce
  useEffect(() => {
    if (query) {
      setIsSearching(true)
      setError(null)

      const timer = setTimeout(async () => {
        try {
          const data = await campsitesApi.search({
            search: query,
            facilities: selectedFilters.length > 0 ? selectedFilters : undefined
          })
          setResults(data.map(mapToCampsite))
        } catch (err) {
          console.error('Search failed:', err)
          setError('Failed to search campsites. Please try again.')
        } finally {
          setIsSearching(false)
        }
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setIsSearching(false)
    }
  }, [query, selectedFilters])

  const filteredResults = results

  const toggleFilter = (facility: Facility) => {
    setSelectedFilters((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    )
  }

  const handlePopularSearch = (search: typeof popularSearches[0]) => {
    setQuery(search.query)
    if (search.filters && search.filters.length > 0) {
      setSelectedFilters(search.filters)
      setShowFilters(true) // Show filters to make it clear they're applied
    }
  }

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setIsLocating(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setUserLocation(location)
        setIsLocating(false)

        // Set query to indicate near me search
        setQuery('Near me')

        // If using real API, we would search by coordinates
        // Location is now stored in userLocation state for API calls
      },
      (error) => {
        setIsLocating(false)
        let errorMessage = 'Unable to get your location'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }

        setError(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  return (
    <AppShell showBack headerTitle="Search" showNotifications={false}>
      <div className="flex-1 flex flex-col">
        {/* Search Header */}
        <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search campsites, locations..."
            autoFocus
          />

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
          >
            <Icon name="tune" size={18} />
            Filters
            {selectedFilters.length > 0 && (
              <span className="px-2 py-0.5 bg-primary text-slate-900 rounded-full text-xs font-bold">
                {selectedFilters.length}
              </span>
            )}
          </button>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Facilities
              </p>
              <div className="flex flex-wrap gap-2">
                {facilityFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(filter.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedFilters.includes(filter.id)
                      ? 'bg-primary text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    <Icon name={filter.icon} size={16} />
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="error" size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-200">
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-auto">
          {!query ? (
            /* Initial state - show popular searches and featured campsites */
            <div className="px-4 py-4 space-y-6">
              {/* Popular Searches */}
              <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Popular Searches
                </h2>
                <div className="flex flex-wrap gap-2">
                  {/* Near Me Button */}
                  <button
                    onClick={handleNearMe}
                    disabled={isLocating}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-2 border-primary rounded-full text-sm font-medium text-primary hover:bg-primary hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name={isLocating ? 'hourglass_empty' : 'near_me'} size={16} />
                    {isLocating ? 'Locating...' : 'Near me'}
                  </button>

                  {popularSearches.map((item) => (
                    <button
                      key={item.query}
                      onClick={() => handlePopularSearch(item)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary/20 hover:text-primary transition-colors"
                    >
                      <Icon name={item.icon} size={16} />
                      {item.query}
                    </button>
                  ))}
                </div>

                {/* Location Status */}
                {userLocation && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Icon name="location_on" size={14} />
                    Location detected: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                )}
              </section>

              {/* Featured Campsites */}
              <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Featured Campsites
                </h2>
                <div className="space-y-4">
                  {featured.slice(0, 4).map((campsite) => (
                    <CampsiteCard key={campsite.id} campsite={campsite} />
                  ))}
                </div>
              </section>

              {/* Browse All */}
              <Link
                to="/"
                className="flex items-center justify-center gap-2 py-3 text-primary font-medium"
              >
                <Icon name="explore" size={20} />
                Browse all campsites
              </Link>
            </div>
          ) : isSearching ? (
            /* Loading state */
            <div className="px-4 py-4 space-y-4">
              <p className="text-sm text-slate-500">Searching...</p>
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredResults.length === 0 ? (
            /* No results state */
            <EmptyState
              icon="search_off"
              title="No results found"
              description="Try adjusting your search or filters to find what you're looking for."
            />
          ) : (
            /* Results list */
            <div className="px-4 py-4 space-y-4">
              <p className="text-sm text-slate-500">
                {filteredResults.length} campsite{filteredResults.length !== 1 ? 's' : ''} found
              </p>
              {filteredResults.map((campsite) => (
                <CampsiteCard key={campsite.id} campsite={campsite} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
