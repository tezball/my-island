import type { Booking } from '@/types'
import { mockCampsites, mockExtras } from './campsites'

// Helper to get campsite by ID
const getCampsite = (id: string) => mockCampsites.find(c => c.id === id)!
const getLot = (campsiteId: string, lotId: string) => getCampsite(campsiteId).lots.find(l => l.id === lotId)!

// Date helpers for relative dates
const today = new Date()
const formatDate = (d: Date) => d.toISOString().split('T')[0]
const addDays = (days: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + days)
  return formatDate(d)
}
const subtractDays = (days: number) => addDays(-days)

export const mockBookings: Booking[] = [
  // UPCOMING BOOKINGS (relative to today)
  {
    id: 'b1',
    reference: 'ISL-2025-8821',
    campsiteId: '1',
    campsite: getCampsite('1'),
    lotId: 'lot1',
    lot: getLot('1', 'lot1'),
    checkIn: addDays(12),
    checkOut: addDays(15),
    nights: 3,
    guests: { adults: 2, children: 1 },
    extras: [mockExtras[0], mockExtras[2], mockExtras[10]],
    status: 'confirmed',
    totalPrice: 159,
    createdAt: subtractDays(14) + 'T10:30:00Z',
  },
  {
    id: 'b2',
    reference: 'ISL-2025-9156',
    campsiteId: '4',
    campsite: getCampsite('4'),
    lotId: 'lot1',
    lot: getLot('4', 'lot1'),
    checkIn: addDays(45),
    checkOut: addDays(47),
    nights: 2,
    guests: { adults: 2, children: 0 },
    extras: [mockExtras[3], mockExtras[9]],
    status: 'confirmed',
    totalPrice: 151,
    createdAt: subtractDays(9) + 'T14:45:00Z',
  },
  {
    id: 'b3',
    reference: 'ISL-2025-9234',
    campsiteId: '9',
    campsite: getCampsite('9'),
    lotId: 'lot2',
    lot: getLot('9', 'lot2'),
    checkIn: addDays(82),
    checkOut: addDays(85),
    nights: 3,
    guests: { adults: 4, children: 2 },
    extras: [mockExtras[2], mockExtras[8]],
    status: 'confirmed',
    totalPrice: 302,
    createdAt: subtractDays(7) + 'T09:15:00Z',
  },
  {
    id: 'b4',
    reference: 'ISL-2025-9301',
    campsiteId: '5',
    campsite: getCampsite('5'),
    lotId: 'lot3',
    lot: getLot('5', 'lot3'),
    checkIn: addDays(97),
    checkOut: addDays(100),
    nights: 3,
    guests: { adults: 2, children: 0 },
    extras: [],
    status: 'confirmed',
    totalPrice: 267,
    createdAt: subtractDays(6) + 'T16:20:00Z',
  },

  // PAST BOOKINGS - Completed (relative to today)
  {
    id: 'b5',
    reference: 'ISL-2025-7234',
    campsiteId: '6',
    campsite: getCampsite('6'),
    lotId: 'lot2',
    lot: getLot('6', 'lot2'),
    checkIn: subtractDays(137),
    checkOut: subtractDays(133),
    nights: 4,
    guests: { adults: 2, children: 2 },
    extras: [mockExtras[0], mockExtras[4], mockExtras[10]],
    status: 'completed',
    totalPrice: 175,
    createdAt: subtractDays(163) + 'T11:00:00Z',
  },
  {
    id: 'b6',
    reference: 'ISL-2025-6891',
    campsiteId: '7',
    campsite: getCampsite('7'),
    lotId: 'lot1',
    lot: getLot('7', 'lot1'),
    checkIn: subtractDays(182),
    checkOut: subtractDays(179),
    nights: 3,
    guests: { adults: 2, children: 0 },
    extras: [mockExtras[2]],
    status: 'completed',
    totalPrice: 138,
    createdAt: subtractDays(198) + 'T08:30:00Z',
  },
  {
    id: 'b7',
    reference: 'ISL-2025-5567',
    campsiteId: '4',
    campsite: getCampsite('4'),
    lotId: 'lot2',
    lot: getLot('4', 'lot2'),
    checkIn: subtractDays(224),
    checkOut: subtractDays(221),
    nights: 3,
    guests: { adults: 2, children: 1 },
    extras: [mockExtras[5], mockExtras[6]],
    status: 'completed',
    totalPrice: 150,
    createdAt: subtractDays(243) + 'T13:45:00Z',
  },
  {
    id: 'b8',
    reference: 'ISL-2025-4321',
    campsiteId: '13',
    campsite: getCampsite('13'),
    lotId: 'lot1',
    lot: getLot('13', 'lot1'),
    checkIn: subtractDays(264),
    checkOut: subtractDays(261),
    nights: 3,
    guests: { adults: 2, children: 0 },
    extras: [mockExtras[8]],
    status: 'completed',
    totalPrice: 119,
    createdAt: subtractDays(280) + 'T10:15:00Z',
  },
  {
    id: 'b9',
    reference: 'ISL-2025-3456',
    campsiteId: '16',
    campsite: getCampsite('16'),
    lotId: 'lot1',
    lot: getLot('16', 'lot1'),
    checkIn: subtractDays(191),
    checkOut: subtractDays(187),
    nights: 4,
    guests: { adults: 2, children: 2 },
    extras: [mockExtras[0], mockExtras[2], mockExtras[11]],
    status: 'completed',
    totalPrice: 187,
    createdAt: subtractDays(212) + 'T09:00:00Z',
  },
  {
    id: 'b10',
    reference: 'ISL-2025-2789',
    campsiteId: '15',
    campsite: getCampsite('15'),
    lotId: 'lot2',
    lot: getLot('15', 'lot2'),
    checkIn: subtractDays(116),
    checkOut: subtractDays(113),
    nights: 3,
    guests: { adults: 2, children: 0 },
    extras: [mockExtras[5], mockExtras[6]],
    status: 'completed',
    totalPrice: 135,
    createdAt: subtractDays(132) + 'T14:30:00Z',
  },

  // Cancelled booking
  {
    id: 'b11',
    reference: 'ISL-2025-8100',
    campsiteId: '2',
    campsite: getCampsite('2'),
    lotId: 'lot1',
    lot: getLot('2', 'lot1'),
    checkIn: subtractDays(76),
    checkOut: subtractDays(73),
    nights: 3,
    guests: { adults: 2, children: 0 },
    extras: [],
    status: 'cancelled',
    totalPrice: 195,
    createdAt: subtractDays(93) + 'T11:45:00Z',
  },
]

let bookingCounter = 9400

export function generateBookingReference(): string {
  bookingCounter++
  return `ISL-2025-${bookingCounter}`
}
