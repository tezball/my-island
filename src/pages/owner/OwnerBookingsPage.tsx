import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import SearchBar from '../../components/ui/SearchBar'
import Icon from '../../components/ui/Icon'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { bookingsApi, type BookingResponse } from '../../lib/api/bookings'

type FilterStatus = 'all' | 'confirmed' | 'cancelled'

// Extend BookingResponse with owner-specific fields
interface OwnerBookingView extends BookingResponse {
  guestName: string
  guestAvatar?: string
}

export default function OwnerBookingsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [bookings, setBookings] = useState<OwnerBookingView[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await bookingsApi.list()
        // Add mock guest info since API may not return it
        const ownerBookings: OwnerBookingView[] = data.map((b, i) => ({
          ...b,
          guestName: `Guest ${i + 1}`,
          guestAvatar: undefined,
        }))
        setBookings(ownerBookings)
      } catch (err) {
        console.error('Failed to fetch bookings:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBookings()
  }, [])

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    const normalizedStatus = booking.status.toLowerCase()
    const matchesStatus =
      filterStatus === 'all' ||
      normalizedStatus === filterStatus ||
      (filterStatus === 'confirmed' && normalizedStatus === 'completed')
    return matchesSearch && matchesStatus
  })

  const filters: { value: FilterStatus; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: '' },
    { value: 'confirmed', label: 'Confirmed', icon: 'check' },
    { value: 'cancelled', label: 'Cancelled', icon: 'close' },
  ]

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>
      case 'cancelled':
        return <Badge variant="error">Cancelled</Badge>
      case 'completed':
        return <Badge variant="info">Completed</Badge>
      case 'checked_in':
        return <Badge variant="success">Checked In</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      month: 'short',
      day: 'numeric',
    })
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const activeBookings = bookings.filter(b =>
    ['CONFIRMED', 'CHECKED_IN'].includes(b.status)
  ).length

  const totalRevenue = bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum: number, b) => sum + b.totalPrice, 0)

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Bookings" showNav={false}>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      showBack
      headerTitle="Bookings"
      showNav={false}
      headerRightAction={
        <button>
          <Icon name="help" size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      }
    >
      <div className="flex-1 overflow-auto">
        {/* Search */}
        <div className="p-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search guest name or booking ID..."
          />
        </div>

        {/* Filter tabs */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {filters.map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  filterStatus === filter.value
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {filter.icon && <Icon name={filter.icon} size={16} />}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 grid grid-cols-2 gap-3 pb-4">
          <div className="p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Active</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {activeBookings}
              <span className="text-xs text-emerald-500 font-medium">+2%</span>
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Revenue</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              €{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Bookings list */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Recent Bookings
            </h3>
            <button
              onClick={() => navigate('/owner/calendar')}
              className="text-primary text-sm font-medium"
            >
              View Calendar
            </button>
          </div>

          <div className="space-y-3 pb-6">
            {filteredBookings.map(booking => (
              <div
                key={booking.id}
                className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800"
              >
                {/* Guest info */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {booking.guestAvatar ? (
                      <img
                        src={booking.guestAvatar}
                        alt={booking.guestName}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {booking.guestName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {booking.guestName}
                      </p>
                      <p className="text-xs text-slate-500">#{booking.id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                {/* Booking details */}
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <Icon name="location_on" size={16} />
                  <span>{booking.campsiteName} • {booking.lotName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <Icon name="event" size={16} />
                  <span>
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)} ({calculateNights(booking.checkIn, booking.checkOut)} nights)
                  </span>
                </div>

                {/* Price and actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-lg text-slate-900 dark:text-white">
                    €{booking.totalPrice.toFixed(2)}
                  </p>
                  <Link
                    to={`/bookings/${booking.id}`}
                    className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
                  >
                    <Icon name="chevron_right" size={20} className="text-slate-600 dark:text-slate-400" />
                  </Link>
                </div>
              </div>
            ))}

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <Icon name="event_busy" size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No bookings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
