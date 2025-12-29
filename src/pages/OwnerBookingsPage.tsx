import { useState, useMemo } from 'react'
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

type DateFilter = 'all' | 'today' | 'week' | 'month' | 'custom'

function getDateRange(filter: DateFilter, customStart?: string, customEnd?: string): { start: Date; end: Date } | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (filter) {
    case 'today':
      const endOfToday = new Date(today)
      endOfToday.setHours(23, 59, 59, 999)
      return { start: today, end: endOfToday }
    case 'week': {
      const endOfWeek = new Date(today)
      endOfWeek.setDate(today.getDate() + 7)
      return { start: today, end: endOfWeek }
    }
    case 'month': {
      const endOfMonth = new Date(today)
      endOfMonth.setMonth(today.getMonth() + 1)
      return { start: today, end: endOfMonth }
    }
    case 'custom':
      if (customStart && customEnd) {
        return { start: new Date(customStart), end: new Date(customEnd) }
      }
      return null
    default:
      return null
  }
}

// Generate dates relative to today for realistic filtering
const today = new Date()
const formatDate = (d: Date) => d.toISOString().split('T')[0]
const addDays = (d: Date, days: number) => {
  const result = new Date(d)
  result.setDate(result.getDate() + days)
  return result
}

const MOCK_BOOKINGS: OwnerBooking[] = [
  {
    id: '1',
    guestName: 'Sarah Jenkins',
    checkIn: formatDate(today),
    checkOut: formatDate(addDays(today, 2)),
    lotName: 'Riverside Tent #7',
    guests: 2,
    status: 'active',
    totalAmount: 180,
  },
  {
    id: '2',
    guestName: 'Mike Peterson',
    checkIn: formatDate(addDays(today, 3)),
    checkOut: formatDate(addDays(today, 6)),
    lotName: 'Forest Cabin #3',
    guests: 4,
    status: 'upcoming',
    totalAmount: 450,
  },
  {
    id: '3',
    guestName: 'Emma Wilson',
    checkIn: formatDate(addDays(today, 10)),
    checkOut: formatDate(addDays(today, 12)),
    lotName: 'Lakeside Glamping #1',
    guests: 2,
    status: 'upcoming',
    totalAmount: 320,
  },
  {
    id: '4',
    guestName: 'James Brown',
    checkIn: formatDate(addDays(today, -5)),
    checkOut: formatDate(addDays(today, -3)),
    lotName: 'Mountain View RV Spot',
    guests: 3,
    status: 'completed',
    totalAmount: 200,
  },
  {
    id: '5',
    guestName: 'Lisa Chen',
    checkIn: formatDate(addDays(today, 20)),
    checkOut: formatDate(addDays(today, 23)),
    lotName: 'Sunset Glamping #2',
    guests: 2,
    status: 'upcoming',
    totalAmount: 380,
  },
  {
    id: '6',
    guestName: 'Tom Richards',
    checkIn: formatDate(addDays(today, -10)),
    checkOut: formatDate(addDays(today, -8)),
    lotName: 'Forest Cabin #1',
    guests: 5,
    status: 'cancelled',
    totalAmount: 520,
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
  const [statusFilter, setStatusFilter] = useState<FilterType>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)

  const filteredBookings = useMemo(() => {
    let results = MOCK_BOOKINGS

    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter((b) => b.status === statusFilter)
    }

    // Apply date filter
    const dateRange = getDateRange(dateFilter, customStartDate, customEndDate)
    if (dateRange) {
      results = results.filter((b) => {
        const checkIn = new Date(b.checkIn)
        return checkIn >= dateRange.start && checkIn <= dateRange.end
      })
    }

    return results
  }, [statusFilter, dateFilter, customStartDate, customEndDate])

  const stats = {
    upcoming: MOCK_BOOKINGS.filter((b) => b.status === 'upcoming').length,
    active: MOCK_BOOKINGS.filter((b) => b.status === 'active').length,
    revenue: MOCK_BOOKINGS.filter(
      (b) => b.status === 'completed' || b.status === 'active'
    ).reduce((sum, b) => sum + b.totalAmount, 0),
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        showHome
        title="Bookings" />

      <div className="flex-1 px-4 pb-28">
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

        {/* Date Filter */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Range</p>
            {dateFilter !== 'all' && (
              <button
                onClick={() => {
                  setDateFilter('all')
                  setCustomStartDate('')
                  setCustomEndDate('')
                }}
                className="text-xs text-primary font-medium"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {([
              { value: 'all', label: 'All Dates', icon: 'date_range' },
              { value: 'today', label: 'Today', icon: 'today' },
              { value: 'week', label: 'This Week', icon: 'view_week' },
              { value: 'month', label: 'This Month', icon: 'calendar_month' },
              { value: 'custom', label: 'Custom', icon: 'edit_calendar' },
            ] as const).map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  if (f.value === 'custom') {
                    setShowDatePicker(true)
                  } else {
                    setDateFilter(f.value)
                    setShowDatePicker(false)
                  }
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border',
                  dateFilter === f.value
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                )}
              >
                <Icon name={f.icon} className="text-base" />
                {f.label}
              </button>
            ))}
          </div>

          {/* Custom Date Picker */}
          {showDatePicker && (
            <div className="mt-3 p-4 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (customStartDate && customEndDate) {
                      setDateFilter('custom')
                      setShowDatePicker(false)
                    }
                  }}
                  disabled={!customStartDate || !customEndDate}
                  className="flex-1 py-2 text-sm font-medium bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {(['all', 'upcoming', 'active', 'completed', 'cancelled'] as FilterType[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize',
                  statusFilter === f
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
