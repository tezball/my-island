import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import StatCard from '../../components/ui/StatCard'
import Icon from '../../components/ui/Icon'
import Skeleton from '../../components/ui/Skeleton'
import { useAuth } from '../../context/AuthContext'

// Mock offer data for the supplier
const mockOfferStats = {
  activeOffers: 3,
  totalViews: 524,
  totalClaims: 87,
  viewsTrend: 15,
}

const mockOffers = [
  {
    id: 'offer-1',
    title: '20% Off Kayak Rentals',
    status: 'active' as const,
    claims: 34,
    views: 156,
  },
  {
    id: 'offer-2',
    title: 'Free Coffee with Breakfast',
    status: 'active' as const,
    claims: 28,
    views: 198,
  },
  {
    id: 'offer-3',
    title: 'Sunset Boat Tour Special',
    status: 'active' as const,
    claims: 25,
    views: 170,
  },
]

export default function SupplierDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Supplier Dashboard" showNav={false}>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <Skeleton variant="rectangular" height={100} className="rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton variant="rectangular" height={100} className="rounded-2xl" />
            <Skeleton variant="rectangular" height={100} className="rounded-2xl" />
          </div>
          <Skeleton variant="rectangular" height={200} className="rounded-2xl" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      showBack
      headerTitle="Supplier Dashboard"
      showNav={false}
      headerRightAction={
        <button onClick={() => navigate('/supplier/profile')}>
          <Icon name="settings" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Welcome Section */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-2xl p-4 text-white">
            <h2 className="text-lg font-bold mb-1">
              Welcome, {user?.name?.split(' ')[0] || 'Supplier'}!
            </h2>
            <p className="text-white/80 text-sm">
              Manage your offers and connect with campers.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 grid grid-cols-2 gap-3">
          <StatCard
            icon="visibility"
            value={mockOfferStats.totalViews.toLocaleString()}
            label="Total views"
            trend={mockOfferStats.viewsTrend}
            trendDirection="up"
          />
          <StatCard
            icon="redeem"
            value={mockOfferStats.totalClaims.toString()}
            label="Offers claimed"
          />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/supplier/profile"
              className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="storefront" size={24} className="text-primary" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                Business Profile
              </span>
              <span className="text-xs text-slate-500">
                Edit details
              </span>
            </Link>
            <Link
              to="/supplier/offers"
              className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="local_offer" size={24} className="text-primary" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                Manage Offers
              </span>
              <span className="text-xs text-slate-500">
                {mockOfferStats.activeOffers} active
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Offers */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Your Offers
            </h3>
            <Link to="/supplier/offers/new" className="text-primary text-sm font-medium">
              + Add New
            </Link>
          </div>
          <div className="space-y-3">
            {mockOffers.map(offer => (
              <Link
                key={offer.id}
                to={`/supplier/offers/${offer.id}/edit`}
                className="block p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {offer.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Icon name="visibility" size={14} />
                        {offer.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="redeem" size={14} />
                        {offer.claims} claimed
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    offer.status === 'active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {offer.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Empty state if no offers */}
        {mockOffers.length === 0 && (
          <div className="px-4 pb-4">
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <Icon name="local_offer" size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                No offers yet. Create your first offer to attract campers!
              </p>
              <Link
                to="/supplier/offers/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium text-sm"
              >
                <Icon name="add" size={18} />
                Create Offer
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
