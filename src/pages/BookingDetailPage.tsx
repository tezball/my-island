import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, Button, ConfirmationModal } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { BookingStatusBadge } from '@/components/booking'
import { apiFetch } from '@/utils/api'
import type { Booking } from '@/types'

// Mock M22: Booking Detail Page
export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cancelModalOpen, setCancelModalOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/bookings/${id}`)
      return res.json()
    },
  })

  const booking: Booking | undefined = data?.booking

  const handleModify = () => {
    navigate(`/booking/${id}/modify/dates`)
  }

  const handleCancel = () => {
    setCancelModalOpen(true)
  }

  const handleConfirmCancel = () => {
    navigate(`/booking/${id}/cancelled`)
  }

  const handleViewTicket = () => {
    // Would open ticket view
  }

  const handleGetDirections = () => {
    // Would open maps
  }

  const handleContactHost = () => {
    navigate(`/booking/${id}/contact`)
  }

  if (isLoading || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Icon name="progress_activity" className="animate-spin text-primary text-4xl" />
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isUpcoming = new Date(booking.checkIn) > new Date()
  const isPending = booking.status === 'pending'
  const isConfirmed = booking.status === 'confirmed'

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        showHome
        title="Booking Details"
        rightAction={
          <button className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center">
            <Icon name="share" />
          </button>
        }
      />

      <div className="flex-1 pb-32">
        {/* Hero Image */}
        <div className="relative aspect-video max-h-48">
          <img
            src={booking.campsiteImage}
            alt={booking.campsiteName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>

        <div className="px-4 py-6 max-w-md mx-auto space-y-6">
          {/* Campsite Info */}
          <div>
            <h1 className="text-xl font-bold mb-1">{booking.campsiteName}</h1>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Icon name="location_on" className="text-base" />
              <span>{booking.campsiteLocation || 'Location'}</span>
            </div>
          </div>

          {/* Quick Actions */}
          {isUpcoming && isConfirmed && (
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleViewTicket}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Icon name="confirmation_number" className="text-xl text-primary" />
                <span className="text-[10px] font-medium text-primary">Ticket</span>
              </button>
              <button
                onClick={handleGetDirections}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <Icon name="directions" className="text-xl text-gray-600 dark:text-gray-400" />
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Directions</span>
              </button>
              <button
                onClick={handleContactHost}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <Icon name="chat" className="text-xl text-gray-600 dark:text-gray-400" />
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Contact</span>
              </button>
              <button
                onClick={() => navigate(`/booking/${id}/checkin`)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <Icon name="info" className="text-xl text-gray-600 dark:text-gray-400" />
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Check-in</span>
              </button>
            </div>
          )}

          {/* Booking Details */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 space-y-4">
            <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wide">
              Booking Details
            </h3>

            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="calendar_today" className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Dates</p>
                <p className="font-semibold text-sm">
                  {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="group" className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Guests</p>
                <p className="font-semibold text-sm">
                  {booking.guests?.adults || 2} Adults
                  {booking.guests?.children ? `, ${booking.guests.children} Children` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="camping" className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Lot</p>
                <p className="font-semibold text-sm">{booking.lotName || 'Riverside Spot #12'}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wide">
              Payment Summary
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Accommodation</span>
                <span className="font-medium">€{booking.totalPrice - 15}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service fee</span>
                <span className="font-medium">€15.00</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">€{booking.totalPrice}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/booking/${id}/receipt`)}
              className="w-full text-sm text-primary font-medium mt-2"
            >
              View Receipt →
            </button>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-gray-50 dark:bg-surface-dark rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Icon name="policy" className="text-gray-400 text-xl mt-0.5" />
              <div>
                <h4 className="font-bold text-sm mb-1">Cancellation Policy</h4>
                <p className="text-xs text-gray-500">
                  Free cancellation until 48 hours before check-in. After that, the first night is non-refundable.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isUpcoming && (
            <div className="space-y-3">
              {(isPending || isConfirmed) && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleModify}
                >
                  <Icon name="edit" className="mr-2" />
                  Modify Booking
                </Button>
              )}
              <button
                onClick={handleCancel}
                className="w-full h-12 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking?"
        message={`Are you sure you want to cancel your stay at ${booking.campsiteName}?`}
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="No, Keep Booking"
        variant="danger"
        icon="warning"
      >
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl p-3 mt-2">
          <div className="flex items-start gap-2">
            <Icon name="info" className="text-red-500 text-sm mt-0.5" />
            <p className="text-xs text-red-600 dark:text-red-400">
              Note: Canceling less than 48 hours in advance will incur a <strong>50% fee</strong>.
            </p>
          </div>
        </div>
      </ConfirmationModal>
    </div>
  )
}
