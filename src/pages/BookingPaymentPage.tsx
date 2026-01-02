import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import BookingExpiredState from '../components/booking/BookingExpiredState'
import { campsitesApi } from '../lib/api/campsites'
import { bookingsApi, type CreateBookingRequest } from '../lib/api/bookings'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

type PaymentMethod = 'card' | 'apple_pay' | 'google_pay'

interface CampsiteInfo {
  name: string
  image: string
  location: string
}

export default function BookingPaymentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const toast = useToast()
  const bookingState = location.state as {
    checkIn: string
    checkOut: string
    guests: number
    lotId: string
    extras: string[]
    totalPrice: number
    campsiteName?: string
    campsiteImage?: string
    campsiteLocation?: string
  } | null

  const [campsite, setCampsite] = useState<CampsiteInfo | null>(
    bookingState?.campsiteName
      ? {
          name: bookingState.campsiteName,
          image: bookingState.campsiteImage || '',
          location: bookingState.campsiteLocation || '',
        }
      : null
  )

  useEffect(() => {
    if (!campsite && id) {
      campsitesApi.getById(id).then((data) => {
        setCampsite({
          name: data.name,
          image: data.images[0] || '',
          location: data.location.county,
        })
      })
    }
  }, [id, campsite])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [isProcessing, setIsProcessing] = useState(false)

  // Card form state
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')

  // If booking state is missing, show expired state
  if (!bookingState || !bookingState.checkIn || !bookingState.checkOut) {
    return (
      <BookingExpiredState
        campsiteId={id}
        title="Booking details missing"
        message="Your booking session has expired. Please start a new booking to continue."
      />
    )
  }

  if (!campsite) {
    return (
      <AppShell showBack headerTitle="Payment" showNav={false}>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Campsite not found</p>
        </div>
      </AppShell>
    )
  }

  const handlePayment = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error('Login Required', 'Please log in to complete your booking.')
      // Store booking state and redirect to login
      navigate('/login', {
        state: {
          returnTo: `/book/${id}/payment`,
          bookingState: bookingState,
        },
      })
      return
    }

    setIsProcessing(true)
    try {
      // Create the booking via API
      const bookingRequest: CreateBookingRequest = {
        lotId: bookingState.lotId,
        checkIn: bookingState.checkIn,
        checkOut: bookingState.checkOut,
        guests: bookingState.guests,
        extras: {
          breakfast: bookingState.extras.includes('breakfast'),
          parking: bookingState.extras.includes('parking'),
          pets: bookingState.extras.includes('pets'),
        },
      }

      const bookingResponse = await bookingsApi.create(bookingRequest)

      // Navigate to confirmation with real booking data
      navigate(`/book/${id}/confirmation`, {
        state: {
          ...bookingState,
          bookingId: bookingResponse.id,
          paymentMethod,
          campsiteName: bookingResponse.campsiteName || campsite?.name,
          totalPrice: bookingResponse.totalPrice || bookingState.totalPrice,
        },
      })
    } catch (error) {
      console.error('Failed to create booking:', error)
      setIsProcessing(false)

      // Show error to user instead of silently failing
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage.includes('403')) {
        toast.error('Session Expired', 'Please log in again to complete your booking.')
        navigate('/login', {
          state: {
            returnTo: `/book/${id}/payment`,
            bookingState: bookingState,
          },
        })
      } else {
        toast.error('Booking Failed', 'Unable to complete your booking. Please try again.')
      }
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <AppShell showBack headerTitle="Payment" showNav={false} showNotifications={false}>
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          {/* Booking Summary */}
          <section className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              Booking Summary
            </h3>
            <div className="flex gap-3">
              <img
                src={campsite.image}
                alt={campsite.name}
                className="size-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {campsite.name}
                </h4>
                <p className="text-sm text-slate-500">{campsite.location}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Dates</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {formatDate(bookingState.checkIn)} - {formatDate(bookingState.checkOut)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Guests</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {bookingState.guests} guest{bookingState.guests !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              Payment Method
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon name="credit_card" size={24} className="text-slate-600 dark:text-slate-400" />
                <span className="flex-1 text-left font-medium text-slate-900 dark:text-white">
                  Credit / Debit Card
                </span>
                {paymentMethod === 'card' && (
                  <Icon name="check_circle" size={20} className="text-primary" filled />
                )}
              </button>

              <button
                onClick={() => setPaymentMethod('apple_pay')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === 'apple_pay'
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon name="phone_iphone" size={24} className="text-slate-600 dark:text-slate-400" />
                <span className="flex-1 text-left font-medium text-slate-900 dark:text-white">
                  Apple Pay
                </span>
                {paymentMethod === 'apple_pay' && (
                  <Icon name="check_circle" size={20} className="text-primary" filled />
                )}
              </button>

              <button
                onClick={() => setPaymentMethod('google_pay')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === 'google_pay'
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon name="android" size={24} className="text-slate-600 dark:text-slate-400" />
                <span className="flex-1 text-left font-medium text-slate-900 dark:text-white">
                  Google Pay
                </span>
                {paymentMethod === 'google_pay' && (
                  <Icon name="check_circle" size={20} className="text-primary" filled />
                )}
              </button>
            </div>
          </section>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <section className="space-y-4">
              <div>
                <label className="text-sm text-slate-500 mb-1 block">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-500 mb-1 block">Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-500 mb-1 block">CVC</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="123"
                    className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-500 mb-1 block">Name on Card</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Murphy"
                  className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </section>
          )}

          {/* Price Breakdown */}
          <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              Price Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Accommodation</span>
                <span className="text-slate-900 dark:text-white">
                  €{bookingState.totalPrice - (bookingState.extras.length * 10)}
                </span>
              </div>
              {bookingState.extras.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Extras</span>
                  <span className="text-slate-900 dark:text-white">
                    €{bookingState.extras.length * 10}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Service fee</span>
                <span className="text-slate-900 dark:text-white">€0</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white">Total</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  €{bookingState.totalPrice}
                </span>
              </div>
            </div>
          </section>

          {/* Security Note */}
          <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <Icon name="lock" size={20} className="text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="font-medium text-emerald-700 dark:text-emerald-300 text-sm">
                Secure Payment
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Your payment is processed securely. We don't store your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-28" />
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          leftIcon={isProcessing ? undefined : 'lock'}
          onClick={handlePayment}
          isLoading={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay €${bookingState.totalPrice}`}
        </Button>
      </div>
    </AppShell>
  )
}
