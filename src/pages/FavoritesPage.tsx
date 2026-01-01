import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import CampsiteCard from '../components/ui/CampsiteCard'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'
import { useFavorites } from '../context/FavoritesContext'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites, isLoading } = useFavorites()

  if (isLoading) {
    return (
      <AppShell headerTitle="Saved" showLogo>
        <div className="p-4 space-y-4">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell headerTitle="Saved" showLogo>
      <div className="flex-1 overflow-auto">
        {favorites.length === 0 ? (
          <EmptyState
            icon="favorite"
            title="No saved campsites"
            description="Save campsites you love and they'll appear here for easy access."
            action={{
              label: 'Explore Campsites',
              onClick: () => navigate('/'),
            }}
          />
        ) : (
          <div className="p-4 space-y-4">
            <p className="text-sm text-slate-500">
              {favorites.length} saved campsite{favorites.length !== 1 ? 's' : ''}
            </p>
            {favorites.map((campsite) => (
              <CampsiteCard key={campsite.id} campsite={campsite} showFavoriteButton />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
