import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Campsite } from '@/types'
import { Icon, CampsiteCardSkeleton } from '@/components/ui'
import { TopAppBar, AppShell } from '@/components/layout'
import { CampsiteCard } from '@/components/campsite'
import { apiFetch } from '@/utils/api'

export function FavoritesPage() {
  const queryClient = useQueryClient()

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

  return (
    <AppShell>
      <TopAppBar title="Saved Places" showBack={false} />

      <div className="px-4 pb-28">
        {isLoading ? (
          <div className="space-y-4">
            <CampsiteCardSkeleton />
            <CampsiteCardSkeleton />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <Icon
              name="favorite_border"
              size="xl"
              className="text-slate-300 dark:text-slate-600 mx-auto mb-4"
            />
            <p className="text-slate-500">No saved places yet</p>
            <p className="text-sm text-slate-400">
              Tap the heart icon on any campsite to save it
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((campsite) => (
              <CampsiteCard
                key={campsite.id}
                campsite={campsite}
                isFavorite
                onToggleFavorite={() => toggleFavorite.mutate(campsite.id)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
