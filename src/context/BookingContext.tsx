import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Campsite, CampsiteLot, Extra, BookingGuests } from '@/types'

interface BookingState {
  campsite: Campsite | null
  lot: CampsiteLot | null
  checkIn: string | null
  checkOut: string | null
  guests: BookingGuests
  extras: Extra[]
}

interface BookingContextType {
  booking: BookingState
  setCampsite: (campsite: Campsite) => void
  setLot: (lot: CampsiteLot) => void
  setDates: (checkIn: string, checkOut: string) => void
  setGuests: (guests: BookingGuests) => void
  setExtras: (extras: Extra[]) => void
  toggleExtra: (extra: Extra) => void
  reset: () => void
  totalPrice: number
  nights: number
}

const initialState: BookingState = {
  campsite: null,
  lot: null,
  checkIn: null,
  checkOut: null,
  guests: { adults: 2, children: 0 },
  extras: [],
}

const BookingContext = createContext<BookingContextType | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(initialState)

  const setCampsite = (campsite: Campsite) => {
    setBooking(prev => ({ ...prev, campsite, lot: campsite.lots[0] }))
  }

  const setLot = (lot: CampsiteLot) => {
    setBooking(prev => ({ ...prev, lot }))
  }

  const setDates = (checkIn: string, checkOut: string) => {
    setBooking(prev => ({ ...prev, checkIn, checkOut }))
  }

  const setGuests = (guests: BookingGuests) => {
    setBooking(prev => ({ ...prev, guests }))
  }

  const setExtras = (extras: Extra[]) => {
    setBooking(prev => ({ ...prev, extras }))
  }

  const toggleExtra = (extra: Extra) => {
    setBooking(prev => {
      const exists = prev.extras.some(e => e.id === extra.id)
      if (exists) {
        return { ...prev, extras: prev.extras.filter(e => e.id !== extra.id) }
      }
      return { ...prev, extras: [...prev.extras, extra] }
    })
  }

  const reset = () => {
    setBooking(initialState)
  }

  const nights = booking.checkIn && booking.checkOut
    ? Math.ceil(
        (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
      )
    : 0

  const extrasTotal = booking.extras.reduce((sum, e) => sum + e.price, 0)
  const pricePerNight = booking.lot?.pricePerNight ?? 0
  const totalPrice = (pricePerNight * nights) + extrasTotal

  return (
    <BookingContext.Provider
      value={{
        booking,
        setCampsite,
        setLot,
        setDates,
        setGuests,
        setExtras,
        toggleExtra,
        reset,
        totalPrice,
        nights,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
