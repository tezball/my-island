import { http, HttpResponse, delay } from 'msw'
import { mockBookings, generateBookingReference } from '../data/bookings'
import { mockCampsites, mockExtras } from '../data/campsites'
import type { Booking, BookingGuests, Extra } from '@/types'

export const bookingHandlers = [
  http.get('/api/bookings', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    let results = [...mockBookings]

    if (status === 'upcoming') {
      results = results.filter(b => b.status === 'confirmed' || b.status === 'pending')
    } else if (status === 'past') {
      results = results.filter(b => b.status === 'completed' || b.status === 'cancelled')
    }

    return HttpResponse.json({ bookings: results })
  }),

  http.get('/api/bookings/:id', async ({ params }) => {
    await delay(300)
    const booking = mockBookings.find(b => b.id === params.id)

    if (!booking) {
      return HttpResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({ booking })
  }),

  http.post('/api/bookings', async ({ request }) => {
    await delay(800)
    const body = await request.json() as {
      campsiteId: string
      lotId: string
      checkIn: string
      checkOut: string
      guests: BookingGuests
      extras: string[]
    }

    const campsite = mockCampsites.find(c => c.id === body.campsiteId)
    if (!campsite) {
      return HttpResponse.json(
        { error: 'Campsite not found' },
        { status: 404 }
      )
    }

    const lot = campsite.lots.find(l => l.id === body.lotId)
    if (!lot) {
      return HttpResponse.json(
        { error: 'Lot not found' },
        { status: 404 }
      )
    }

    const checkIn = new Date(body.checkIn)
    const checkOut = new Date(body.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    const selectedExtras: Extra[] = body.extras
      .map(id => mockExtras.find(e => e.id === id))
      .filter((e): e is Extra => e !== undefined)

    const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0)
    const totalPrice = (lot.pricePerNight * nights) + extrasTotal

    const newBooking: Booking = {
      id: `b${mockBookings.length + 1}`,
      reference: generateBookingReference(),
      campsiteId: body.campsiteId,
      campsite,
      lotId: body.lotId,
      lot,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      nights,
      guests: body.guests,
      extras: selectedExtras,
      status: 'confirmed',
      totalPrice,
      createdAt: new Date().toISOString(),
    }

    mockBookings.push(newBooking)

    return HttpResponse.json({ booking: newBooking })
  }),

  http.patch('/api/bookings/:id', async ({ params, request }) => {
    await delay(500)
    const booking = mockBookings.find(b => b.id === params.id)

    if (!booking) {
      return HttpResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const updates = await request.json() as Partial<{
      checkIn: string
      checkOut: string
      guests: BookingGuests
      extras: string[]
    }>

    if (updates.checkIn) booking.checkIn = updates.checkIn
    if (updates.checkOut) booking.checkOut = updates.checkOut
    if (updates.guests) booking.guests = updates.guests
    if (updates.extras) {
      booking.extras = updates.extras
        .map(id => mockExtras.find(e => e.id === id))
        .filter((e): e is Extra => e !== undefined)
    }

    // Recalculate
    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)
    booking.nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    const extrasTotal = booking.extras.reduce((sum, e) => sum + e.price, 0)
    booking.totalPrice = (booking.lot.pricePerNight * booking.nights) + extrasTotal

    return HttpResponse.json({ booking })
  }),

  http.delete('/api/bookings/:id', async ({ params }) => {
    await delay(400)
    const index = mockBookings.findIndex(b => b.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    mockBookings[index].status = 'cancelled'

    return HttpResponse.json({ success: true })
  }),
]
