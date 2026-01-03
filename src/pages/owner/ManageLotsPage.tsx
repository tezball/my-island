import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import SearchBar from '../../components/ui/SearchBar'
import Icon from '../../components/ui/Icon'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { ownerApi, type LotResponse, type CampsiteResponse } from '../../lib/api/owner'

type FilterStatus = 'all' | 'available' | 'booked' | 'maintenance'

// Format lot type for display (e.g., "SAFARI_TENT" -> "Safari Tent")
function formatLotType(type: string): string {
  return type
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

interface LotWithStatus extends LotResponse {
  status: 'available' | 'booked' | 'maintenance'
}

export default function ManageLotsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [, setCampsite] = useState<CampsiteResponse | null>(null)
  const [lots, setLots] = useState<LotWithStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const campsites = await ownerApi.getMyCampsites()
        if (campsites.length > 0) {
          setCampsite(campsites[0])
          const lotsData = await ownerApi.getLotsByCampsite(campsites[0].id)
          // Determine status based on availability
          const lotsWithStatus: LotWithStatus[] = lotsData.map((lot) => ({
            ...lot,
            status: lot.available ? 'available' : 'booked',
          }))
          setLots(lotsWithStatus)
        } else {
          // No campsites - show empty state
          setLots([])
        }
      } catch (err) {
        console.error('Failed to fetch lots:', err)
        setLots([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter by search and status
  const filteredLots = lots.filter(lot => {
    const matchesSearch = lot.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || lot.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'booked', label: 'Booked' },
    { value: 'maintenance', label: 'Maintenance' },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">Available</Badge>
      case 'booked':
        return <Badge variant="info">Booked</Badge>
      case 'maintenance':
        return <Badge variant="warning">Maintenance</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getLotTypeIcon = (type: string) => {
    switch (type) {
      case 'tent':
        return 'camping'
      case 'campervan':
        return 'directions_car'
      case 'caravan':
        return 'rv_hookup'
      case 'glamping':
        return 'cottage'
      case 'cabin':
        return 'cabin'
      default:
        return 'bed'
    }
  }

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Campsite Lots" showNav={false}>
        <div className="flex-1 p-4 space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      showBack
      headerTitle="Campsite Lots"
      showNav={false}
    >
      <div className="flex-1 overflow-auto">
        {/* Search */}
        <div className="p-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search lots by name or number..."
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

        {/* Lots count */}
        <div className="px-4 pb-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Managing {filteredLots.length} active sites
          </p>
        </div>

        {/* Lots list */}
        <div className="px-4 space-y-3 pb-24">
          {filteredLots.map(lot => (
            <div
              key={lot.id}
              className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {lot.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Icon name={getLotTypeIcon(lot.type)} size={16} />
                      {formatLotType(lot.type)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="group" size={16} />
                      Up to {lot.capacity}
                    </span>
                  </div>
                </div>
                {getStatusBadge(lot.status)}
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-3">
                {lot.amenities.slice(0, 3).map((amenity, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs text-slate-600 dark:text-slate-400"
                  >
                    {amenity}
                  </span>
                ))}
                {lot.amenities.length > 3 && (
                  <span className="px-2 py-1 text-xs text-slate-400">
                    +{lot.amenities.length - 3} more
                  </span>
                )}
              </div>

              {/* Price and actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="font-semibold text-primary">
                  €{lot.pricePerNight}/night
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/owner/lots/${lot.id}/edit`)}
                    className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Icon name="edit" size={18} className="text-slate-600 dark:text-slate-400" />
                  </button>
                  <button className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors">
                    <Icon name="delete" size={18} className="text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredLots.length === 0 && (
            <div className="text-center py-12">
              <Icon name={lots.length === 0 ? "add_home" : "search_off"} size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">
                {lots.length === 0 ? "No lots yet. Add your first lot to start accepting bookings." : "No lots match your search"}
              </p>
              {lots.length === 0 && (
                <Link
                  to="/owner/lots/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  <Icon name="add" size={20} />
                  Add First Lot
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <Link
        to="/owner/lots/new"
        className="fixed bottom-6 right-6 size-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
      >
        <Icon name="add" size={28} />
      </Link>
    </AppShell>
  )
}
