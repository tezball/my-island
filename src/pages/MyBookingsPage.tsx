import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import type { Booking } from '@/types'
import { cn } from '@/utils/cn'
import { Icon, BookingCardSkeleton, SegmentedControl, ConfirmationModal } from '@/components/ui'
import { apiFetch } from '@/utils/api'
import { AppShell } from '@/components/layout'
import { BookingStatusBadge } from '@/components/booking'

type Tab = 'upcoming' | 'past'

export function MyBookingsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('upcoming')
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', activeTab],
    queryFn: async () => {
      const res = await apiFetch(`/api/bookings?status=${activeTab}`)
      return res.json()
    },
  })

  const bookings: Booking[] = data?.bookings || []

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setCancelModalOpen(true)
  }

  const handleConfirmCancel = () => {
    // TODO: Implement cancel mutation
    setCancelModalOpen(false)
    setSelectedBooking(null)
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 pt-12 pb-2 flex items-center justify-between border-b border-gray-100 dark:border-gray-800/50">
        <h1 className="text-2xl font-bold tracking-tight flex-1">My Bookings</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors">
            <Icon name="search" />
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors relative">
            <Icon name="notifications" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-28">
        {/* Segmented Control */}
        <div className="py-4 sticky top-[80px] z-10 bg-background-light dark:bg-background-dark">
          <SegmentedControl
            options={[
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'past', label: 'Past' },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Bookings List */}
        <div className="flex flex-col gap-5">
          {isLoading ? (
            <>
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-60">
              <div className="bg-gray-100 dark:bg-surface-dark p-6 rounded-full mb-4">
                <Icon
                  name={activeTab === 'upcoming' ? 'forest' : 'history'}
                  className="text-4xl text-gray-400"
                />
              </div>
              <p className="text-sm font-medium text-gray-500">
                {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 text-primary font-bold text-sm"
              >
                Find a campsite
              </button>
            </div>
          ) : (
            bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isUpcoming={activeTab === 'upcoming'}
                onCancel={() => handleCancelClick(booking)}
                onModify={() => navigate(`/booking/${booking.id}/modify/dates`)}
                onRebook={() => navigate(`/book/${booking.campsiteId}/dates`)}
                onRate={() => navigate(`/booking/${booking.id}/review`)}
                onViewTicket={() => navigate(`/booking/${booking.id}/receipt`)}
                onViewMap={() => {
                  const coords = booking.campsite?.coordinates
                  if (coords) {
                    window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, '_blank')
                  } else {
                    navigate(`/campsite/${booking.campsiteId}`)
                  }
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking?"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep Booking"
        variant="danger"
        icon="event_busy"
      >
        {selectedBooking && (
          <div className="bg-gray-50 dark:bg-surface-dark rounded-xl p-3 text-left">
            <p className="font-semibold text-sm">{selectedBooking.campsite?.name}</p>
            <p className="text-xs text-slate-500">
              {new Date(selectedBooking.checkIn).toLocaleDateString()} - {new Date(selectedBooking.checkOut).toLocaleDateString()}
            </p>
          </div>
        )}
      </ConfirmationModal>
    </AppShell>
  )
}

interface BookingCardProps {
  booking: Booking
  isUpcoming: boolean
  onCancel: () => void
  onModify: () => void
  onRebook: () => void
  onRate: () => void
  onViewTicket: () => void
  onViewMap: () => void
}

interface MenuOption {
  label: string
  icon: string
  action: () => void
  danger?: boolean
}

function BookingCard({ booking, isUpcoming, onCancel, onModify, onRebook, onRate, onViewTicket, onViewMap }: BookingCardProps) {
  const [showOptions, setShowOptions] = useState(false)
  const navigate = useNavigate()
  const isCompleted = booking.status === 'completed'

  const menuOptions: MenuOption[] = isUpcoming
    ? [
        { label: 'View Details', icon: 'visibility', action: () => navigate(`/booking/${booking.id}`) },
        { label: 'Check-in Instructions', icon: 'info', action: () => navigate(`/booking/${booking.id}/check-in`) },
        { label: 'Contact Host', icon: 'chat', action: () => navigate(`/booking/${booking.id}/contact`) },
        { label: 'Modify Booking', icon: 'edit', action: onModify },
        { label: 'Cancel Booking', icon: 'cancel', action: onCancel, danger: true },
      ]
    : [
        { label: 'View Details', icon: 'visibility', action: () => navigate(`/booking/${booking.id}`) },
        { label: 'View Receipt', icon: 'receipt', action: () => navigate(`/booking/${booking.id}/receipt`) },
        { label: 'Rebook', icon: 'history', action: onRebook },
      ]

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-2xl bg-white dark:bg-surface-dark p-3 shadow-card hover:shadow-soft transition-all duration-300',
        isCompleted && 'opacity-80 hover:opacity-100'
      )}
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className={cn(
          'h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 relative',
          isCompleted && 'grayscale group-hover:grayscale-0 transition-all duration-300'
        )}>
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url('${booking.campsite?.imageUrl || ''}')` }}
          />
          {booking.campsite?.rating && (
            <div className="absolute top-1 left-1 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-0.5">
              <Icon name="star" filled className="text-yellow-500 text-[10px]" />
              <span className="text-[10px] font-bold">{booking.campsite.rating}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between py-1">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold leading-tight line-clamp-1">
                {booking.campsite?.name || 'Campsite'}
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Icon name="more_vert" className="text-[20px]" />
                </button>

                {/* Options Dropdown */}
                {showOptions && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowOptions(false)}
                    />
                    <div className="absolute right-0 top-8 z-20 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-float border border-gray-100 dark:border-gray-700 overflow-hidden">
                      {menuOptions.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => {
                            setShowOptions(false)
                            option.action()
                          }}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors',
                            option.danger && 'text-red-600 dark:text-red-400'
                          )}
                        >
                          <Icon name={option.icon} className="text-base" />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
              <Icon name="calendar_month" className="text-[14px]" />
              <span>
                {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Icon name="location_on" className="text-[14px]" />
              <span>{booking.campsite?.location || 'Location'}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 mt-2">
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="border-t border-gray-100 dark:border-gray-700/50 pt-3 mt-1 flex gap-3">
        {isUpcoming && (
          <>
            <button
              onClick={onViewTicket}
              className="flex-1 h-9 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary-dark dark:text-primary text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="airplane_ticket" className="text-[18px]" />
              View Ticket
            </button>
            <button
              onClick={onViewMap}
              className="h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
            >
              <Icon name="map" className="text-[18px]" />
            </button>
          </>
        )}

        {!isUpcoming && (
          <>
            <button
              onClick={onRebook}
              className="flex-1 h-9 rounded-lg bg-primary text-white dark:text-background-dark font-bold text-sm shadow-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="history" className="text-[18px]" />
              Rebook
            </button>
            <button
              onClick={onRate}
              className="flex-1 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
            >
              <Icon name="star" className="text-[16px] text-yellow-500" />
              Rate
            </button>
          </>
        )}
      </div>
    </div>
  )
}
