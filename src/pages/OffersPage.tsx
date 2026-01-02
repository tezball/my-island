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

// Mock offers for when API is unavailable
const mockOffers: OfferResponse[] = [
  {
    id: '1',
    title: 'Fresh Seafood Platter',
    description: 'Enjoy a delicious local seafood platter with freshly caught fish, mussels, and oysters.',
    discount: '20% Off',
    category: 'food',
    supplierName: "O'Malley's Seafood",
    supplierLogo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200',
    location: { address: 'Clifden Harbour, Galway', lat: 53.49, lng: -10.02 },
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Kayak Adventure Tour',
    description: 'Explore the stunning coastline with our guided 2-hour kayak adventure.',
    discount: '15% Off',
    category: 'activity',
    supplierName: 'Wild Atlantic Adventures',
    supplierLogo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200',
    location: { address: 'Roundstone, Galway', lat: 53.40, lng: -9.92 },
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Premium Camping Gear Rental',
    description: 'Rent high-quality tents, sleeping bags, and camping equipment.',
    discount: '25% Off',
    category: 'gear',
    supplierName: 'Camp Ready Ireland',
    supplierLogo: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200',
    location: { address: 'Galway City', lat: 53.27, lng: -9.05 },
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Spa & Wellness Package',
    description: 'Relax with a full body massage and access to thermal pools.',
    discount: '30% Off',
    category: 'wellness',
    supplierName: 'Connemara Wellness',
    supplierLogo: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200',
    location: { address: 'Letterfrack, Galway', lat: 53.55, lng: -9.95 },
    validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function OffersPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<OfferCategory | 'all'>('all')
  const [offers, setOffers] = useState<OfferResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const categories: (OfferCategory | 'all')[] = ['all', 'food', 'activity', 'gear', 'water', 'wellness', 'experience', 'other']

  // Fetch offers from API with mock fallback
  useEffect(() => {
    async function fetchOffers() {
      setIsLoading(true)
      try {
        const data = await offersApi.list(
          selectedCategory === 'all' ? {} : { category: selectedCategory }
        )
        setOffers(data.length > 0 ? data : mockOffers)
      } catch (error) {
        console.error('Failed to fetch offers:', error)
        // Use mock offers when API fails
        const filtered = selectedCategory === 'all'
          ? mockOffers
          : mockOffers.filter(o => o.category === selectedCategory)
        setOffers(filtered)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOffers()
  }, [selectedCategory])

  const filteredOffers = offers

  const handleGetDirections = (e: React.MouseEvent, address: string) => {
    e.stopPropagation()
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
  }

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
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/offers/${offer.id}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/offers/${offer.id}`) }}
                  className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800 text-left hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex gap-4">
                    <img
                      src={offer.supplierLogo}
                      alt={offer.supplierName}
                      className="size-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white truncate">
                            {offer.title}
                          </h3>
                          <p className="text-sm text-slate-500 truncate">{offer.supplierName}</p>
                        </div>
                        <Badge variant="success" className="flex-shrink-0">{offer.discount}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                        {offer.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Icon name={categoryIcons[offer.category]} size={14} />
                            {categoryLabels[offer.category]}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Icon name="schedule" size={14} />
                            {new Date(offer.validUntil).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleGetDirections(e, offer.location.address)}
                          className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                        >
                          <Icon name="directions" size={14} />
                          Directions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
