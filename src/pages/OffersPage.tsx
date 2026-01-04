import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Icon from '../components/ui/Icon'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import { offersApi, type OfferResponse } from '../lib/api/offers'
import type { OfferCategory } from '../data/types'

const categoryIcons: Record<OfferCategory, string> = {
  food: 'restaurant',
  activity: 'kayaking',
  gear: 'backpack',
  water: 'pool',
  wellness: 'spa',
  experience: 'attractions',
  other: 'category',
}

const categoryLabels: Record<OfferCategory, string> = {
  food: 'Food & Drink',
  activity: 'Activities',
  gear: 'Camping Gear',
  water: 'Water Sports',
  wellness: 'Wellness',
  experience: 'Experiences',
  other: 'Other',
}

export default function OffersPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<OfferCategory | 'all'>('all')
  const [offers, setOffers] = useState<OfferResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const categories: (OfferCategory | 'all')[] = ['all', 'food', 'activity', 'gear', 'water', 'wellness', 'experience', 'other']

  useEffect(() => {
    async function fetchOffers() {
      setIsLoading(true)
      try {
        const data = await offersApi.list(
          selectedCategory === 'all' ? {} : { category: selectedCategory }
        )
        setOffers(data)
      } catch (error) {
        console.error('Failed to fetch offers:', error)
        setOffers([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchOffers()
  }, [selectedCategory])

  const filteredOffers = offers

  return (
    <AppShell headerTitle="Local Offers" showLogo>
      <div className="flex-1 flex flex-col">
        {/* Category Filter */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {cat === 'all' ? 'All Offers' : categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Offers List */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="flex gap-4">
                    <Skeleton className="size-16 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="local_offer" size={48} className="text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No offers in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredOffers.map((offer) => {
                // Map backend category (uppercase) to frontend category (lowercase)
                const categoryKey = offer.category.toLowerCase() as OfferCategory
                return (
                  <div
                    key={offer.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/offers/${offer.id}`)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/offers/${offer.id}`) }}
                    className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800 text-left hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex gap-4">
                      {offer.imageUrl ? (
                        <img
                          src={offer.imageUrl}
                          alt={offer.title}
                          className="size-16 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="size-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center">
                          <Icon name={categoryIcons[categoryKey] || 'local_offer'} size={24} className="text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 dark:text-white truncate">
                              {offer.title}
                            </h3>
                            <p className="text-sm text-slate-500 truncate">{offer.campsiteName}</p>
                          </div>
                          <Badge variant="success" className="flex-shrink-0">{offer.discountPercent}% off</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                          {offer.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Icon name={categoryIcons[categoryKey] || 'category'} size={14} />
                              {categoryLabels[categoryKey] || offer.category}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Icon name="schedule" size={14} />
                              {new Date(offer.validUntil).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
