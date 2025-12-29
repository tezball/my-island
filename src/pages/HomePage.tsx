import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, Chip } from '@/components/ui'
import { apiFetch } from '@/utils/api'
import { BottomNav } from '@/components/layout'
import { InteractiveMap } from '@/components/map'
import type { MapControls } from '@/components/map'
import type { Campsite } from '@/types'

const filterChips = [
  { id: 'all', label: 'Campsites', icon: 'camping' },
  { id: 'rv', label: 'RV Parks', icon: 'rv_hookup' },
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'pets', label: 'Pet Friendly', icon: 'pets' },
]

export function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const mapControlsRef = useRef<MapControls | null>(null)

  const { data } = useQuery({
    queryKey: ['campsites'],
    queryFn: async () => {
      const res = await apiFetch('/api/campsites')
      return res.json()
    },
  })

  const campsites: Campsite[] = data?.campsites || []

  const handleCampsiteClick = (campsite: Campsite) => {
    navigate(`/campsite/${campsite.id}`)
  }

  const handleMapReady = useCallback((controls: MapControls) => {
    mapControlsRef.current = controls
  }, [])

  const handleZoomIn = () => {
    mapControlsRef.current?.zoomIn()
  }

  const handleZoomOut = () => {
    mapControlsRef.current?.zoomOut()
  }

  const handleLocate = () => {
    mapControlsRef.current?.locate()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Interactive Map with Campsite Markers */}
      <div className="absolute inset-0 z-0">
        <InteractiveMap
          campsites={campsites}
          onCampsiteClick={handleCampsiteClick}
          activeFilter={activeFilter}
          onMapReady={handleMapReady}
        />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        {/* Search Area */}
        <div className="pt-12 px-4 pb-2 w-full pointer-events-auto">
          <form onSubmit={handleSearch} className="w-full max-w-md mx-auto relative">
            <div className="relative flex items-center h-12 w-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md rounded-full shadow-float border border-white/20 dark:border-white/5 transition-all focus-within:ring-2 focus-within:ring-primary/50">
              <div className="pl-4 pr-2 text-primary flex items-center justify-center">
                <Icon name="search" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by County or Campsite Name"
                className="w-full bg-transparent border-none focus:ring-0 text-text-main dark:text-white placeholder:text-text-secondary dark:placeholder:text-gray-500 text-sm font-medium h-full rounded-r-full"
              />
              <button
                type="button"
                className="mr-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-text-secondary transition-colors"
              >
                <Icon name="tune" size="md" />
              </button>
            </div>
          </form>

          {/* Filter Chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-2">
            {filterChips.map((chip) => (
              <Chip
                key={chip.id}
                label={chip.label}
                icon={chip.icon}
                active={activeFilter === chip.id}
                onClick={() => setActiveFilter(chip.id)}
              />
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 flex flex-col justify-end pb-24 px-4 pointer-events-none">
          {/* Map Controls */}
          <div className="flex flex-col items-end gap-3 mb-4 pointer-events-auto">
            <button
              onClick={handleLocate}
              className="w-10 h-10 bg-surface-light dark:bg-surface-dark rounded-lg shadow-float flex items-center justify-center text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
            >
              <Icon name="my_location" />
            </button>
            <div className="flex flex-col bg-surface-light dark:bg-surface-dark rounded-lg shadow-float divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 flex items-center justify-center text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Icon name="add" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 flex items-center justify-center text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Icon name="remove" />
              </button>
            </div>
          </div>

          {/* List View Button */}
          <div className="flex justify-center pointer-events-auto mb-4">
            <Link
              to="/search"
              className="group relative flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-text-main font-bold rounded-full shadow-float transition-all active:scale-95"
            >
              <Icon name="format_list_bulleted" size="md" />
              <span>List View</span>
            </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
