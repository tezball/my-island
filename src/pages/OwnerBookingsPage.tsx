import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { cn } from '@/utils/cn'

// Mock M36: Owner Bookings Page
interface OwnerBooking {
  id: string
  guestName: string
  guestAvatar?: string
  checkIn: string
  checkOut: string
  lotName: string
  guests: number
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  totalAmount: number
}

const MOCK_BOOKINGS: OwnerBooking[] = [
  {
    id: '1',
    guestName: 'Sarah Jenkins',
    checkIn: '2024-12-20',
    checkOut: '2024-12-22',
    lotName: 'Riverside Tent #7',
    guests: 2,
    status: 'upcoming',
    totalAmount: 180,
  },
  {
    id: '2',
    guestName: 'Mike Peterson',
    checkIn: '2024-12-18',
    checkOut: '2024-12-21',
    lotName: 'Forest Cabin #3',
    guests: 4,
    status: 'active',
    totalAmount: 450,
  },
  {
    id: '3',
    guestName: 'Emma Wilson',
    checkIn: '2024-12-15',
    checkOut: '2024-12-17',
    lotName: 'Lakeside Glamping #1',
    guests: 2,
    status: 'completed',
    totalAmount: 320,
  },
  {
    id: '4',
    guestName: 'James Brown',
    checkIn: '2024-12-14',
    checkOut: '2024-12-16',
    lotName: 'Mountain View RV Spot',
    guests: 3,
    status: 'cancelled',
    totalAmount: 200,
  },
]

type FilterType = 'all' | 'upcoming' | 'active' | 'completed' | 'cancelled'

const STATUS_STYLES: Record<OwnerBooking['status'], { label: string; className: string }> = {
  upcoming: {
    label: 'Upcoming',
    className: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600',
  },
  active: {
    label: 'Active',
    className: 'bg-green-100 dark:bg-green-900/20 text-green-600',
  },
  completed: {
    label: 'Completed',
    className: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 dark:bg-red-900/20 text-red-600',
  },
}

export function OwnerBookingsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredBookings =
    filter === 'all'
      ? MOCK_BOOKINGS
      : MOCK_BOOKINGS.filter((b) => b.status === filter)

  const stats = {
    upcoming: MOCK_BOOKINGS.filter((b) => b.status === 'upcoming').length,
    active: MOCK_BOOKINGS.filter((b) => b.status === 'active').length,
    revenue: MOCK_BOOKINGS.filter(
      (b) => b.status === 'completed' || b.status === 'active'
    ).reduce((sum, b) => sum + b.totalAmount, 0),
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar title="Bookings" />

      <div className="flex-1 px-4 pb-8">
        {/* Stats */}
        <div className="flex gap-3 mt-4 mb-6">
          <div className="flex-1 bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
            <p className="text-xs text-gray-500">Upcoming</p>
          </div>
          <div className="flex-1 bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-xs text-gray-500">Active Now</p>
          </div>
          <div className="flex-1 bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <p className="text-2xl font-bold text-primary">
              ${stats.revenue}
            </p>
            <p className="text-xs text-gray-500">This Week</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {(['all', 'upcoming', 'active', 'completed', 'cancelled'] as FilterType[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize',
                  filter === f
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-surface-dark text-gray-600 dark:text-gray-400'
                )}
              >
                {f}
              </button>
            )
          )}
        </div>

        {/* Bookings List */}
        <div className="space-y-3">
          {filteredBookings.map((booking) => {
            const status = STATUS_STYLES[booking.status]
            return (
              <button
                key={booking.id}
                onClick={() => navigate(`/owner/booking/${booking.id}`)}
                className="w-full bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-left hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {booking.guestName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold">{booking.guestName}</p>
                      <p className="text-xs text-gray-500">
                        {booking.guests} guests
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      status.className
                    )}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Icon name="camping" className="text-base" />
                  <span>{booking.lotName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Icon name="calendar_today" className="text-base" />
                    <span>
                      {new Date(booking.checkIn).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      -{' '}
                      {new Date(booking.checkOut).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="font-bold text-primary">
                    ${booking.totalAmount}
                  </p>
                </div>
              </button>
            )
          })}

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Icon
                name="event_busy"
                className="text-5xl text-gray-300 dark:text-gray-600 mb-4"
              />
              <p className="text-gray-500">No bookings in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
