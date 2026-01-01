import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Campsite, Lot, BookingExtra } from '../data/types'

interface BookingDates {
  checkIn: Date | null
  checkOut: Date | null
}

interface BookingGuests {
  adults: number
  children: number
}

interface BookingState {
  campsite: Campsite | null
  lot: Lot | null
  dates: BookingDates
  guests: BookingGuests
  extras: BookingExtra[]
  promoCode: string | null
  promoDiscount: number
}

interface PriceBreakdown {
  nightlyRate: number
  nights: number
  accommodationTotal: number
  extrasTotal: number
  subtotal: number
  serviceFee: number
  discount: number
  total: number
}

interface BookingContextType extends BookingState {
  // Actions
  setCampsite: (campsite: Campsite) => void
  setLot: (lot: Lot) => void
  setDates: (dates: BookingDates) => void
  setGuests: (guests: BookingGuests) => void
  addExtra: (extra: BookingExtra) => void
  removeExtra: (extraId: string) => void
  updateExtraQuantity: (extraId: string, quantity: number) => void
  applyPromoCode: (code: string) => Promise<boolean>
  clearPromoCode: () => void
  clearBooking: () => void

  // Computed values
  isBookingValid: boolean
  nights: number
  totalGuests: number
  priceBreakdown: PriceBreakdown | null
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

const BOOKING_STORAGE_KEY = 'my-island-booking'
const SERVICE_FEE_PERCENTAGE = 0.05 // 5% service fee

const initialState: BookingState = {
  campsite: null,
  lot: null,
  dates: { checkIn: null, checkOut: null },
  guests: { adults: 1, children: 0 },
  extras: [],
  promoCode: null,
  promoDiscount: 0,
}

// Helper to serialize dates for storage
const serializeState = (state: BookingState): string => {
  return JSON.stringify({
    ...state,
    dates: {
      checkIn: state.dates.checkIn?.toISOString() || null,
      checkOut: state.dates.checkOut?.toISOString() || null,
    },
  })
}

// Helper to deserialize dates from storage
const deserializeState = (stored: string): BookingState | null => {
  try {
    const parsed = JSON.parse(stored)
    return {
      ...parsed,
      dates: {
        checkIn: parsed.dates.checkIn ? new Date(parsed.dates.checkIn) : null,
        checkOut: parsed.dates.checkOut ? new Date(parsed.dates.checkOut) : null,
      },
    }
  } catch {
    return null
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState)

  // Restore state from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(BOOKING_STORAGE_KEY)
    if (stored) {
      const restored = deserializeState(stored)
      if (restored) {
        // Validate that dates are still in the future
        const now = new Date()
        if (restored.dates.checkIn && new Date(restored.dates.checkIn) < now) {
          // Dates are stale, clear the booking
          sessionStorage.removeItem(BOOKING_STORAGE_KEY)
        } else {
          setState(restored)
        }
      }
    }
  }, [])

  // Persist state to sessionStorage on changes
  useEffect(() => {
    if (state.campsite) {
      sessionStorage.setItem(BOOKING_STORAGE_KEY, serializeState(state))
    }
  }, [state])

  // Calculate nights between check-in and check-out
  const nights = state.dates.checkIn && state.dates.checkOut
    ? Math.ceil((state.dates.checkOut.getTime() - state.dates.checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const totalGuests = state.guests.adults + state.guests.children

  // Calculate price breakdown
  const priceBreakdown: PriceBreakdown | null = state.lot && nights > 0
    ? (() => {
        const nightlyRate = state.lot.pricePerNight
        const accommodationTotal = nightlyRate * nights
        const extrasTotal = state.extras.reduce((sum, e) => sum + e.price * e.quantity, 0)
        const subtotal = accommodationTotal + extrasTotal
        const serviceFee = Math.round(subtotal * SERVICE_FEE_PERCENTAGE * 100) / 100
        const discount = state.promoDiscount
        const total = Math.max(0, subtotal + serviceFee - discount)

        return {
          nightlyRate,
          nights,
          accommodationTotal,
          extrasTotal,
          subtotal,
          serviceFee,
          discount,
          total: Math.round(total * 100) / 100,
        }
      })()
    : null

  // Check if booking is valid and can proceed
  const isBookingValid = !!(
    state.campsite &&
    state.lot &&
    state.dates.checkIn &&
    state.dates.checkOut &&
    nights > 0 &&
    state.guests.adults >= 1 &&
    totalGuests <= (state.lot?.capacity || 0)
  )

  const setCampsite = useCallback((campsite: Campsite) => {
    setState(prev => ({
      ...prev,
      campsite,
      // Clear lot if changing campsite
      lot: prev.campsite?.id !== campsite.id ? null : prev.lot,
    }))
  }, [])

  const setLot = useCallback((lot: Lot) => {
    setState(prev => ({ ...prev, lot }))
  }, [])

  const setDates = useCallback((dates: BookingDates) => {
    setState(prev => ({ ...prev, dates }))
  }, [])

  const setGuests = useCallback((guests: BookingGuests) => {
    setState(prev => ({ ...prev, guests }))
  }, [])

  const addExtra = useCallback((extra: BookingExtra) => {
    setState(prev => {
      const existing = prev.extras.find(e => e.id === extra.id)
      if (existing) {
        return {
          ...prev,
          extras: prev.extras.map(e =>
            e.id === extra.id ? { ...e, quantity: e.quantity + extra.quantity } : e
          ),
        }
      }
      return { ...prev, extras: [...prev.extras, extra] }
    })
  }, [])

  const removeExtra = useCallback((extraId: string) => {
    setState(prev => ({
      ...prev,
      extras: prev.extras.filter(e => e.id !== extraId),
    }))
  }, [])

  const updateExtraQuantity = useCallback((extraId: string, quantity: number) => {
    if (quantity <= 0) {
      setState(prev => ({
        ...prev,
        extras: prev.extras.filter(e => e.id !== extraId),
      }))
    } else {
      setState(prev => ({
        ...prev,
        extras: prev.extras.map(e =>
          e.id === extraId ? { ...e, quantity } : e
        ),
      }))
    }
  }, [])

  const applyPromoCode = useCallback(async (code: string): Promise<boolean> => {
    // TODO: Replace with actual API call
    // const response = await api.post('/promo/validate', { code })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock promo codes
    const promoCodes: Record<string, number> = {
      'WELCOME10': 10,
      'SUMMER20': 20,
      'CAMPING50': 50,
    }

    const discount = promoCodes[code.toUpperCase()]
    if (discount) {
      setState(prev => ({
        ...prev,
        promoCode: code.toUpperCase(),
        promoDiscount: discount,
      }))
      return true
    }

    return false
  }, [])

  const clearPromoCode = useCallback(() => {
    setState(prev => ({
      ...prev,
      promoCode: null,
      promoDiscount: 0,
    }))
  }, [])

  const clearBooking = useCallback(() => {
    sessionStorage.removeItem(BOOKING_STORAGE_KEY)
    setState(initialState)
  }, [])

  return (
    <BookingContext.Provider
      value={{
        ...state,
        setCampsite,
        setLot,
        setDates,
        setGuests,
        addExtra,
        removeExtra,
        updateExtraQuantity,
        applyPromoCode,
        clearPromoCode,
        clearBooking,
        isBookingValid,
        nights,
        totalGuests,
        priceBreakdown,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

export default BookingContext
