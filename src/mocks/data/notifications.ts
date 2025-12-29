// Mock notifications data
export interface Notification {
  id: string
  type: 'booking' | 'offer' | 'review' | 'system' | 'message'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  meta?: {
    campsiteName?: string
    bookingRef?: string
    offerDiscount?: string
  }
}

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Booking Confirmed!',
    message: 'Your reservation at Wild Atlantic Camp has been confirmed for Dec 20-22.',
    timestamp: '2024-12-18T10:30:00Z',
    read: false,
    actionUrl: '/booking/1',
    meta: {
      campsiteName: 'Wild Atlantic Camp',
      bookingRef: 'ISL-2025-0001',
    },
  },
  {
    id: '2',
    type: 'offer',
    title: 'Flash Sale: 30% Off!',
    message: 'Connemara Glamping is offering 30% off all bookings this weekend.',
    timestamp: '2024-12-17T14:00:00Z',
    read: false,
    actionUrl: '/campsite/3',
    meta: {
      campsiteName: 'Connemara Glamping',
      offerDiscount: '30%',
    },
  },
  {
    id: '3',
    type: 'review',
    title: 'Thanks for your review!',
    message: 'Your review for Cliffs of Moher Camping has been published.',
    timestamp: '2024-12-16T09:15:00Z',
    read: true,
    actionUrl: '/campsite/5/reviews',
  },
  {
    id: '4',
    type: 'system',
    title: 'Complete your profile',
    message: 'Add a profile photo and verify your phone number to unlock all features.',
    timestamp: '2024-12-15T16:45:00Z',
    read: true,
    actionUrl: '/profile/edit',
  },
  {
    id: '5',
    type: 'message',
    title: 'New message from host',
    message: 'Hi! Just wanted to let you know we have fresh eggs available when you arrive.',
    timestamp: '2024-12-15T11:20:00Z',
    read: false,
    actionUrl: '/booking/1/contact',
    meta: {
      campsiteName: 'Wild Atlantic Camp',
    },
  },
  {
    id: '6',
    type: 'booking',
    title: 'Check-in reminder',
    message: 'Your stay at Burren Basecamp starts in 3 days! Check-in is from 2pm.',
    timestamp: '2024-12-14T08:00:00Z',
    read: true,
    actionUrl: '/booking/2/checkin',
    meta: {
      campsiteName: 'Burren Basecamp',
      bookingRef: 'ISL-2025-0002',
    },
  },
  {
    id: '7',
    type: 'offer',
    title: 'New experience nearby',
    message: 'Try kayaking with Atlantic Adventures - 20% off for my-island guests!',
    timestamp: '2024-12-13T15:30:00Z',
    read: true,
    actionUrl: '/supplier/1',
  },
  {
    id: '8',
    type: 'system',
    title: 'App update available',
    message: 'Version 1.2 is available with new features and improvements.',
    timestamp: '2024-12-12T10:00:00Z',
    read: true,
  },
]
