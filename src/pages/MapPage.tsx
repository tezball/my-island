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
import {
  facilityIcons,
  facilityColors,
  facilityLabels,
  allFacilities,
} from '../data/facilityTypes'
import type { Facility } from '../data/types'

type FilterType = 'all' | 'campsites' | 'suppliers'

export default function MapPage() {
  const navigate = useNavigate()
  const [campsites, setCampsites] = useState<CampsiteResponse[]>([])
  const [suppliers, setSuppliers] = useState<LocalBusinessResponse[]>([])
  const [selectedCampsite, setSelectedCampsite] = useState<CampsiteResponse | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<LocalBusinessResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedCategories, setSelectedCategories] = useState<Set<SupplierCategory>>(
    new Set(allSupplierCategories)
  )
  const [selectedFacilities, setSelectedFacilities] = useState<Set<Facility>>(new Set())

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

  // Filter campsites by selected facilities
  const filteredCampsites = campsites.filter((campsite) => {
    if (selectedFacilities.size === 0) return true
    return Array.from(selectedFacilities).every((facility) =>
      campsite.facilities.includes(facility)
    )
  })

  // Build markers based on filter
  const markers: MapMarker[] = []

  if (filter === 'all' || filter === 'campsites') {
    filteredCampsites.forEach((campsite) => {
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

  const toggleFacility = (facility: Facility) => {
    setSelectedFacilities((prev) => {
      // First action: if nothing selected, select only this one
      if (prev.size === 0) {
        return new Set([facility])
      }
      // Subsequent actions: toggle on/off
      const next = new Set(prev)
      if (next.has(facility)) {
        next.delete(facility)
      } else {
        next.add(facility)
      }
      return next
    })
  }

  const toggleCategory = (category: SupplierCategory) => {
    setSelectedCategories((prev) => {
      // First action: if all selected (default state), select only this one
      if (prev.size === allSupplierCategories.length) {
        return new Set([category])
      }
      // Subsequent actions: toggle on/off
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const clearAllFilters = () => {
    setSelectedFacilities(new Set())
    setSelectedCategories(new Set(allSupplierCategories))
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
    <div className="h-screen bg-background-light dark:bg-background-dark flex flex-col overflow-hidden">
      {/* Custom Header */}
      <header className="flex-shrink-0 h-14 bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-slate-800 z-40">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <Icon name="arrow_back" size={20} className="text-slate-600 dark:text-slate-300" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Explore Map</h1>
          </div>
        </div>
      </header>

      {/* Full-screen Map */}
      <div className="flex-1 relative min-h-0">
        <MapView
          center={[53.5, -8]}
          zoom={7}
          markers={markers}
          onMarkerClick={handleMarkerClick}
          height="100%"
          className="rounded-none"
        />

        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-4 right-4">
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <Icon name="search" size={20} className="text-slate-400" />
            <span className="text-slate-500">Search campsites...</span>
          </button>
        </div>

        {/* Filter Icons Bar */}
        <div className="absolute top-20 left-0 right-0 px-4 z-40">
          {/* Primary Filter Tabs */}
          <div className="flex gap-2 mb-3">
            {([
              { key: 'all', label: 'All', icon: 'layers' },
              { key: 'campsites', label: 'Campsites', icon: 'holiday_village' },
              { key: 'suppliers', label: 'Local', icon: 'storefront' },
            ] as const).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-md border transition-all ${
                  filter === key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon name={icon} size={18} filled={filter === key} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}

            {/* Clear filters button */}
            {(selectedFacilities.size > 0 || selectedCategories.size < allSupplierCategories.length) && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-2.5 rounded-full shadow-md border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
              >
                <Icon name="close" size={16} />
                <span className="text-sm font-medium">Clear</span>
              </button>
            )}
          </div>

          {/* Facility Filter Icons (for campsites) */}
          {(filter === 'all' || filter === 'campsites') && (
            <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-2">
                {allFacilities.map((facility) => {
                  const isSelected = selectedFacilities.has(facility)
                  return (
                    <button
                      key={facility}
                      onClick={() => toggleFacility(facility)}
                      className={`flex-shrink-0 flex flex-col items-center gap-1 p-2.5 rounded-xl shadow-md border transition-all min-w-[60px] ${
                        isSelected
                          ? 'bg-white dark:bg-surface-dark border-2'
                          : 'bg-white/80 dark:bg-surface-dark/80 border-slate-200 dark:border-slate-700 opacity-70'
                      }`}
                      style={{
                        borderColor: isSelected ? facilityColors[facility] : undefined,
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 22,
                          color: isSelected ? facilityColors[facility] : '#64748B',
                        }}
                      >
                        {facilityIcons[facility]}
                      </span>
                      <span
                        className={`text-[10px] font-medium ${
                          isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                        }`}
                      >
                        {facilityLabels[facility]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Supplier Category Icons */}
          {(filter === 'all' || filter === 'suppliers') && (
            <div className={`overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide ${filter === 'all' ? 'mt-2' : ''}`}>
              <div className="flex gap-2">
                {allSupplierCategories.map((category) => {
                  const isSelected = selectedCategories.has(category)
                  return (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`flex-shrink-0 flex flex-col items-center gap-1 p-2.5 rounded-xl shadow-md border transition-all min-w-[60px] ${
                        isSelected
                          ? 'bg-white dark:bg-surface-dark border-2'
                          : 'bg-white/80 dark:bg-surface-dark/80 border-slate-200 dark:border-slate-700 opacity-50'
                      }`}
                      style={{
                        borderColor: isSelected ? supplierCategoryColors[category] : undefined,
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 22,
                          color: isSelected ? supplierCategoryColors[category] : '#64748B',
                        }}
                      >
                        {supplierCategoryIcons[category]}
                      </span>
                      <span
                        className={`text-[10px] font-medium truncate max-w-[56px] ${
                          isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                        }`}
                      >
                        {supplierCategoryLabels[category]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

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
    </div>
  )
}
