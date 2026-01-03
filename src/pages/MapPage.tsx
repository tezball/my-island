import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import MapView, { type MapMarker, type MarkerType } from '../components/ui/MapView'
import Icon from '../components/ui/Icon'
import { campsitesApi, type CampsiteResponse } from '../lib/api/campsites'
import { suppliersApi, type LocalBusinessResponse } from '../lib/api/suppliers'
import {
  supplierCategoryIcons,
  supplierCategoryColors,
  supplierCategoryLabels,
  allSupplierCategories,
  type SupplierCategory,
} from '../data/supplierTypes'

type FilterType = 'all' | 'campsites' | 'suppliers'

export default function MapPage() {
  const navigate = useNavigate()
  const [campsites, setCampsites] = useState<CampsiteResponse[]>([])
  const [suppliers, setSuppliers] = useState<LocalBusinessResponse[]>([])
  const [selectedCampsite, setSelectedCampsite] = useState<CampsiteResponse | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<LocalBusinessResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Set<SupplierCategory>>(
    new Set(allSupplierCategories)
  )

  useEffect(() => {
    async function fetchData() {
      try {
        const [campsitesResponse, suppliersResponse] = await Promise.all([
          campsitesApi.searchPaged({}),
          suppliersApi.getAll({}),
        ])
        setCampsites(campsitesResponse.content)
        setSuppliers(suppliersResponse)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Build markers based on filter
  const markers: MapMarker[] = []

  if (filter === 'all' || filter === 'campsites') {
    campsites.forEach((campsite) => {
      markers.push({
        id: campsite.id,
        position: [campsite.location.lat, campsite.location.lng] as [number, number],
        price: campsite.priceFrom,
        name: campsite.name,
        type: 'campsite',
      })
    })
  }

  if (filter === 'all' || filter === 'suppliers') {
    suppliers
      .filter((s) => selectedCategories.has(s.category))
      .forEach((supplier) => {
        markers.push({
          id: supplier.id,
          position: [supplier.location.lat, supplier.location.lng] as [number, number],
          name: supplier.name,
          type: 'supplier',
          category: supplier.category,
        })
      })
  }

  const handleMarkerClick = (id: string, type: MarkerType) => {
    setSelectedCampsite(null)
    setSelectedSupplier(null)

    if (type === 'campsite') {
      const campsite = campsites.find((c) => c.id === id)
      if (campsite) setSelectedCampsite(campsite)
    } else {
      const supplier = suppliers.find((s) => s.id === id)
      if (supplier) setSelectedSupplier(supplier)
    }
  }

  const toggleCategory = (category: SupplierCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Map" showNav={false}>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell showBack headerTitle="Explore Map" showNav={false}>
      <div className="flex-1 flex flex-col relative h-[calc(100vh-56px)]">
        {/* Map */}
        <div className="flex-1 min-h-0">
          <MapView
            center={[53.5, -8]}
            zoom={7}
            markers={markers}
            onMarkerClick={handleMarkerClick}
            height="100%"
            className="rounded-none"
          />
        </div>

        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-4 right-16">
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <Icon name="search" size={20} className="text-slate-400" />
            <span className="text-slate-500">Search campsites...</span>
          </button>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute top-4 right-4 p-3 rounded-xl shadow-lg border ${
            showFilters
              ? 'bg-primary text-white border-primary'
              : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Icon name="tune" size={20} />
        </button>

        {/* Filter Panel */}
        {showFilters && (
          <div className="absolute top-20 right-4 w-72 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Show on Map</h3>

            {/* Main filter */}
            <div className="flex gap-2 mb-4">
              {(['all', 'campsites', 'suppliers'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                    filter === f
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'campsites' ? 'Campsites' : 'Suppliers'}
                </button>
              ))}
            </div>

            {/* Category filters */}
            {(filter === 'all' || filter === 'suppliers') && (
              <>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Supplier Categories
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {allSupplierCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium ${
                        selectedCategories.has(category)
                          ? 'bg-slate-100 dark:bg-slate-800'
                          : 'bg-slate-50 dark:bg-slate-900 opacity-50'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 16,
                          color: supplierCategoryColors[category],
                        }}
                      >
                        {supplierCategoryIcons[category]}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 truncate">
                        {supplierCategoryLabels[category]}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Selected Campsite Card */}
        {selectedCampsite && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setSelectedCampsite(null)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-black/50 rounded-full text-white"
              >
                <Icon name="close" size={16} />
              </button>
              <div
                className="flex gap-3 p-3 cursor-pointer"
                onClick={() => navigate(`/campsite/${selectedCampsite.id}`)}
              >
                <img
                  src={selectedCampsite.images[0]}
                  alt={selectedCampsite.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1 py-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {selectedCampsite.name}
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Icon name="location_on" size={14} />
                    {selectedCampsite.location.county}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon name="star" size={14} className="text-amber-400" filled />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {selectedCampsite.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-400">
                      ({selectedCampsite.reviewCount})
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="font-bold text-primary">
                      €{selectedCampsite.priceFrom}
                    </span>
                    <span className="text-slate-500 text-sm">/night</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Supplier Card */}
        {selectedSupplier && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setSelectedSupplier(null)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-black/50 rounded-full text-white"
              >
                <Icon name="close" size={16} />
              </button>
              <div
                className="flex gap-3 p-3 cursor-pointer"
                onClick={() => navigate(`/supplier/${selectedSupplier.id}`)}
              >
                <div
                  className="w-24 h-24 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${supplierCategoryColors[selectedSupplier.category]}15` }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 40,
                      color: supplierCategoryColors[selectedSupplier.category],
                    }}
                  >
                    {supplierCategoryIcons[selectedSupplier.category]}
                  </span>
                </div>
                <div className="flex-1 py-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: supplierCategoryColors[selectedSupplier.category] }}
                    >
                      {supplierCategoryLabels[selectedSupplier.category]}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mt-1">
                    {selectedSupplier.name}
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Icon name="location_on" size={14} />
                    {selectedSupplier.location.county}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon name="star" size={14} className="text-amber-400" filled />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {selectedSupplier.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-400">
                      ({selectedSupplier.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Count Badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          {!selectedCampsite && !selectedSupplier && (
            <div className="px-4 py-2 bg-slate-900/80 dark:bg-white/90 text-white dark:text-slate-900 rounded-full text-sm font-medium backdrop-blur-sm">
              {markers.length} locations
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
