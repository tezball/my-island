import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import { offersApi, type OfferResponse } from '../lib/api/offers'

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [offer, setOffer] = useState<OfferResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOffer() {
      if (!id) return
      setIsLoading(true)
      try {
        const data = await offersApi.getById(id)
        setOffer(data)
      } catch (err) {
        console.error('Failed to fetch offer:', err)
        setError('Offer not found')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOffer()
  }, [id])

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Offer">
        <div className="flex-1">
          <Skeleton className="w-full h-56" />
          <div className="p-4 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </AppShell>
    )
  }

  if (error || !offer) {
    return (
      <AppShell showBack headerTitle="Offer">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">{error || 'Offer not found'}</p>
        </div>
      </AppShell>
    )
  }

  const handleCopyCode = () => {
    const code = offer.promoCode || 'CAMP2025'
    navigator.clipboard.writeText(code)
    alert('Discount code copied!')
  }

  return (
    <AppShell
      showBack
      headerTitle=""
      showNav={false}
      headerRightAction={
        <button>
          <Icon name="share" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Hero Image */}
        <div className="relative h-56">
          {offer.imageUrl ? (
            <img
              src={offer.imageUrl}
              alt={offer.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <Icon name="local_offer" size={64} className="text-slate-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="success" className="mb-2">
              {offer.discountPercent}% off
            </Badge>
            <h1 className="text-2xl font-bold text-white">
              {offer.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Quick Info */}
          <div className="flex gap-4">
            <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
              <Icon name="store" size={24} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-slate-500">Category</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                {offer.category.toLowerCase()}
              </p>
            </div>
            <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
              <Icon name="schedule" size={24} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-slate-500">Valid Until</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {new Date(offer.validUntil).toLocaleDateString('en-IE', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
              <Icon name="euro" size={24} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-slate-500">Savings</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                €{(offer.originalPrice - offer.discountPrice).toFixed(0)}
              </p>
            </div>
          </div>

          {/* Campsite Link */}
          <Link
            to={`/campsite/${offer.campsiteId}`}
            className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
          >
            <Icon name="camping" size={24} className="text-primary" />
            <div className="flex-1">
              <p className="text-xs text-slate-500">Available at</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {offer.campsiteName}
              </p>
            </div>
            <Icon name="chevron_right" size={20} className="text-slate-400" />
          </Link>

          {/* Description */}
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white mb-2">
              About This Offer
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {offer.description}
            </p>
          </div>

          {/* Pricing */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 dark:text-slate-400">Original Price</span>
              <span className="text-slate-500 line-through">€{offer.originalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">Discounted Price</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                €{offer.discountPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Discount Code */}
          {(offer.promoCode || offer.discountPercent > 0) && (
            <div className="bg-primary/5 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                Discount Code
              </p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-bold text-primary">
                  {offer.promoCode || 'CAMP2025'}
                </span>
                <Button size="sm" variant="secondary" onClick={handleCopyCode}>
                  <Icon name="content_copy" size={18} />
                  Copy
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Show this code at checkout to redeem your discount
              </p>
            </div>
          )}

          {/* Terms */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Terms & Conditions
            </p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Valid for My Island app users only</li>
              <li>• Cannot be combined with other offers</li>
              <li>• One use per customer</li>
              <li>• Valid from {new Date(offer.validFrom).toLocaleDateString('en-IE')} to {new Date(offer.validUntil).toLocaleDateString('en-IE')}</li>
            </ul>
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button className="w-full" leftIcon="redeem" onClick={handleCopyCode}>
          Redeem Offer
        </Button>
      </div>
    </AppShell>
  )
}
