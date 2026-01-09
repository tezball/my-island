import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import SearchBar from '../../components/ui/SearchBar'
import Icon from '../../components/ui/Icon'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import PropertySelector from '../../components/owner/PropertySelector'
import { useToast } from '../../context/ToastContext'
import { useProperty } from '../../context/PropertyContext'
import { extrasApi, type ExtraResponse } from '../../lib/api/extras'

type FilterStatus = 'all' | 'available' | 'unavailable'

export default function ManageExtrasPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { selectedCampsiteId, campsites, isLoading: campsitesLoading } = useProperty()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [extras, setExtras] = useState<ExtraResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch extras when campsite selection changes
  useEffect(() => {
    async function fetchExtras() {
      if (campsitesLoading) return

      setIsLoading(true)
      try {
        // Use selected campsite if specific one is chosen, otherwise use first campsite
        const campsiteIdToUse = selectedCampsiteId !== 'all'
          ? selectedCampsiteId
          : campsites[0]?.id

        if (campsiteIdToUse) {
          const extrasData = await extrasApi.getOwnerExtras(campsiteIdToUse)
          setExtras(extrasData)
        } else {
          setExtras([])
        }
      } catch (err) {
        console.error('Failed to fetch extras:', err)
        setExtras([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchExtras()
  }, [selectedCampsiteId, campsites, campsitesLoading])

  // Handle delete (soft delete)
  const handleDelete = async (extraId: string, extraName: string) => {
    if (!confirm(`Are you sure you want to remove "${extraName}"? It will be hidden from guests.`)) {
      return
    }

    try {
      await extrasApi.deleteExtra(extraId)
      setExtras(extras.map(e => e.id === extraId ? { ...e, available: false } : e))
      toast.success('Extra removed', `"${extraName}" has been hidden from guests.`)
    } catch (err) {
      console.error('Failed to delete extra:', err)
      toast.error('Error', 'Failed to remove extra. Please try again.')
    }
  }

  // Filter by search and status
  const filteredExtras = extras.filter(extra => {
    const matchesSearch = extra.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (extra.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'available' && extra.available) ||
      (filterStatus === 'unavailable' && !extra.available)
    return matchesSearch && matchesStatus
  })

  const filters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' },
  ]

  const formatPrice = (price: number, perNight: boolean) => {
    return `€${price}${perNight ? '/night' : ' one-time'}`
  }

  if (isLoading || campsitesLoading) {
    return (
      <AppShell showBack headerTitle="Campsite Extras" showNav={false}>
        <div className="flex-1 p-4 space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      showBack
      headerTitle="Campsite Extras"
      showNav={false}
    >
      <div className="flex-1 overflow-auto">
        {/* Property Selector - extras must be managed per campsite */}
        {campsites.length > 1 && (
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <PropertySelector showAllOption={false} label="" />
          </div>
        )}

        {/* Search */}
        <div className="p-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search extras by name..."
          />
        </div>

        {/* Filter tabs */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {filters.map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === filter.value
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Extras count */}
        <div className="px-4 pb-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {filteredExtras.length} extra{filteredExtras.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Extras list */}
        <div className="px-4 space-y-3 pb-24">
          {filteredExtras.map(extra => (
            <div
              key={extra.id}
              className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {extra.name}
                    </h3>
                    {!extra.available && (
                      <Badge variant="warning">Hidden</Badge>
                    )}
                  </div>
                  {extra.description && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {extra.description}
                    </p>
                  )}
                </div>
                {extra.imageUrl && (
                  <img
                    src={extra.imageUrl}
                    alt={extra.name}
                    className="size-16 rounded-xl object-cover ml-3"
                  />
                )}
              </div>

              {/* Price and actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">
                    {formatPrice(extra.price, extra.perNight)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {extra.perNight ? (
                      <span className="flex items-center gap-1">
                        <Icon name="dark_mode" size={14} />
                        per night
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Icon name="sell" size={14} />
                        one-time
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/owner/extras/${extra.id}/edit`)}
                    className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Icon name="edit" size={18} className="text-slate-600 dark:text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(extra.id, extra.name)}
                    className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
                  >
                    <Icon name="delete" size={18} className="text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredExtras.length === 0 && (
            <div className="text-center py-12">
              <Icon
                name={extras.length === 0 ? "add_shopping_cart" : "search_off"}
                size={48}
                className="text-slate-300 mx-auto mb-3"
              />
              <p className="text-slate-500 mb-4">
                {extras.length === 0
                  ? "No extras yet. Add extras like firewood, bike rental, or breakfast to increase revenue."
                  : "No extras match your search"}
              </p>
              {extras.length === 0 && (
                <Link
                  to="/owner/extras/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  <Icon name="add" size={20} />
                  Add First Extra
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <Link
        to="/owner/extras/new"
        className="fixed bottom-6 right-6 size-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
      >
        <Icon name="add" size={28} />
      </Link>
    </AppShell>
  )
}
