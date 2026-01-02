import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonBookingCard } from '../components/ui/Skeleton'
import bookingsApi from '../lib/api/bookings'
import type { Booking } from '../data/types'
import type { BookingResponse } from '../lib/api/bookings'

type TabType = 'upcoming' | 'past'

const statusColors: Record<Booking['status'], 'success' | 'warning' | 'info' | 'default' | 'error'> = {
  confirmed: 'success',
  checked_in: 'info',
  completed: 'default',
  cancelled: 'error',
}

const statusLabels: Record<Booking['status'], string> = {
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

// Normalize API status (uppercase) to local status (lowercase)
const normalizeStatus = (status: string): Booking['status'] => {
  return status.toLowerCase() as Booking['status']
}

export default function MyBookingsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('upcoming')
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [pastCount, setPastCount] = useState(0)

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch all bookings and filter on frontend
        const data = await bookingsApi.list({})

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const upcoming = data.filter(b => {
          const checkIn = new Date(b.checkIn)
          return checkIn >= today && b.status !== 'CANCELLED'
        })

        const past = data.filter(b => {
          const checkIn = new Date(b.checkIn)
          return checkIn < today || b.status === 'CANCELLED'
        })

        setUpcomingCount(upcoming.length)
        setPastCount(past.length)
        setBookings(activeTab === 'upcoming' ? upcoming : past)
      } catch (err) {
        console.error('Failed to fetch bookings:', err)
        setError('Failed to load bookings. Please try again.')
        setBookings([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [activeTab])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <AppShell showLogo headerTitle="My Bookings">
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'upcoming'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'past'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Past ({pastCount})
          </button>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <SkeletonBookingCard key={i} />
              ))}
            </div>
          ) : error ? (
            <EmptyState
              icon="error"
              title="Failed to load bookings"
              description={error}
              action={{ label: 'Try Again', onClick: () => window.location.reload() }}
            />
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={activeTab === 'upcoming' ? 'calendar_month' : 'history'}
              title={activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
              description={
                activeTab === 'upcoming'
                  ? 'Start exploring campsites to plan your next adventure!'
                  : 'Your completed trips will appear here.'
              }
              action={
                activeTab === 'upcoming'
                  ? { label: 'Explore Campsites', onClick: () => navigate('/') }
                  : undefined
              }
            />
          ) : (
            <div className="p-4 space-y-4">
              {bookings.map((booking) => (
                  <Link
                    key={booking.id}
                    to={`/bookings/${booking.id}`}
                    className="block bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800"
                  >
                    <div className="relative">
                      {booking.campsiteImage ? (
                        <img
                          src={booking.campsiteImage}
                          alt={booking.campsiteName}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <Icon name="camping" size={48} className="text-slate-400" />
                        </div>
                      )}
                      <Badge
                        variant={statusColors[normalizeStatus(booking.status)]}
                        className="absolute top-3 right-3"
                      >
                        {statusLabels[normalizeStatus(booking.status)]}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {booking.campsiteName}
                      </h3>
                      {booking.campsiteLocation && (
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <Icon name="location_on" size={14} />
                          {booking.campsiteLocation}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                            <Icon name="calendar_month" size={16} />
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                            <Icon name="group" size={16} />
                            {booking.guests}
                          </div>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          €{booking.totalPrice}
                        </p>
                      </div>

                      {/* Write Review button for completed bookings */}
                      {normalizeStatus(booking.status) === 'completed' && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            leftIcon="rate_review"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              navigate(`/campsite/${booking.campsiteId}/review`)
                            }}
                          >
                            Write a Review
                          </Button>
                        </div>
                      )}
                    </div>
                  </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
