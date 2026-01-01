import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Icon from '../../components/ui/Icon'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../context/ToastContext'

interface SupplierOffer {
  id: string
  title: string
  description: string
  discount: string
  category: 'food' | 'activities' | 'gear' | 'attractions' | 'transport'
  status: 'active' | 'inactive' | 'expired'
  validUntil: string
  views: number
  claims: number
}

// Mock offers data
const mockOffers: SupplierOffer[] = [
  {
    id: 'offer-1',
    title: '20% Off Kayak Rentals',
    description: 'Get 20% off all kayak rentals this summer.',
    discount: '20%',
    category: 'activities',
    status: 'active',
    validUntil: '2025-08-31',
    views: 156,
    claims: 34,
  },
  {
    id: 'offer-2',
    title: 'Free Coffee with Breakfast',
    description: 'Enjoy a free coffee with any breakfast order.',
    discount: 'Free Coffee',
    category: 'food',
    status: 'active',
    validUntil: '2025-07-15',
    views: 198,
    claims: 28,
  },
  {
    id: 'offer-3',
    title: 'Sunset Boat Tour Special',
    description: 'Book a sunset boat tour at a special rate.',
    discount: '15%',
    category: 'attractions',
    status: 'active',
    validUntil: '2025-09-30',
    views: 170,
    claims: 25,
  },
  {
    id: 'offer-4',
    title: 'Camping Gear Bundle',
    description: 'Rent a complete camping gear bundle.',
    discount: '25%',
    category: 'gear',
    status: 'inactive',
    validUntil: '2025-06-01',
    views: 89,
    claims: 12,
  },
]

const categoryIcons: Record<SupplierOffer['category'], string> = {
  food: 'restaurant',
  activities: 'kayaking',
  gear: 'backpack',
  attractions: 'attractions',
  transport: 'directions_car',
}

const categoryColors: Record<SupplierOffer['category'], string> = {
  food: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  activities: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  gear: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  attractions: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  transport: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
}

type FilterStatus = 'all' | 'active' | 'inactive' | 'expired'

export default function SupplierOffersPage() {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [offers, setOffers] = useState<SupplierOffer[]>([])
  const [filter, setFilter] = useState<FilterStatus>('all')

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffers(mockOffers)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const filteredOffers = offers.filter(offer => {
    if (filter === 'all') return true
    return offer.status === filter
  })

  const handleDeleteOffer = (offerId: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(o => o.id !== offerId))
      toast.success('Offer Deleted', 'The offer has been removed.')
    }
  }

  const handleToggleStatus = (offerId: string) => {
    setOffers(offers.map(offer => {
      if (offer.id === offerId) {
        const newStatus = offer.status === 'active' ? 'inactive' : 'active'
        toast.success(
          newStatus === 'active' ? 'Offer Activated' : 'Offer Deactivated',
          newStatus === 'active'
            ? 'Your offer is now visible to campers.'
            : 'Your offer has been hidden from campers.'
        )
        return { ...offer, status: newStatus }
      }
      return offer
    }))
  }

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="My Offers" showNav={false}>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} variant="rectangular" height={120} className="rounded-2xl" />
          ))}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      showBack
      headerTitle="My Offers"
      showNav={false}
      headerRightAction={
        <Link to="/supplier/offers/new">
          <Icon name="add" size={24} className="text-primary" />
        </Link>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Filter Tabs */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto">
          {(['all', 'active', 'inactive', 'expired'] as FilterStatus[]).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-1.5 opacity-70">
                  ({offers.filter(o => o.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Offers List */}
        <div className="px-4 pb-4 space-y-3">
          {filteredOffers.length === 0 ? (
            <div className="text-center py-12">
              <Icon
                name="local_offer"
                size={48}
                className="text-slate-300 dark:text-slate-600 mx-auto mb-3"
              />
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {filter === 'all'
                  ? 'No offers yet. Create your first offer!'
                  : `No ${filter} offers found.`}
              </p>
              {filter === 'all' && (
                <Link
                  to="/supplier/offers/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium text-sm"
                >
                  <Icon name="add" size={18} />
                  Create Offer
                </Link>
              )}
            </div>
          ) : (
            filteredOffers.map(offer => (
              <div
                key={offer.id}
                className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Category Icon */}
                    <div className={`size-10 rounded-full flex items-center justify-center ${categoryColors[offer.category]}`}>
                      <Icon name={categoryIcons[offer.category]} size={20} />
                    </div>

                    {/* Offer Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {offer.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          offer.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : offer.status === 'expired'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {offer.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                        {offer.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Icon name="visibility" size={14} />
                          {offer.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="redeem" size={14} />
                          {offer.claims} claimed
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="schedule" size={14} />
                          Until {new Date(offer.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Discount Badge */}
                    <div className="bg-primary/10 px-2 py-1 rounded-lg">
                      <span className="text-primary font-bold text-sm">
                        {offer.discount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-slate-100 dark:border-slate-800 divide-x divide-slate-100 dark:divide-slate-800">
                  <Link
                    to={`/supplier/offers/${offer.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <Icon name="edit" size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(offer.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <Icon name={offer.status === 'active' ? 'visibility_off' : 'visibility'} size={16} />
                    {offer.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Icon name="delete" size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  )
}
