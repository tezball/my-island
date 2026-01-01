import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import SearchBar from '../components/ui/SearchBar'
import CampsiteCard from '../components/ui/CampsiteCard'
import Icon from '../components/ui/Icon'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'
import { searchCampsites, getFeaturedCampsites } from '../data/mockData'
import type { Facility } from '../data/types'

const facilityFilters: { id: Facility; label: string; icon: string }[] = [
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'electric', label: 'Electric', icon: 'bolt' },
  { id: 'pets', label: 'Pets OK', icon: 'pets' },
  { id: 'beach', label: 'Beach', icon: 'beach_access' },
  { id: 'hiking', label: 'Hiking', icon: 'hiking' },
  { id: 'shower', label: 'Showers', icon: 'shower' },
]

const popularSearches = [
  { query: 'Glamping', icon: 'auto_awesome' },
  { query: 'Beach camping', icon: 'beach_access' },
  { query: 'Pet friendly', icon: 'pets' },
  { query: 'Wild Atlantic Way', icon: 'route' },
  { query: 'Near Dublin', icon: 'location_city' },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Facility[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Simulate search delay (useful for future API integration)
  useEffect(() => {
    if (query) {
      setIsSearching(true)
      const timer = setTimeout(() => setIsSearching(false), 300)
      return () => clearTimeout(timer)
    }
  }, [query])

  const results = query ? searchCampsites(query) : []
  const featured = getFeaturedCampsites()

  const filteredResults = selectedFilters.length > 0
    ? results.filter((c) => selectedFilters.every((f) => c.facilities.includes(f)))
    : results

  const toggleFilter = (facility: Facility) => {
    setSelectedFilters((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedFilters.includes(filter.id)
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
                  {popularSearches.map((item) => (
                    <button
                      key={item.query}
                      onClick={() => setQuery(item.query)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary/20 hover:text-primary transition-colors"
                    >
                      <Icon name={item.icon} size={16} />
                      {item.query}
                    </button>
                  ))}
                </div>
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
