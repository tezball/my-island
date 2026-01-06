import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Icon from '../../components/ui/Icon'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { ownerApi, type CampsiteResponse } from '../../lib/api/owner'

export default function OwnerCampsitesPage() {
  const navigate = useNavigate()
  const [campsites, setCampsites] = useState<CampsiteResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCampsites() {
      setIsLoading(true)
      try {
        const data = await ownerApi.getMyCampsites()
        setCampsites(data)
      } catch (err) {
        console.error('Failed to fetch campsites:', err)
        setCampsites([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchCampsites()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <AppShell headerTitle="My Properties" showBack showNav={false}>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              My Properties
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage all your campsites and accommodations
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon="add"
            onClick={() => navigate('/owner/property/new')}
          >
            Add Property
          </Button>
        </div>

        {/* Stats Summary */}
        {!isLoading && campsites.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="home" className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {campsites.length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Properties
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Icon name="star" className="text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(campsites.reduce((sum, c) => sum + c.rating, 0) / campsites.length).toFixed(1)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Avg Rating
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Icon name="reviews" className="text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {campsites.reduce((sum, c) => sum + c.reviewCount, 0)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                <div className="flex gap-4">
                  <Skeleton className="w-32 h-24 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && campsites.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Icon name="home" size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No properties yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Add your first property to start accepting bookings
            </p>
            <Button
              variant="primary"
              leftIcon="add"
              onClick={() => navigate('/owner/property/new')}
            >
              Add Your First Property
            </Button>
          </div>
        )}

        {/* Campsites List */}
        {!isLoading && campsites.length > 0 && (
          <div className="space-y-4">
            {campsites.map(campsite => (
              <div
                key={campsite.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="flex">
                  {/* Image */}
                  <div className="w-40 h-32 flex-shrink-0">
                    {campsite.images?.[0] ? (
                      <img
                        src={campsite.images[0]}
                        alt={campsite.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Icon name="image" size={32} className="text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {campsite.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Icon name="location_on" size={14} />
                          {campsite.location?.county || 'Location not set'}
                        </p>
                      </div>
                      {campsite.featured && (
                        <Badge variant="success">Featured</Badge>
                      )}
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Icon name="star" size={16} />
                        <span className="font-medium">{campsite.rating.toFixed(1)}</span>
                        <span className="text-slate-400">({campsite.reviewCount})</span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">
                        From {formatPrice(campsite.priceFrom)}/night
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon="edit"
                        onClick={() => navigate(`/owner/campsites/${campsite.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Link
                        to={`/campsite/${campsite.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
                      >
                        <Icon name="visibility" size={16} />
                        View Public Page
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
