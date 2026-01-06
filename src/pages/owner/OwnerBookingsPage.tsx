import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import SearchBar from '../../components/ui/SearchBar'
import Icon from '../../components/ui/Icon'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import PropertySelector from '../../components/owner/PropertySelector'
import { useProperty } from '../../context/PropertyContext'
import { ownerApi, type OwnerBookingResponse } from '../../lib/api/owner'

type FilterStatus = 'all' | 'confirmed' | 'cancelled' | 'pending'

export default function OwnerBookingsPage() {
  const navigate = useNavigate()
  const { selectedCampsiteId } = useProperty()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [bookings, setBookings] = useState<OwnerBookingResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true)
      try {
        const params = selectedCampsiteId !== 'all'
          ? { campsiteId: selectedCampsiteId }
          : undefined
        const response = await ownerApi.getOwnerBookings(params)
        setBookings(response.content)
      } catch (err) {
        console.error('Failed to fetch bookings:', err)
        setBookings([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchBookings()
  }, [selectedCampsiteId])

  // Filter bookings by search and status
  const filteredBookings = bookings.filter(booking => {
    const guestName = booking.guest?.name || 'Guest'
    const matchesSearch =
      guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.campsite?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const normalizedStatus = booking.status.toLowerCase()
    const matchesStatus =
      filterStatus === 'all' ||
      normalizedStatus === filterStatus ||
      (filterStatus === 'confirmed' && (normalizedStatus === 'confirmed' || normalizedStatus === 'completed' || normalizedStatus === 'checked_in'))
    return matchesSearch && matchesStatus
  })

  const filters: { value: FilterStatus; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: '' },
    { value: 'pending', label: 'Pending', icon: 'schedule' },
    { value: 'confirmed', label: 'Confirmed', icon: 'check' },
    { value: 'cancelled', label: 'Cancelled', icon: 'close' },
  ]

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>
      case 'cancelled':
        return <Badge variant="error">Cancelled</Badge>
      case 'completed':
        return <Badge variant="info">Completed</Badge>
      case 'checked_in':
        return <Badge variant="success">Checked In</Badge>
      default:
        return <Badge>{status}</Badge>
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
    ['CONFIRMED', 'CHECKED_IN', 'PENDING'].includes(b.status)
  ).length

  const totalRevenue = bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum: number, b) => sum + b.totalPrice, 0)

  if (isLoading) {
    return (
      <AppShell showBack headerTitle="Bookings" showNav={false}>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
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
        {/* Property Selector */}
        <div className="p-4 pb-0">
          <PropertySelector showAllOption label="Filter by Property" />
        </div>

        {/* Search */}
        <div className="p-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search guest, booking ID, or property..."
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
              {filteredBookings.length} Booking{filteredBookings.length !== 1 ? 's' : ''}
            </h3>
            <button
              onClick={() => navigate('/owner/calendar')}
              className="text-primary text-sm font-medium"
            >
              View Calendar
            </button>
          </div>

          <div className="space-y-3 pb-6">
            {filteredBookings.map(booking => {
              const guestName = booking.guest?.name || 'Guest'
              const guestInitials = guestName.split(' ').map(n => n[0]).join('').slice(0, 2)

              return (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800"
                >
                  {/* Property badge - shown when viewing all properties */}
                  {selectedCampsiteId === 'all' && booking.campsite?.name && (
                    <div className="mb-3 -mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md">
                        <Icon name="location_on" size={12} />
                        {booking.campsite.name}
                      </span>
                    </div>
                  )}

                  {/* Guest info */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {booking.guest?.avatarUrl ? (
                        <img
                          src={booking.guest.avatarUrl}
                          alt={guestName}
                          className="size-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {guestInitials}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {guestName}
                        </p>
                        <p className="text-xs text-slate-500">#{booking.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  {/* Booking details */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                    <Icon name="bed" size={16} />
                    <span>{booking.lot?.name || 'Unknown Lot'}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
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
                      className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Icon name="chevron_right" size={20} className="text-slate-600 dark:text-slate-400" />
                    </Link>
                  </div>
                </div>
              )
            })}

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <Icon name="event_busy" size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 mb-2">No bookings found</p>
                <p className="text-sm text-slate-400">
                  {searchQuery ? 'Try a different search term' : 'Bookings will appear here when guests book your properties'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
