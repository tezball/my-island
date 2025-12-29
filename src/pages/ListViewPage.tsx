import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Campsite } from '@/types'
import { Icon, Chip, CampsiteCardSkeleton } from '@/components/ui'
import { AppShell } from '@/components/layout'
import { CampsiteCard } from '@/components/campsite'
import { apiFetch } from '@/utils/api'
import { cn } from '@/utils/cn'

// Mock M06: List View Page (alternative to map view)
type SortOption = 'recommended' | 'price-low' | 'price-high' | 'rating' | 'distance'

export function ListViewPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const [showSortMenu, setShowSortMenu] = useState(false)

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

  const sortOptions: { value: SortOption; label: string; icon: string }[] = [
    { value: 'recommended', label: 'Recommended', icon: 'star' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'arrow_upward' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'arrow_downward' },
    { value: 'rating', label: 'Top Rated', icon: 'thumb_up' },
    { value: 'distance', label: 'Nearest', icon: 'near_me' },
  ]

  const sortedCampsites = [...campsites].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.pricePerNight - b.pricePerNight
      case 'price-high':
        return b.pricePerNight - a.pricePerNight
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <AppShell>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 pt-12 pb-4 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="arrow_back" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Campsites'}
            </h1>
            <p className="text-sm text-gray-500">
              {isLoading ? 'Searching...' : `${campsites.length} stays found`}
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="p-2 -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="map" />
          </button>
        </div>

        {/* Sort & Filter Bar */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium"
            >
              <Icon name="sort" className="text-base" />
              Sort
              <Icon name="expand_more" className="text-base" />
            </button>

            {showSortMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-surface-dark rounded-xl shadow-float border border-gray-100 dark:border-gray-700 overflow-hidden z-20">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value)
                        setShowSortMenu(false)
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                        sortBy === option.value
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-gray-50 dark:hover:bg-white/5'
                      )}
                    >
                      <Icon name={option.icon} className="text-base" />
                      {option.label}
                      {sortBy === option.value && (
                        <Icon name="check" className="ml-auto text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium">
            <Icon name="tune" className="text-base" />
            Filters
          </button>

          {/* Quick Filters */}
          <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
            <Chip label="Dates" icon="calendar_month" />
            <Chip label="Guests" icon="person" />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pb-28 pt-4">
        <div className="space-y-4">
          {isLoading ? (
            <>
              <CampsiteCardSkeleton />
              <CampsiteCardSkeleton />
              <CampsiteCardSkeleton />
            </>
          ) : sortedCampsites.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 dark:bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="search_off" className="text-4xl text-gray-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">No campsites found</h3>
              <p className="text-sm text-gray-500 mb-6">
                Try adjusting your filters or search for a different area
              </p>
              <button
                onClick={() => navigate('/')}
                className="text-primary font-bold text-sm"
              >
                View on Map
              </button>
            </div>
          ) : (
            sortedCampsites.map((campsite) => (
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
