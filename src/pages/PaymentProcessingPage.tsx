import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Icon } from '@/components/ui'
import { useBooking } from '@/context/BookingContext'
import { apiFetch } from '@/utils/api'

export function PaymentProcessingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { booking, reset } = useBooking()

  const createBooking = useMutation({
    mutationFn: async () => {
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          campsiteId: id,
          lotId: booking.lot?.id,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: booking.guests,
          extras: booking.extras.map((e) => e.id),
        }),
      })
      return res.json()
    },
    onSuccess: (data) => {
      reset()
      navigate(`/booking/${data.booking.id}/confirmed`, { replace: true })
    },
    onError: () => {
      navigate(`/book/${id}/summary`)
    },
  })

  useEffect(() => {
    // Simulate payment processing delay
    const timer = setTimeout(() => {
      createBooking.mutate()
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      <div className="text-center px-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon
            name="credit_card"
            size="xl"
            className="text-primary animate-pulse"
          />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Processing Payment
        </h1>
        <p className="text-slate-500">
          Please wait while we secure your booking...
        </p>
        <div className="mt-8 flex justify-center gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
