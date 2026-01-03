import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import MapView from '../components/ui/MapView'
import Skeleton from '../components/ui/Skeleton'
import { suppliersApi, type LocalBusinessResponse } from '../lib/api/suppliers'
import {
  supplierCategoryIcons,
  supplierCategoryColors,
  supplierCategoryLabels,
} from '../data/supplierTypes'

export default function LocalBusinessDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [supplier, setSupplier] = useState<LocalBusinessResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSupplier() {
      if (!id) return

      try {
        const data = await suppliersApi.getById(id)
        setSupplier(data)
      } catch (err) {
        console.error('Failed to fetch supplier:', err)
        setError('Failed to load business details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupplier()
  }, [id])

  const handleGetDirections = () => {
    if (!supplier) return

    const { lat, lng } = supplier.location
    const destination = encodeURIComponent(supplier.location.address)

    // Try to open in native maps app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS) {
      window.open(`maps://maps.apple.com/?daddr=${lat},${lng}&q=${destination}`)
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`)
    }
  }

  const handleCall = () => {
    if (supplier?.contact.phone) {
      window.location.href = `tel:${supplier.contact.phone}`
    }
  }

  const handleWebsite = () => {
    if (supplier?.contact.website) {
      window.open(supplier.contact.website, '_blank')
    }
  }

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Loading...">
        <div className="p-4 space-y-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32" />
        </div>
      </AppShell>
    )
  }

  if (error || !supplier) {
    return (
      <AppShell showBack headerTitle="Error">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Icon name="error" size={48} className="text-red-500 mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-center mb-4">
            {error || 'Business not found'}
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </AppShell>
    )
  }

  const categoryColor = supplierCategoryColors[supplier.category]
  const categoryIcon = supplierCategoryIcons[supplier.category]
  const categoryLabel = supplierCategoryLabels[supplier.category]

  return (
    <AppShell showBack headerTitle={supplier.name} showNav={false}>
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header with Icon */}
        <div
          className="h-48 flex items-center justify-center"
          style={{ backgroundColor: `${categoryColor}15` }}
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: categoryColor }}
          >
            <span className="material-symbols-outlined text-white" style={{ fontSize: 48 }}>
              {categoryIcon}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Category Badge and Name */}
          <div>
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-2"
              style={{ backgroundColor: categoryColor }}
            >
              {categoryLabel}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {supplier.name}
            </h1>
            <p className="text-slate-500 flex items-center gap-1 mt-1">
              <Icon name="location_on" size={16} />
              {supplier.location.address}, {supplier.location.county}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Icon name="star" size={18} className="text-amber-400" filled />
              <span className="font-bold text-slate-900 dark:text-white">
                {supplier.rating.toFixed(1)}
              </span>
              <span className="text-slate-400">({supplier.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Description */}
          {supplier.description && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">About</h2>
              <p className="text-slate-600 dark:text-slate-400">{supplier.description}</p>
            </div>
          )}

          {/* Hours */}
          {(supplier.hours.weekday || supplier.hours.weekend) && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hours</h2>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2">
                {supplier.hours.weekday && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Monday - Friday</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {supplier.hours.weekday}
                    </span>
                  </div>
                )}
                {supplier.hours.weekend && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Saturday - Sunday</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {supplier.hours.weekend}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Contact</h2>
            <div className="space-y-2">
              {supplier.contact.phone && (
                <button
                  onClick={handleCall}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Icon name="phone" size={20} className="text-primary" />
                  <span className="text-slate-900 dark:text-white">{supplier.contact.phone}</span>
                </button>
              )}
              {supplier.contact.email && (
                <a
                  href={`mailto:${supplier.contact.email}`}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Icon name="mail" size={20} className="text-primary" />
                  <span className="text-slate-900 dark:text-white">{supplier.contact.email}</span>
                </a>
              )}
              {supplier.contact.website && (
                <button
                  onClick={handleWebsite}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Icon name="language" size={20} className="text-primary" />
                  <span className="text-slate-900 dark:text-white truncate">
                    {supplier.contact.website.replace(/^https?:\/\//, '')}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Location Map */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Location</h2>
            <div className="h-48 rounded-xl overflow-hidden">
              <MapView
                center={[supplier.location.lat, supplier.location.lng]}
                zoom={14}
                markers={[
                  {
                    id: supplier.id,
                    position: [supplier.location.lat, supplier.location.lng],
                    name: supplier.name,
                    type: 'supplier',
                    category: supplier.category,
                  },
                ]}
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-700">
        <div className="flex gap-3">
          {supplier.contact.phone && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCall}
            >
              <Icon name="phone" size={18} />
              Call
            </Button>
          )}
          <Button
            className="flex-1"
            onClick={handleGetDirections}
          >
            <Icon name="directions" size={18} />
            Directions
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
