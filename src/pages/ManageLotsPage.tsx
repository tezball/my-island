import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, Button } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { cn } from '@/utils/cn'
import { apiFetch } from '@/utils/api'

interface Lot {
  id: string
  name: string
  type: 'tent' | 'rv' | 'cabin' | 'glamping'
  capacity: number
  price: number
  status: 'available' | 'booked' | 'maintenance'
  image: string
}

const TYPE_ICONS: Record<Lot['type'], string> = {
  tent: 'camping',
  rv: 'rv_hookup',
  cabin: 'cabin',
  glamping: 'auto_awesome',
}

const STATUS_STYLES: Record<Lot['status'], { label: string; className: string }> = {
  available: {
    label: 'Available',
    className: 'bg-green-100 dark:bg-green-900/20 text-green-600',
  },
  booked: {
    label: 'Booked',
    className: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600',
  },
  maintenance: {
    label: 'Maintenance',
    className: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600',
  },
}

export function ManageLotsPage() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['lots'],
    queryFn: async () => {
      const res = await apiFetch('/api/lots')
      return res.json()
    },
  })

  const lots: Lot[] = data?.lots || []

  const stats = {
    total: lots.length,
    available: lots.filter((l) => l.status === 'available').length,
    booked: lots.filter((l) => l.status === 'booked').length,
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        showHome
        title="Manage Lots"
        rightAction={
          <button
            onClick={() => navigate('/owner/lots/add')}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
          >
            <Icon name="add" className="text-white" />
          </button>
        }
      />

      <div className="flex-1 px-4 pb-8">
        {/* Stats */}
        <div className="flex gap-3 mt-4 mb-6">
          <div className="flex-1 bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-gray-500">Total Lots</p>
          </div>
          <div className="flex-1 bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-2xl font-bold text-green-600">
              {stats.available}
            </p>
            <p className="text-xs text-gray-500">Available</p>
          </div>
          <div className="flex-1 bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.booked}</p>
            <p className="text-xs text-gray-500">Booked</p>
          </div>
        </div>

        {/* Lots List */}
        <div className="space-y-3">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
                  <div className="flex">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 p-3 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : lots.map((lot) => {
            const status = STATUS_STYLES[lot.status]
            return (
              <button
                key={lot.id}
                onClick={() => navigate(`/owner/lots/${lot.id}/edit`)}
                className="w-full bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 text-left hover:border-primary/50 transition-colors"
              >
                <div className="flex">
                  <div
                    className="w-24 h-24 bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url("${lot.image}")` }}
                  />
                  <div className="flex-1 p-3">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-sm">{lot.name}</h3>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Icon name={TYPE_ICONS[lot.type]} className="text-sm" />
                      <span className="capitalize">{lot.type}</span>
                      <span>·</span>
                      <span>{lot.capacity} guests</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-primary">
                        ${lot.price}
                        <span className="text-xs text-gray-500 font-normal">
                          /night
                        </span>
                      </p>
                      <Icon
                        name="chevron_right"
                        className="text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Add Lot Button */}
        <div className="mt-6">
          <Button
            className="w-full"
            size="lg"
            onClick={() => navigate('/owner/lots/add')}
            leftIcon="add"
          >
            Add New Lot
          </Button>
        </div>
      </div>
    </div>
  )
}
