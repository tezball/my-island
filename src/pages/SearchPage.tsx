import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Campsite } from '@/types'
import { Icon, Chip, CampsiteCardSkeleton } from '@/components/ui'
import { TopAppBar, AppShell } from '@/components/layout'
import { CampsiteCard } from '@/components/campsite'
import { apiFetch } from '@/utils/api'

const filterChips = [
  { id: 'dates', label: 'Dates', icon: 'calendar_today' },
  { id: 'guests', label: 'Guests', icon: 'person' },
  { id: 'price', label: 'Price', icon: 'payments' },
  { id: 'type', label: 'Type', icon: 'camping' },
  { id: 'amenities', label: 'Amenities', icon: 'wifi' },
]

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  const { data, isLoading } = useQuery({
    queryKey: ['campsites', searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      const res = await apiFetch(`/api/campsites?${params}`)
      return res.json()
    },
  })

  const { data: favoritesData } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await apiFetch('/api/favorites')
      return res.json()
    },
  })

  const toggleFavorite = useMutation({
    mutationFn: async (campsiteId: string) => {
      await apiFetch(`/api/favorites/${campsiteId}`, { method: 'POST' })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const campsites: Campsite[] = data?.campsites || []
  const favorites: Campsite[] = favoritesData?.favorites || []
  const favoriteIds = favorites.map((f) => f.id)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams(searchQuery ? { q: searchQuery } : {})
  }

  return (
    <AppShell>
      <TopAppBar
        title="Search"
        rightAction={
          <button className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center">
            <Icon name="filter_list" className="text-slate-900 dark:text-white" />
          </button>
        }
      />

      <div className="px-4 pb-28">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="search" className="text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campsites..."
              className="w-full h-12 pl-12 pr-4 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </form>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
          {filterChips.map((chip) => (
            <Chip key={chip.id} label={chip.label} icon={chip.icon} />
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-500 mb-4">
          {isLoading ? 'Searching...' : `${campsites.length} stays found`}
        </p>

        {/* Results */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <CampsiteCardSkeleton />
              <CampsiteCardSkeleton />
              <CampsiteCardSkeleton />
            </>
          ) : campsites.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="search_off" size="xl" className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">No campsites found</p>
              <p className="text-sm text-slate-400">Try adjusting your search</p>
            </div>
          ) : (
            campsites.map((campsite) => (
              <CampsiteCard
                key={campsite.id}
                campsite={campsite}
                isFavorite={favoriteIds.includes(campsite.id)}
                onToggleFavorite={() => toggleFavorite.mutate(campsite.id)}
              />
            ))
          )}
        </div>
      </div>
    </AppShell>
  )
}
