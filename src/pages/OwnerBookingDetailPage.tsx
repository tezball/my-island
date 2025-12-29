import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { cn } from '@/utils/cn'

// Mock M37: Owner Booking Detail Page
interface BookingDetail {
  id: string
  guestName: string
  guestEmail: string
  guestPhone: string
  checkIn: string
  checkOut: string
  lotName: string
  lotType: string
  guests: number
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  totalAmount: number
  bookingDate: string
  specialRequests?: string
  extras: { name: string; price: number }[]
}

const MOCK_BOOKING: BookingDetail = {
  id: '1',
  guestName: 'Sarah Jenkins',
  guestEmail: 'sarah.jenkins@email.com',
  guestPhone: '+1 (555) 123-4567',
  checkIn: '2024-12-20',
  checkOut: '2024-12-22',
  lotName: 'Riverside Tent #7',
  lotType: 'Tent Site',
  guests: 2,
  status: 'upcoming',
  totalAmount: 180,
  bookingDate: '2024-12-15',
  specialRequests: 'Early check-in if possible. Celebrating anniversary.',
  extras: [
    { name: 'Firewood Bundle', price: 15 },
    { name: 'Late Checkout', price: 25 },
  ],
}

const STATUS_STYLES: Record<
  BookingDetail['status'],
  { label: string; className: string }
> = {
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

export function OwnerBookingDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [booking] = useState(MOCK_BOOKING)

  const status = STATUS_STYLES[booking.status]
  const nights =
    Math.ceil(
      (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  const extrasTotal = booking.extras.reduce((sum, e) => sum + e.price, 0)
  const basePrice = booking.totalAmount - extrasTotal

  const handleContact = () => {
    // Would open contact modal
    alert(`Contacting ${booking.guestName}...`)
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      navigate('/owner/bookings')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        showHome
        title="Booking Details"
        rightAction={
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10">
            <Icon name="more_vert" />
          </button>
        }
      />

      <div className="flex-1 px-4 pb-32 overflow-y-auto">
        {/* Status Header */}
        <div className="flex items-center justify-between mt-4 mb-6">
          <span className={cn('px-3 py-1.5 rounded-full text-sm font-bold', status.className)}>
            {status.label}
          </span>
          <p className="text-sm text-gray-500">
            Booked on{' '}
            {new Date(booking.bookingDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Guest Info Card */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {booking.guestName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg">{booking.guestName}</h2>
              <p className="text-sm text-gray-500">{booking.guests} guests</p>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 text-sm">
              <Icon name="email" className="text-gray-400" />
              <span>{booking.guestEmail}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Icon name="phone" className="text-gray-400" />
              <span>{booking.guestPhone}</span>
            </div>
          </div>

          <button
            onClick={handleContact}
            className="w-full mt-4 flex items-center justify-center gap-2 h-12 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
          >
            <Icon name="chat" />
            Contact Guest
          </button>
        </section>

        {/* Stay Details */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 mb-4">
          <h3 className="font-bold mb-4">Stay Details</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                <Icon name="camping" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{booking.lotName}</p>
                <p className="text-sm text-gray-500">{booking.lotType}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                <Icon name="calendar_today" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">
                  {new Date(booking.checkIn).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  -{' '}
                  {new Date(booking.checkOut).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-gray-500">{nights} nights</p>
              </div>
            </div>
          </div>
        </section>

        {/* Special Requests */}
        {booking.specialRequests && (
          <section className="bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800 mb-4">
            <div className="flex items-start gap-3">
              <Icon name="info" className="text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-800 dark:text-yellow-400 mb-1">
                  Special Requests
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {booking.specialRequests}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Payment Summary */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 mb-4">
          <h3 className="font-bold mb-4">Payment Summary</h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {booking.lotName} x {nights} nights
              </span>
              <span>${basePrice.toFixed(2)}</span>
            </div>

            {booking.extras.map((extra) => (
              <div key={extra.name} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{extra.name}</span>
                <span>${extra.price.toFixed(2)}</span>
              </div>
            ))}

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

            <div className="flex justify-between font-bold">
              <span>Total Earned</span>
              <span className="text-primary">${booking.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Actions */}
        {booking.status === 'upcoming' && (
          <section className="space-y-3">
            <Button className="w-full" variant="outline" leftIcon="edit">
              Modify Booking
            </Button>
            <button
              onClick={handleCancel}
              className="w-full h-12 rounded-xl text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              Cancel Booking
            </button>
          </section>
        )}

        {booking.status === 'completed' && (
          <section className="text-center text-sm text-gray-500 py-4">
            <p>This booking has been completed.</p>
            <button className="text-primary font-semibold mt-2">
              View Receipt
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
