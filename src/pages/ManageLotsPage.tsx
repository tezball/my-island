import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { cn } from '@/utils/cn'

// Mock: Manage Campsite Lots Page
interface Lot {
  id: string
  name: string
  type: 'tent' | 'rv' | 'cabin' | 'glamping'
  capacity: number
  price: number
  status: 'available' | 'booked' | 'maintenance'
  image: string
}

const MOCK_LOTS: Lot[] = [
  {
    id: '1',
    name: 'Riverside Tent Site #1',
    type: 'tent',
    capacity: 4,
    price: 45,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200',
  },
  {
    id: '2',
    name: 'Forest Cabin #3',
    type: 'cabin',
    capacity: 6,
    price: 150,
    status: 'booked',
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=200',
  },
  {
    id: '3',
    name: 'Lakeside Glamping Pod',
    type: 'glamping',
    capacity: 2,
    price: 180,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=200',
  },
  {
    id: '4',
    name: 'RV Hookup Spot #5',
    type: 'rv',
    capacity: 8,
    price: 65,
    status: 'maintenance',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=200',
  },
]

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
  const [lots] = useState(MOCK_LOTS)

  const stats = {
    total: lots.length,
    available: lots.filter((l) => l.status === 'available').length,
    booked: lots.filter((l) => l.status === 'booked').length,
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
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
          {lots.map((lot) => {
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
