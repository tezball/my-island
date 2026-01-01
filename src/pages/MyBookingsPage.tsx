import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import EmptyState from '../components/ui/EmptyState'
import { bookings, getCampsiteById } from '../data/mockData'
import type { Booking } from '../data/types'

type TabType = 'upcoming' | 'past'

const statusColors: Record<Booking['status'], 'success' | 'warning' | 'info' | 'default' | 'error'> = {
  pending: 'warning',
  confirmed: 'success',
  checked_in: 'info',
  completed: 'default',
  cancelled: 'error',
}

const statusLabels: Record<Booking['status'], string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function MyBookingsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('upcoming')

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed' || b.status === 'checked_in'
  )
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  )

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings

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
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'past'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Past ({pastBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-auto">
          {displayedBookings.length === 0 ? (
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
                  ? { label: 'Explore Campsites', onClick: () => {} }
                  : undefined
              }
            />
          ) : (
            <div className="p-4 space-y-4">
              {displayedBookings.map((booking) => {
                const campsite = getCampsiteById(booking.campsiteId)
                if (!campsite) return null

                return (
                  <Link
                    key={booking.id}
                    to={`/bookings/${booking.id}`}
                    className="block bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800"
                  >
                    <div className="relative">
                      <img
                        src={campsite.images[0]}
                        alt={campsite.name}
                        className="w-full h-32 object-cover"
                      />
                      <Badge
                        variant={statusColors[booking.status]}
                        className="absolute top-3 right-3"
                      >
                        {statusLabels[booking.status]}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {campsite.name}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <Icon name="location_on" size={14} />
                        {campsite.location.county}
                      </p>

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
                      {booking.status === 'completed' && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            leftIcon="rate_review"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              navigate(`/campsite/${campsite.id}/review`)
                            }}
                          >
                            Write a Review
                          </Button>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
