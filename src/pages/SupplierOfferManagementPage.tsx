import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { cn } from '@/utils/cn'

// Supplier Offer Management Page - from design
type OfferStatus = 'active' | 'draft' | 'expired'

interface Offer {
  id: string
  title: string
  price: number
  originalPrice?: number
  discount?: string
  status: OfferStatus
  statusDate: string
  image: string
}

const MOCK_OFFERS: Offer[] = [
  {
    id: '1',
    title: 'Weekend Kayak Rental',
    price: 50,
    originalPrice: 62.5,
    discount: '-20%',
    status: 'active',
    statusDate: 'Until Oct 15',
    image: 'https://images.unsplash.com/photo-1604715892639-ce966d0a3f6c?w=200',
  },
  {
    id: '2',
    title: 'Family BBQ Pack',
    price: 85,
    status: 'draft',
    statusDate: 'Edited 2h ago',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200',
  },
  {
    id: '3',
    title: 'Sunset Glamping Exp.',
    price: 120,
    status: 'expired',
    statusDate: 'Ended Sep 30',
    image: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=200',
  },
  {
    id: '4',
    title: 'Surf Lesson Bundle',
    price: 140,
    originalPrice: 165,
    discount: '-15%',
    status: 'active',
    statusDate: 'Until Dec 01',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=200',
  },
]

const STATUS_STYLES: Record<
  OfferStatus,
  { label: string; className: string; dotClass: string }
> = {
  active: {
    label: 'Active',
    className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    dotClass: 'bg-green-500',
  },
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    dotClass: 'bg-gray-400',
  },
  expired: {
    label: 'Expired',
    className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    dotClass: 'bg-red-500',
  },
}

export function SupplierOfferManagementPage() {
  const navigate = useNavigate()
  const [offers] = useState(MOCK_OFFERS)

  const stats = {
    active: offers.filter((o) => o.status === 'active').length,
    views: '1.2k',
    viewsChange: '+15% vs last week',
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        title="My Offers"
        rightAction={
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 overflow-hidden">
            <Icon name="account_circle" className="text-3xl" />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto pb-24 px-4">
        {/* Stats Section */}
        <section className="mb-6">
          <div className="flex flex-row gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
            {/* Active Offers Stat */}
            <div className="snap-start flex min-w-[140px] flex-1 flex-col gap-1 rounded-2xl p-4 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Icon name="local_offer" className="text-xl" />
                <p className="text-xs font-semibold uppercase tracking-wider">Active</p>
              </div>
              <p className="text-3xl font-bold mt-1">{stats.active}</p>
              <p className="text-xs font-medium text-primary mt-1">+2 this month</p>
            </div>

            {/* Views Stat */}
            <div className="snap-start flex min-w-[140px] flex-1 flex-col gap-1 rounded-2xl p-4 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Icon name="visibility" className="text-xl" />
                <p className="text-xs font-semibold uppercase tracking-wider">Views</p>
              </div>
              <p className="text-3xl font-bold mt-1">{stats.views}</p>
              <p className="text-xs font-medium text-primary mt-1">{stats.viewsChange}</p>
            </div>
          </div>
        </section>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Current Listings</h2>
          <button className="text-sm font-semibold text-primary hover:text-green-400">
            Filter
          </button>
        </div>

        {/* Offers List */}
        <div className="flex flex-col gap-4">
          {offers.map((offer) => {
            const status = STATUS_STYLES[offer.status]
            return (
              <button
                key={offer.id}
                onClick={() => navigate(`/owner/offers/${offer.id}/edit`)}
                className={cn(
                  'group relative flex flex-col gap-3 rounded-2xl bg-white dark:bg-surface-dark p-3 shadow-sm border border-transparent hover:border-primary/20 transition-all text-left',
                  offer.status === 'expired' && 'opacity-75'
                )}
              >
                <div className="flex gap-4">
                  <div
                    className={cn(
                      'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100',
                      offer.status === 'expired' && 'grayscale'
                    )}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
                      style={{ backgroundImage: `url("${offer.image}")` }}
                    />
                    {offer.discount && (
                      <div className="absolute top-1 left-1 rounded bg-white/90 dark:bg-surface-dark/90 px-1.5 py-0.5 backdrop-blur-sm">
                        <p className="text-[10px] font-bold">{offer.discount}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold leading-tight pr-2">{offer.title}</h3>
                      <div className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Icon name="more_vert" className="text-xl" />
                      </div>
                    </div>
                    <p className="mt-1 text-sm font-medium text-primary">
                      ${offer.price.toFixed(2)}
                      {offer.originalPrice && (
                        <span className="text-xs text-gray-400 line-through font-normal ml-1">
                          ${offer.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                          status.className
                        )}
                      >
                        <span
                          className={cn('mr-1 h-1.5 w-1.5 rounded-full', status.dotClass)}
                        />
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {offer.statusDate}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Empty Space for FAB */}
        <div className="h-20" />
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-0 left-0 flex justify-center px-4 pointer-events-none z-20">
        <button
          onClick={() => navigate('/owner/offers/new')}
          className="pointer-events-auto shadow-lg shadow-primary/30 flex items-center justify-center gap-2 rounded-xl bg-primary h-14 px-8 text-black font-bold text-base transition-transform active:scale-95 hover:brightness-105 w-full max-w-[320px]"
        >
          <Icon name="add_circle" />
          Create New Offer
        </button>
      </div>

      {/* Bottom Fade */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent pointer-events-none z-10" />
    </div>
  )
}
