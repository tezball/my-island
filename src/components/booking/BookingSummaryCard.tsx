import { Link } from 'react-router-dom'
import type { Booking } from '@/types'
import { Icon } from '../ui'
import { BookingStatusBadge } from './BookingStatusBadge'

interface BookingSummaryCardProps {
  booking: Booking
  showActions?: boolean
}

export function BookingSummaryCard({ booking, showActions = true }: BookingSummaryCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-card border border-gray-100 dark:border-white/5">
      <div className="flex p-4 gap-4">
        {/* Image */}
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={booking.campsite.imageUrl}
            alt={booking.campsite.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
              {booking.campsite.name}
            </h3>
            <BookingStatusBadge status={booking.status} className="flex-shrink-0" />
          </div>

          <p className="text-sm text-slate-500 mt-0.5">{booking.lot.name}</p>

          <div className="flex items-center gap-1 mt-2 text-sm text-slate-600 dark:text-slate-400">
            <Icon name="calendar_today" size="sm" />
            <span>
              {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1 text-sm text-slate-600 dark:text-slate-400">
            <Icon name="person" size="sm" />
            <span>
              {booking.guests.adults} adult{booking.guests.adults > 1 ? 's' : ''}
              {booking.guests.children > 0 &&
                `, ${booking.guests.children} child${booking.guests.children > 1 ? 'ren' : ''}`}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (booking.status === 'confirmed' || booking.status === 'pending') && (
        <div className="flex border-t border-slate-100 dark:border-slate-800">
          <Link
            to={`/bookings/${booking.id}/dates`}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon name="edit" size="sm" />
            Modify
          </Link>
          <div className="w-px bg-slate-100 dark:bg-slate-800" />
          <Link
            to={`/campsite/${booking.campsiteId}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            <Icon name="visibility" size="sm" />
            View
          </Link>
        </div>
      )}
    </div>
  )
}
