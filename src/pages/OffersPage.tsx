import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { SupplierOffer } from '@/types'
import { Icon, Skeleton } from '@/components/ui'
import { AppShell } from '@/components/layout'
import { apiFetch } from '@/utils/api'
import { cn } from '@/utils/cn'

interface Category {
  id: string
  label: string
  image: string
  active?: boolean
}

const CATEGORIES: Category[] = [
  {
    id: 'food',
    label: 'Food',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCBxgkByb_l96hCX8MKjBG83y0wXbRVJyUD7BffBF1m4Qu_iHAA5XHI0xwDZpB9VwGNP7NupuQqOIm2SHgYBlFyJ6yVCanhnLptkjtG5I9nlwmmLWhax0MlPCL2GuMoLxDQ8bmQk9wnkv1QTU6pFvkMFau_6VuyXbqSAtjMNJICFJayo86jJrpT8o9A9KeFGUo6Q8MB7W2189L2uZkot9Jrogo6IBQ0TyCAUSrbsWDr6QV9pfVS3q0EUrtAf5BB2I79Gq1NNFCwCA',
    active: true,
  },
  {
    id: 'activity',
    label: 'Activity',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUSd4Ax-hnnVYB-wToTSsrZ8LTWyMXW9Pmur7GTURLc9GDvz7mFjbbtKZ6gMsuC0RXor2DuAFQx6cVlNIk_PjGGPBSAKfAoAxNwn4mjM2dZQs7HW1eGQmCfN2a9YhS-HIheP0EOdB2ldx66Vof8rSzaisRTYJP3sLZ0XEVZk88oGMxr6aR-QykRavwjNqHTwhNdHusj947LO42XJPS0CpFjvl9TWwrBU2G8U8tJvjtl2OzIe5_DjknrUbP0wNw0XNAwxOGH6UF9g',
  },
  {
    id: 'gear',
    label: 'Gear',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBpFvmaLJneWJ-UFuHk_R0EFWsjqY3dzqjxUwb7TpNFS8fXxpxXNaOElKGGWJUDgjHL5AUjCwUzFMDQtd7xiAC7EjcD0FoNbv8U4ga1WGLOJWTe54X5pPyx5ANIp8xWcjQTcWFclEQPJlDb27X6EXW3DDvqNk7uzvEpudraMC2XqBf8vEvvKgnJIH-xrU-MHo5-lGrq_ihw9IWx7wmGPalQiQmkPHTl7VZRAZmmpzaoA-dkGpwdFzAaqXvni9CcHVa4oByPm0fZNA',
  },
  {
    id: 'water',
    label: 'Water',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCNiNjX6DDO9JxqaomOnHsjJDb7M3qAeekdJ-qi2m7a9ZFpsn0gTrKFLaKG7oxbA2z99INW6RnnsK57UPF3K0P7jB0MRsHn3V5vqYK-WKHmJAZqIRyC37sv8-Jbd_DFHFhmspaN5zKjE1m__SvcmnX-iyP8Mtxuq1nDaEjoJANt4UsI05YK6yTQWlo98QBIRUw258BmYWbBid5dIyHrtWvRbu7KkaWL02HHrhvwt8tEhs1ULqLDWZI8O1UdtQXVAYhhKXKShwBNzw',
  },
]

export function OffersPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('food')
  const [savedOffers, setSavedOffers] = useState<Set<string>>(new Set())

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

  const toggleSaved = (id: string) => {
    setSavedOffers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <AppShell>
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button onClick={() => navigate(-1)}>
            <Icon name="arrow_back" className="text-2xl" />
          </button>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          Local Offers
        </h2>
        <div className="flex size-12 items-center justify-end">
          <button className="flex items-center justify-center rounded-full size-10 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <Icon name="filter_list" />
          </button>
        </div>
      </header>

      {/* Scrollable Feed */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-28">
        {/* Category Stories */}
        <div className="flex gap-3 overflow-x-auto px-4 py-4 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex flex-col items-center gap-1 min-w-[64px]"
            >
              <div
                className={cn(
                  'size-16 rounded-full p-[2px]',
                  activeCategory === cat.id
                    ? 'bg-gradient-to-tr from-primary to-emerald-400'
                    : 'border-2 border-gray-200 dark:border-gray-700'
                )}
              >
                {activeCategory === cat.id ? (
                  <div className="size-full rounded-full bg-background-light dark:bg-background-dark p-[2px]">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="size-full rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="size-full rounded-full object-cover"
                  />
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  activeCategory === cat.id
                    ? 'text-slate-900 dark:text-slate-200'
                    : 'text-slate-600 dark:text-slate-400'
                )}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Offer Cards */}
        {isLoading ? (
          <div className="space-y-6">
            <OfferSkeleton />
            <OfferSkeleton />
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-3 w-16 h-16 flex items-center justify-center mx-auto">
              <Icon name="local_offer" className="text-3xl text-gray-400" />
            </div>
            <h3 className="font-bold mb-1">No offers in this category</h3>
            <p className="text-gray-500 text-sm">
              Check back later for local deals
            </p>
          </div>
        ) : (
          <>
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isSaved={savedOffers.has(offer.id)}
                onToggleSave={() => toggleSaved(offer.id)}
                onViewDetails={() => navigate(`/supplier/${offer.supplierId || offer.id}`)}
              />
            ))}

            {/* End of Feed */}
            <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-3">
                <Icon name="check" className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">You're all caught up!</p>
            </div>
          </>
        )}
      </main>

      {/* FAB for Map */}
      <div className="fixed bottom-24 right-4 z-40">
        <button className="flex items-center justify-center rounded-full h-14 w-14 bg-slate-900 dark:bg-white shadow-lg shadow-slate-900/20 active:scale-95 transition-transform">
          <Icon
            name="map"
            className="text-2xl text-primary dark:text-primary"
          />
        </button>
      </div>
    </AppShell>
  )
}

interface OfferCardProps {
  offer: SupplierOffer
  isSaved: boolean
  onToggleSave: () => void
  onViewDetails: () => void
}

function OfferCard({ offer, isSaved, onToggleSave, onViewDetails }: OfferCardProps) {
  return (
    <article className="flex flex-col bg-white dark:bg-surface-dark mb-6 pb-2 border-y border-gray-100 dark:border-gray-800/50 sm:rounded-xl sm:border sm:mx-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <button onClick={onViewDetails} className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={offer.supplierLogo}
              alt={offer.supplierName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col text-left">
            <h3 className="text-sm font-bold leading-tight">
              {offer.supplierName}
            </h3>
            <span className="text-xs text-gray-500">
              2h ago · {offer.distance}
            </span>
          </div>
        </button>
        <button className="text-gray-400 hover:text-slate-900 dark:hover:text-white">
          <Icon name="more_horiz" />
        </button>
      </div>

      {/* Image */}
      <div className="w-full aspect-[4/5] bg-gray-100 dark:bg-gray-800 relative group overflow-hidden">
        <img
          src={offer.imageUrl}
          alt={offer.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm">
          {offer.discount}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-3 pt-3">
        <div className="flex items-center gap-1">
          <button className="flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-[#0d1b14] shadow-sm hover:brightness-105 active:scale-95 transition-all">
            <Icon name="near_me" className="text-xl mr-2" />
            Get Directions
          </button>
        </div>
        <button
          onClick={onToggleSave}
          className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon
            name={isSaved ? 'bookmark' : 'bookmark_border'}
            filled={isSaved}
            className={isSaved ? 'text-primary' : ''}
          />
        </button>
      </div>

      {/* Content */}
      <div className="px-3 py-2 flex flex-col gap-1">
        <p className="text-base font-bold leading-tight">{offer.title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-normal">
          {offer.description}
        </p>
        <div className="flex gap-2 mt-1 flex-wrap">
          {offer.tags.map((tag) => (
            <span key={tag} className="text-primary text-sm font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

function OfferSkeleton() {
  return (
    <div className="bg-white dark:bg-surface-dark mb-6 pb-2 border-y border-gray-100 dark:border-gray-800/50">
      <div className="flex items-center gap-3 p-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="w-full aspect-[4/5] rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
