// Mock owner/admin data
export interface OwnerStats {
  views: number
  viewsChange: string
  alertsSent: number
  alertsChange: string
  activeGuests: number
  totalRevenue: number
  revenueChange: string
  occupancyRate: number
  upcomingBookings: number
  activeBookings: number
}

export interface OwnerBooking {
  id: string
  guestName: string
  guestEmail: string
  guestPhone: string
  guestAvatar?: string
  checkIn: string
  checkOut: string
  lotName: string
  lotType: string
  guests: number
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  totalAmount: number
  bookingDate: string
  specialRequests?: string
}

export interface OwnerLot {
  id: string
  name: string
  type: 'tent' | 'rv' | 'cabin' | 'glamping'
  capacity: number
  price: number
  status: 'available' | 'booked' | 'maintenance'
  image: string
  amenities: string[]
}

export interface OwnerOffer {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  discount?: string
  status: 'active' | 'draft' | 'expired'
  statusDate: string
  image: string
  views: number
}

export interface Transaction {
  id: string
  type: 'booking' | 'refund' | 'payout'
  description: string
  amount: number
  date: string
}

export const ownerStats: OwnerStats = {
  views: 1240,
  viewsChange: '+12%',
  alertsSent: 8,
  alertsChange: '+2%',
  activeGuests: 45,
  totalRevenue: 12450,
  revenueChange: '+18%',
  occupancyRate: 78,
  upcomingBookings: 12,
  activeBookings: 8,
}

export const ownerBookings: OwnerBooking[] = [
  {
    id: '1',
    guestName: 'Sarah Jenkins',
    guestEmail: 'sarah.jenkins@email.com',
    guestPhone: '+353 87 123 4567',
    checkIn: '2024-12-20',
    checkOut: '2024-12-22',
    lotName: 'Riverside Tent #7',
    lotType: 'Tent Site',
    guests: 2,
    status: 'upcoming',
    totalAmount: 180,
    bookingDate: '2024-12-15',
    specialRequests: 'Early check-in if possible. Celebrating anniversary.',
  },
  {
    id: '2',
    guestName: 'Mike Peterson',
    guestEmail: 'mike.p@email.com',
    guestPhone: '+353 86 234 5678',
    checkIn: '2024-12-18',
    checkOut: '2024-12-21',
    lotName: 'Forest Cabin #3',
    lotType: 'Cabin',
    guests: 4,
    status: 'active',
    totalAmount: 450,
    bookingDate: '2024-12-10',
  },
  {
    id: '3',
    guestName: 'Emma Wilson',
    guestEmail: 'emma.w@email.com',
    guestPhone: '+353 85 345 6789',
    checkIn: '2024-12-15',
    checkOut: '2024-12-17',
    lotName: 'Lakeside Glamping #1',
    lotType: 'Glamping',
    guests: 2,
    status: 'completed',
    totalAmount: 320,
    bookingDate: '2024-12-01',
  },
  {
    id: '4',
    guestName: 'James Brown',
    guestEmail: 'james.b@email.com',
    guestPhone: '+353 87 456 7890',
    checkIn: '2024-12-14',
    checkOut: '2024-12-16',
    lotName: 'Mountain View RV Spot',
    lotType: 'RV Spot',
    guests: 3,
    status: 'cancelled',
    totalAmount: 200,
    bookingDate: '2024-12-05',
  },
  {
    id: '5',
    guestName: 'Lisa O\'Connor',
    guestEmail: 'lisa.oc@email.com',
    guestPhone: '+353 86 567 8901',
    checkIn: '2024-12-22',
    checkOut: '2024-12-26',
    lotName: 'Sunset Pod #2',
    lotType: 'Glamping',
    guests: 2,
    status: 'upcoming',
    totalAmount: 560,
    bookingDate: '2024-12-16',
    specialRequests: 'Vegan breakfast options please.',
  },
  {
    id: '6',
    guestName: 'Tom Murphy',
    guestEmail: 'tom.m@email.com',
    guestPhone: '+353 85 678 9012',
    checkIn: '2024-12-23',
    checkOut: '2024-12-27',
    lotName: 'Family Cabin #1',
    lotType: 'Cabin',
    guests: 6,
    status: 'upcoming',
    totalAmount: 720,
    bookingDate: '2024-12-14',
  },
  {
    id: '7',
    guestName: 'Kate Ryan',
    guestEmail: 'kate.r@email.com',
    guestPhone: '+353 87 789 0123',
    checkIn: '2024-12-19',
    checkOut: '2024-12-20',
    lotName: 'Riverside Tent #3',
    lotType: 'Tent Site',
    guests: 2,
    status: 'active',
    totalAmount: 90,
    bookingDate: '2024-12-17',
  },
  {
    id: '8',
    guestName: 'David Kelly',
    guestEmail: 'david.k@email.com',
    guestPhone: '+353 86 890 1234',
    checkIn: '2024-12-10',
    checkOut: '2024-12-13',
    lotName: 'Hilltop RV Spot',
    lotType: 'RV Spot',
    guests: 4,
    status: 'completed',
    totalAmount: 270,
    bookingDate: '2024-12-01',
  },
]

export const ownerLots: OwnerLot[] = [
  {
    id: '1',
    name: 'Riverside Tent Site #1',
    type: 'tent',
    capacity: 4,
    price: 45,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200',
    amenities: ['Fire Pit', 'Picnic Table', 'Water Nearby'],
  },
  {
    id: '2',
    name: 'Riverside Tent Site #2',
    type: 'tent',
    capacity: 4,
    price: 45,
    status: 'booked',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200',
    amenities: ['Fire Pit', 'Picnic Table', 'Water Nearby'],
  },
  {
    id: '3',
    name: 'Forest Cabin #1',
    type: 'cabin',
    capacity: 6,
    price: 150,
    status: 'booked',
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=200',
    amenities: ['Electric', 'WiFi', 'Kitchen', 'Heating'],
  },
  {
    id: '4',
    name: 'Forest Cabin #2',
    type: 'cabin',
    capacity: 4,
    price: 120,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=200',
    amenities: ['Electric', 'WiFi', 'Kitchen', 'Heating'],
  },
  {
    id: '5',
    name: 'Lakeside Glamping Pod',
    type: 'glamping',
    capacity: 2,
    price: 180,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=200',
    amenities: ['Electric', 'WiFi', 'Hot Tub', 'Heating', 'Coffee Machine'],
  },
  {
    id: '6',
    name: 'Sunset Glamping Pod',
    type: 'glamping',
    capacity: 2,
    price: 195,
    status: 'booked',
    image: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=200',
    amenities: ['Electric', 'WiFi', 'Hot Tub', 'Heating', 'Deck'],
  },
  {
    id: '7',
    name: 'RV Hookup Spot #1',
    type: 'rv',
    capacity: 8,
    price: 65,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=200',
    amenities: ['Electric Hookup', 'Water Hookup', 'Dump Station'],
  },
  {
    id: '8',
    name: 'RV Hookup Spot #2',
    type: 'rv',
    capacity: 6,
    price: 55,
    status: 'maintenance',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=200',
    amenities: ['Electric Hookup', 'Water Hookup'],
  },
]

export const ownerOffers: OwnerOffer[] = [
  {
    id: '1',
    title: 'Weekend Kayak Rental',
    description: 'Full weekend kayak rental including paddles and life jackets.',
    price: 50,
    originalPrice: 62.5,
    discount: '-20%',
    status: 'active',
    statusDate: 'Until Dec 31',
    image: 'https://images.unsplash.com/photo-1604715892639-ce966d0a3f6c?w=200',
    views: 245,
  },
  {
    id: '2',
    title: 'Family BBQ Pack',
    description: 'Everything you need for a family BBQ - meat, sides, and equipment.',
    price: 85,
    status: 'draft',
    statusDate: 'Edited 2h ago',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200',
    views: 0,
  },
  {
    id: '3',
    title: 'Sunset Glamping Experience',
    description: 'Premium glamping pod with champagne, breakfast, and late checkout.',
    price: 120,
    status: 'expired',
    statusDate: 'Ended Nov 30',
    image: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=200',
    views: 567,
  },
  {
    id: '4',
    title: 'Surf Lesson Bundle',
    description: '2-hour group surf lesson with all equipment included.',
    price: 140,
    originalPrice: 165,
    discount: '-15%',
    status: 'active',
    statusDate: 'Until Jan 15',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=200',
    views: 389,
  },
  {
    id: '5',
    title: 'Stargazing Night',
    description: 'Guided stargazing session with telescope and hot chocolate.',
    price: 25,
    status: 'active',
    statusDate: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200',
    views: 156,
  },
]

export const transactions: Transaction[] = [
  {
    id: '1',
    type: 'booking',
    description: 'Riverside Tent #7 - Sarah J.',
    amount: 180,
    date: '2024-12-20',
  },
  {
    id: '2',
    type: 'booking',
    description: 'Forest Cabin #3 - Mike P.',
    amount: 450,
    date: '2024-12-19',
  },
  {
    id: '3',
    type: 'payout',
    description: 'Weekly payout to Bank ****1234',
    amount: -1250,
    date: '2024-12-18',
  },
  {
    id: '4',
    type: 'refund',
    description: 'Cancellation - James B.',
    amount: -200,
    date: '2024-12-17',
  },
  {
    id: '5',
    type: 'booking',
    description: 'Glamping Pod #1 - Emma W.',
    amount: 320,
    date: '2024-12-16',
  },
  {
    id: '6',
    type: 'booking',
    description: 'RV Spot - David K.',
    amount: 270,
    date: '2024-12-15',
  },
  {
    id: '7',
    type: 'payout',
    description: 'Weekly payout to Bank ****1234',
    amount: -980,
    date: '2024-12-11',
  },
  {
    id: '8',
    type: 'booking',
    description: 'Sunset Pod #2 - Lisa O.',
    amount: 560,
    date: '2024-12-16',
  },
]
