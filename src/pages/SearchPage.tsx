import { useState } from 'react'
import AppShell from '../components/layout/AppShell'
import SearchBar from '../components/ui/SearchBar'
import CampsiteCard from '../components/ui/CampsiteCard'
import Icon from '../components/ui/Icon'
import EmptyState from '../components/ui/EmptyState'
import { searchCampsites, campsites } from '../data/mockData'
import type { Facility } from '../data/types'

const facilityFilters: { id: Facility; label: string; icon: string }[] = [
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'electric', label: 'Electric', icon: 'bolt' },
  { id: 'pets', label: 'Pets OK', icon: 'pets' },
  { id: 'beach', label: 'Beach', icon: 'beach_access' },
  { id: 'hiking', label: 'Hiking', icon: 'hiking' },
  { id: 'shower', label: 'Showers', icon: 'shower' },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Facility[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const results = query ? searchCampsites(query) : campsites

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
          {filteredResults.length === 0 ? (
            <EmptyState
              icon="search_off"
              title="No results found"
              description="Try adjusting your search or filters to find what you're looking for."
            />
          ) : (
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
