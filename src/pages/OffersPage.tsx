import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { SupplierOffer } from '@/types'
import { Icon, Chip, Skeleton } from '@/components/ui'
import { TopAppBar, AppShell } from '@/components/layout'
import { apiFetch } from '@/utils/api'

const categories = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'food', label: 'Food', icon: 'restaurant' },
  { id: 'activity', label: 'Activities', icon: 'kayaking' },
  { id: 'gear', label: 'Gear', icon: 'backpack' },
]

function OfferCard({ offer }: { offer: SupplierOffer }) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-card">
      <div className="relative aspect-[16/9]">
        <img
          src={offer.imageUrl}
          alt={offer.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-primary text-background-dark px-3 py-1 rounded-full font-bold text-sm">
          {offer.discount}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={offer.supplierLogo}
            alt={offer.supplierName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {offer.supplierName}
          </span>
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-1">
          {offer.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
          {offer.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Icon name="location_on" size="sm" />
          <span>{offer.distance}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {offer.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function OfferSkeleton() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden">
      <Skeleton className="aspect-[16/9] rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export function OffersPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['offers', activeCategory],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (activeCategory !== 'all') params.set('category', activeCategory)
      const res = await apiFetch(`/api/offers?${params}`)
      return res.json()
    },
  })

  const offers: SupplierOffer[] = data?.offers || []

  return (
    <AppShell>
      <TopAppBar title="Local Offers" showBack={false} />

      <div className="px-4 pb-28">
        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </div>

        {/* Offers Grid */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <OfferSkeleton />
              <OfferSkeleton />
            </>
          ) : offers.length === 0 ? (
            <div className="text-center py-12">
              <Icon
                name="local_offer"
                size="xl"
                className="text-slate-300 dark:text-slate-600 mx-auto mb-4"
              />
              <p className="text-slate-500">No offers available</p>
              <p className="text-sm text-slate-400">
                Check back later for local deals
              </p>
            </div>
          ) : (
            offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
          )}
        </div>
      </div>
    </AppShell>
  )
}
