import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Campsite } from '@/types'
import { Icon, CampsiteCardSkeleton } from '@/components/ui'
import { TopAppBar, AppShell } from '@/components/layout'
import { apiFetch } from '@/utils/api'
import { cn } from '@/utils/cn'

type StatusType = 'available' | 'busy' | 'low' | 'closed'

const STATUS_STYLES: Record<StatusType, { label: string; className: string }> = {
  available: {
    label: 'Open Now',
    className: 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/20',
  },
  busy: {
    label: 'Usually busy',
    className: 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400',
  },
  low: {
    label: 'Low Stock',
    className:
      'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-1 ring-inset ring-orange-500/20',
  },
  closed: {
    label: 'Closed',
    className:
      'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-inset ring-red-500/20',
  },
}

// Mock status assignment
const getStatus = (id: string): StatusType => {
  const statuses: StatusType[] = ['available', 'busy', 'low', 'available']
  return statuses[parseInt(id) % statuses.length]
}

export function FavoritesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading } = useQuery({
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

  const favorites: Campsite[] = data?.favorites || []

  const filteredFavorites = favorites.filter(
    (campsite) =>
      campsite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campsite.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppShell>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold leading-tight tracking-tight">
            My Favorites
          </h2>
          <button className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <Icon name="filter_list" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-2 sticky top-[72px] z-10 bg-background-light dark:bg-background-dark pb-4">
        <div className="group flex w-full items-center rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-white/5 transition-all focus-within:ring-2 focus-within:ring-primary/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-l-xl text-slate-400 dark:text-slate-500">
            <Icon name="search" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full bg-transparent border-none text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 focus:outline-none rounded-r-xl"
            placeholder="Search saved places..."
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-28 flex flex-col gap-4">
        {isLoading ? (
          <>
            <CampsiteCardSkeleton />
            <CampsiteCardSkeleton />
            <CampsiteCardSkeleton />
          </>
        ) : filteredFavorites.length === 0 ? (
          <EmptyFavorites hasSearchQuery={!!searchQuery} />
        ) : (
          <>
            {filteredFavorites.map((campsite) => {
              const status = getStatus(campsite.id)
              const statusStyle = STATUS_STYLES[status]

              return (
                <article
                  key={campsite.id}
                  onClick={() => navigate(`/campsite/${campsite.id}`)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-white/5 transition-transform active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex p-3 gap-3">
                    {/* Image */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/10">
                      <img
                        src={campsite.images?.[0] || campsite.image}
                        alt={campsite.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-base font-bold line-clamp-1">
                            {campsite.name}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite.mutate(campsite.id)
                            }}
                            className="shrink-0 text-primary hover:scale-110 transition-transform"
                          >
                            <Icon name="favorite" filled />
                          </button>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <Icon
                            name="star"
                            filled
                            className="text-primary text-base"
                          />
                          <span className="text-slate-700 dark:text-slate-300">
                            {campsite.rating}
                          </span>
                          <span className="mx-1 opacity-50">·</span>
                          <span className="truncate">
                            {campsite.type} · {campsite.distance || '2km away'}
                          </span>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                            statusStyle.className
                          )}
                        >
                          {statusStyle.label}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/campsite/${campsite.id}`)
                          }}
                          className="flex items-center gap-1 text-sm font-bold group-hover:text-primary transition-colors"
                        >
                          Details
                          <Icon name="arrow_forward" className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}

            {/* End of List */}
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-sm text-slate-400 dark:text-slate-500">
                You've reached the end of your favorites.
              </p>
              <button
                onClick={() => navigate('/search')}
                className="mt-4 text-sm font-semibold text-primary hover:underline"
              >
                Find more spots
              </button>
            </div>
          </>
        )}
      </main>
    </AppShell>
  )
}

// Mock G03: Empty Favorites Component
function EmptyFavorites({ hasSearchQuery }: { hasSearchQuery: boolean }) {
  const navigate = useNavigate()

  if (hasSearchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-surface-dark flex items-center justify-center mb-4">
          <Icon name="search_off" className="text-4xl text-slate-400" />
        </div>
        <h3 className="text-lg font-bold mb-1">No matches found</h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Try a different search term or browse all your favorites
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="favorite_border" className="text-5xl text-primary/50" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <Icon name="add" className="text-white text-xl" />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">
        Start exploring and save your favorite campsites for quick access later
      </p>
      <button
        onClick={() => navigate('/search')}
        className="flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-primary/20 hover:bg-green-400 transition-all active:scale-95"
      >
        <Icon name="explore" />
        Explore Campsites
      </button>

      {/* Tips */}
      <div className="mt-10 w-full max-w-xs">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Quick Tips
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon name="touch_app" className="text-primary text-sm" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tap the heart icon on any campsite to add it to your favorites
            </p>
          </div>
          <div className="flex items-start gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
              <Icon name="notifications" className="text-blue-600 text-sm" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Get notified when spots open up at your saved locations
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
