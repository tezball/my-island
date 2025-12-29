import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Campsite } from '@/types'
import { Button, Icon, Rating, Badge } from '@/components/ui'
import { StickyFooter } from '@/components/layout'
import { FacilitiesGrid, SupplierCard } from '@/components/campsite'
import { useBooking } from '@/context/BookingContext'
import { apiFetch } from '@/utils/api'

export function CampsiteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setCampsite } = useBooking()

  const { data, isLoading } = useQuery({
    queryKey: ['campsite', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/campsites/${id}`)
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
    mutationFn: async () => {
      await apiFetch(`/api/favorites/${id}`, { method: 'POST' })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const campsite: Campsite | undefined = data?.campsite
  const favorites: Campsite[] = favoritesData?.favorites || []
  const isFavorite = favorites.some((f) => f.id === id)

  const handleBook = () => {
    if (campsite) {
      setCampsite(campsite)
      navigate(`/book/${id}/dates`)
    }
  }

  if (isLoading || !campsite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="progress_activity" className="animate-spin text-primary text-4xl" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
      {/* Hero Image */}
      <div className="relative aspect-[4/3]">
        <img
          src={campsite.imageUrl}
          alt={campsite.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 w-10 h-10 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
        >
          <Icon name="arrow_back" className="text-slate-900 dark:text-white" />
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite.mutate()}
          className="absolute top-12 right-4 w-10 h-10 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
        >
          <Icon
            name="favorite"
            filled={isFavorite}
            className={isFavorite ? 'text-red-500' : 'text-slate-400'}
          />
        </button>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            {campsite.isSuperhost && <Badge variant="success">Superhost</Badge>}
            <Badge variant="default">{campsite.type}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-white">{campsite.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Icon name="location_on" size="sm" className="text-white/80" />
            <span className="text-white/80 text-sm">{campsite.location}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 max-w-md mx-auto">
        {/* Rating & Price */}
        <div className="flex items-center justify-between">
          <Rating value={campsite.rating} reviewCount={campsite.reviewCount} />
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">
              €{campsite.pricePerNight}
            </span>
            <span className="text-slate-500"> / night</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            About this place
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {campsite.description}
          </p>
        </div>

        {/* Facilities */}
        <FacilitiesGrid facilities={campsite.facilities} />

        {/* Available Lots */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Available Pitches
          </h3>
          <div className="space-y-2">
            {campsite.lots.map((lot) => (
              <div
                key={lot.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                    {lot.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Up to {lot.maxGuests} guests · {lot.size}
                  </p>
                </div>
                <span className="font-bold text-primary">€{lot.pricePerNight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Local Suppliers */}
        {campsite.suppliers.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Local Suppliers
            </h3>
            <div className="space-y-2">
              {campsite.suppliers.map((supplier) => (
                <SupplierCard key={supplier.id} supplier={supplier} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <StickyFooter>
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">From</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              €{campsite.pricePerNight}
              <span className="text-sm font-normal text-slate-500"> /night</span>
            </span>
          </div>
          <Button className="flex-1" size="lg" onClick={handleBook}>
            Book Now
          </Button>
        </div>
      </StickyFooter>
    </div>
  )
}
