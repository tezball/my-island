import type {
  User, Campsite, Lot, Booking, Review, Offer,
  Notification, FAQ, SupportTicket, OwnerStats, RevenueData,
  LotAvailability, CheckInInstructions, Message, OwnerBooking, OwnerCampsite, BroadcastAlert
} from './types'

// Helper to generate dates relative to today
function getRelativeDate(daysFromNow: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split('T')[0]
}

// Current logged-in user
export const currentUser: User = {
  id: 'user-1',
  email: 'john.murphy@email.com',
  name: 'John Murphy',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  phone: '+353 87 123 4567',
  bio: 'Outdoor enthusiast who loves exploring Ireland\'s beautiful campsites.',
  memberSince: '2023-06-15',
  isOwner: false,
  linkedAccounts: [
    { provider: 'google', email: 'john.murphy@gmail.com', connected: true },
    { provider: 'apple', email: 'john@icloud.com', connected: false },
    { provider: 'facebook', email: '', connected: false },
  ],
  notificationPreferences: {
    email: true,
    push: true,
    sms: false,
    marketing: true,
  },
}

// Sample campsites across Ireland
export const campsites: Campsite[] = [
  {
    id: 'camp-1',
    name: 'Clifden Eco Beach Camping',
    description: 'Stunning beachfront camping in the heart of Connemara. Wake up to panoramic views of the Atlantic Ocean and explore the Wild Atlantic Way.',
    location: {
      address: 'Clifden, Connemara',
      county: 'Galway',
      lat: 53.4892,
      lng: -10.0195,
    },
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=800',
      'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800',
    ],
    rating: 4.8,
    reviewCount: 124,
    pricePerNight: 28,
    facilities: ['wifi', 'electric', 'shower', 'toilet', 'beach', 'hiking', 'pets'],
    ownerId: 'owner-1',
    lots: [],
    featured: true,
  },
  {
    id: 'camp-2',
    name: 'Ring of Kerry Glamping',
    description: 'Luxury glamping experience with breathtaking mountain views. Perfect base for exploring the famous Ring of Kerry.',
    location: {
      address: 'Killarney, Kerry',
      county: 'Kerry',
      lat: 52.0599,
      lng: -9.5044,
    },
    images: [
      'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800',
      'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
    ],
    rating: 4.9,
    reviewCount: 89,
    pricePerNight: 95,
    facilities: ['wifi', 'electric', 'water', 'shower', 'toilet', 'restaurant', 'hiking', 'cycling'],
    ownerId: 'owner-2',
    lots: [],
    featured: true,
  },
  {
    id: 'camp-3',
    name: 'Wicklow Mountains Retreat',
    description: 'Escape to the Wicklow Mountains for a peaceful camping experience. Close to Glendalough and numerous hiking trails.',
    location: {
      address: 'Laragh, Wicklow',
      county: 'Wicklow',
      lat: 53.0116,
      lng: -6.3455,
    },
    images: [
      'https://images.unsplash.com/photo-1487730116445-e52727a1fdae?w=800',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800',
      'https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=800',
    ],
    rating: 4.6,
    reviewCount: 67,
    pricePerNight: 22,
    facilities: ['electric', 'toilet', 'shower', 'hiking', 'fishing'],
    ownerId: 'owner-3',
    lots: [],
    featured: false,
  },
  {
    id: 'camp-4',
    name: 'Dingle Peninsula Camp',
    description: 'Family-friendly campsite with stunning views of Dingle Bay. Great for water sports and dolphin watching.',
    location: {
      address: 'Dingle, Kerry',
      county: 'Kerry',
      lat: 52.1408,
      lng: -10.2686,
    },
    images: [
      'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800',
      'https://images.unsplash.com/photo-1535477920755-5c9f5a1c7e85?w=800',
      'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800',
    ],
    rating: 4.7,
    reviewCount: 156,
    pricePerNight: 32,
    facilities: ['wifi', 'electric', 'water', 'shower', 'toilet', 'playground', 'beach', 'pets'],
    ownerId: 'owner-4',
    lots: [],
    featured: true,
  },
  {
    id: 'camp-5',
    name: 'Burren Wild Camp',
    description: 'Unique camping experience in the lunar landscape of the Burren. Perfect for nature lovers and photographers.',
    location: {
      address: 'Ballyvaughan, Clare',
      county: 'Clare',
      lat: 53.1145,
      lng: -9.1500,
    },
    images: [
      'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?w=800',
      'https://images.unsplash.com/photo-1496545672447-f699b503d270?w=800',
      'https://images.unsplash.com/photo-1526491109672-74740652b963?w=800',
    ],
    rating: 4.5,
    reviewCount: 43,
    pricePerNight: 25,
    facilities: ['toilet', 'hiking', 'cycling'],
    ownerId: 'owner-5',
    lots: [],
    featured: false,
  },
  {
    id: 'camp-6',
    name: 'Giants Causeway Caravan Park',
    description: 'Award-winning park just minutes from the famous Giants Causeway. Ideal for exploring the Antrim Coast.',
    location: {
      address: 'Bushmills, Antrim',
      county: 'Antrim',
      lat: 55.2408,
      lng: -6.5117,
    },
    images: [
      'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=800',
      'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800',
      'https://images.unsplash.com/photo-1562609952-b7b36e79d3cb?w=800',
    ],
    rating: 4.8,
    reviewCount: 201,
    pricePerNight: 35,
    facilities: ['wifi', 'electric', 'water', 'shower', 'toilet', 'laundry', 'shop'],
    ownerId: 'owner-6',
    lots: [],
    featured: true,
  },
]

// Lots for each campsite
export const lots: Lot[] = [
  // Clifden Eco Beach lots
  {
    id: 'lot-1-1',
    campsiteId: 'camp-1',
    name: 'Ocean View Pitch 1',
    type: 'tent',
    capacity: 4,
    pricePerNight: 28,
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400'],
    amenities: ['Electric hookup', 'Sea view', 'Fire pit'],
    available: true,
  },
  {
    id: 'lot-1-2',
    campsiteId: 'camp-1',
    name: 'Beachside Campervan Spot',
    type: 'campervan',
    capacity: 4,
    pricePerNight: 38,
    images: ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400'],
    amenities: ['Electric hookup', 'Water hookup', 'Beach access'],
    available: true,
  },
  // Ring of Kerry lots
  {
    id: 'lot-2-1',
    campsiteId: 'camp-2',
    name: 'Mountain View Bell Tent',
    type: 'glamping',
    capacity: 2,
    pricePerNight: 95,
    images: ['https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=400'],
    amenities: ['King bed', 'Wood stove', 'Private deck', 'Breakfast included'],
    available: true,
  },
  {
    id: 'lot-2-2',
    campsiteId: 'camp-2',
    name: 'Lakeside Cabin',
    type: 'cabin',
    capacity: 4,
    pricePerNight: 145,
    images: ['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400'],
    amenities: ['Full kitchen', 'Bathroom', 'Fireplace', 'Lake view'],
    available: false,
  },
  // Wicklow lots
  {
    id: 'lot-3-1',
    campsiteId: 'camp-3',
    name: 'Forest Pitch A',
    type: 'tent',
    capacity: 6,
    pricePerNight: 22,
    images: ['https://images.unsplash.com/photo-1487730116445-e52727a1fdae?w=400'],
    amenities: ['Shaded', 'Near facilities', 'Fire pit'],
    available: true,
  },
]

// User bookings - using relative dates for realistic display
export const bookings: Booking[] = [
  {
    id: 'book-1',
    campsiteId: 'camp-1',
    lotId: 'lot-1-1',
    userId: 'user-1',
    checkIn: getRelativeDate(14), // 2 weeks from now
    checkOut: getRelativeDate(17),
    guests: 2,
    status: 'confirmed',
    totalPrice: 84,
    extras: [
      { id: 'ext-1', name: 'Firewood Bundle', price: 8, quantity: 2 },
    ],
    createdAt: getRelativeDate(-7),
    paymentMethod: { type: 'card', last4: '4242', brand: 'Visa' },
  },
  {
    id: 'book-2',
    campsiteId: 'camp-2',
    lotId: 'lot-2-1',
    userId: 'user-1',
    checkIn: getRelativeDate(45), // 6 weeks from now
    checkOut: getRelativeDate(47),
    guests: 2,
    status: 'pending',
    totalPrice: 190,
    extras: [],
    createdAt: getRelativeDate(-2),
    paymentMethod: { type: 'apple_pay' },
  },
  {
    id: 'book-3',
    campsiteId: 'camp-4',
    lotId: 'lot-1-1',
    userId: 'user-1',
    checkIn: getRelativeDate(-60), // 2 months ago
    checkOut: getRelativeDate(-55),
    guests: 4,
    status: 'completed',
    totalPrice: 160,
    extras: [
      { id: 'ext-2', name: 'Kayak Rental', price: 25, quantity: 1 },
    ],
    createdAt: getRelativeDate(-90),
    paymentMethod: { type: 'card', last4: '1234', brand: 'Mastercard' },
  },
]

// Reviews
export const reviews: Review[] = [
  {
    id: 'rev-1',
    campsiteId: 'camp-1',
    userId: 'user-2',
    userName: 'Sarah O\'Connor',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 5,
    title: 'Absolutely stunning location!',
    content: 'We had the most amazing weekend at Clifden Eco Beach. The views are incredible and the facilities are spotless. The owners were so welcoming and gave us great tips for local walks. Will definitely be back!',
    photos: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400',
    ],
    createdAt: '2024-12-15',
    helpfulCount: 12,
    categories: {
      cleanliness: 5,
      location: 5,
      value: 4,
      facilities: 5,
    },
  },
  {
    id: 'rev-2',
    campsiteId: 'camp-1',
    userId: 'user-3',
    userName: 'Michael Kelly',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4,
    title: 'Great for families',
    content: 'Brought the kids here for a long weekend. They loved exploring the beach and the playground is fantastic. Only minor issue was the showers could be warmer in the morning.',
    photos: [],
    createdAt: '2024-11-28',
    helpfulCount: 8,
    categories: {
      cleanliness: 4,
      location: 5,
      value: 4,
      facilities: 4,
    },
  },
  {
    id: 'rev-3',
    campsiteId: 'camp-2',
    userId: 'user-4',
    userName: 'Emma Walsh',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 5,
    title: 'Romantic getaway perfection',
    content: 'Booked the bell tent for our anniversary and it exceeded all expectations. The attention to detail was incredible - from the fairy lights to the complimentary champagne. Pure magic!',
    photos: [
      'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=400',
      'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=400',
    ],
    createdAt: '2024-12-22',
    helpfulCount: 24,
    categories: {
      cleanliness: 5,
      location: 5,
      value: 5,
      facilities: 5,
    },
  },
]

// Local offers
export const offers: Offer[] = [
  {
    id: 'offer-1',
    supplierId: 'sup-1',
    supplierName: 'Connemara Adventures',
    supplierLogo: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=100',
    title: '20% off Kayak Tours',
    description: 'Experience the stunning Connemara coastline with our guided kayak tours. Perfect for beginners and experienced paddlers alike.',
    discount: '20% OFF',
    category: 'activities',
    validUntil: '2025-03-31',
    location: {
      address: 'Clifden Harbour',
      lat: 53.4892,
      lng: -10.0195,
    },
    claimed: false,
  },
  {
    id: 'offer-2',
    supplierId: 'sup-2',
    supplierName: 'The Hungry Camper',
    supplierLogo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100',
    title: 'Free Coffee with Breakfast',
    description: 'Start your day right! Show your camping receipt and enjoy a free coffee with any breakfast order.',
    discount: 'FREE COFFEE',
    category: 'food',
    validUntil: '2025-02-28',
    location: {
      address: 'Main Street, Clifden',
      lat: 53.4875,
      lng: -10.0210,
    },
    claimed: true,
    code: 'CAMPER2025',
  },
  {
    id: 'offer-3',
    supplierId: 'sup-3',
    supplierName: 'Wild Atlantic Gear',
    supplierLogo: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100',
    title: '15% off Camping Equipment',
    description: 'Need new gear? Get 15% off all camping equipment including tents, sleeping bags, and cooking gear.',
    discount: '15% OFF',
    category: 'gear',
    validUntil: '2025-04-30',
    location: {
      address: 'Market Square, Galway',
      lat: 53.2707,
      lng: -9.0568,
    },
    claimed: false,
  },
  {
    id: 'offer-4',
    supplierId: 'sup-4',
    supplierName: 'Cliffs of Moher Visitor Centre',
    supplierLogo: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=100',
    title: '10% off Entry Tickets',
    description: 'Visit Ireland\'s most iconic cliffs with a special discount for campers. Valid for up to 4 people.',
    discount: '10% OFF',
    category: 'attractions',
    validUntil: '2025-12-31',
    location: {
      address: 'Cliffs of Moher, Clare',
      lat: 52.9715,
      lng: -9.4309,
    },
    claimed: false,
  },
]

// Notifications
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your booking at Clifden Eco Beach (Jan 15-18) is confirmed!',
    read: false,
    createdAt: '2024-12-28T14:30:00',
    actionUrl: '/bookings/book-1',
    icon: 'check_circle',
  },
  {
    id: 'notif-2',
    type: 'offer',
    title: 'New Offer Available',
    message: 'Connemara Adventures is offering 20% off kayak tours near your upcoming stay!',
    read: false,
    createdAt: '2024-12-29T10:15:00',
    actionUrl: '/offers/offer-1',
    icon: 'local_offer',
  },
  {
    id: 'notif-3',
    type: 'reminder',
    title: 'Check-in Tomorrow',
    message: 'Your stay at Clifden Eco Beach starts tomorrow. Don\'t forget to pack!',
    read: true,
    createdAt: '2025-01-14T09:00:00',
    actionUrl: '/bookings/book-1',
    icon: 'event',
  },
  {
    id: 'notif-4',
    type: 'review',
    title: 'Share Your Experience',
    message: 'How was your stay at Dingle Peninsula Camp? Leave a review!',
    read: true,
    createdAt: '2024-08-16T12:00:00',
    actionUrl: '/campsite/camp-4/review',
    icon: 'rate_review',
  },
  {
    id: 'notif-5',
    type: 'system',
    title: 'App Update Available',
    message: 'A new version of my-island is available with improved maps.',
    read: true,
    createdAt: '2024-12-20T16:45:00',
    icon: 'system_update',
  },
]

// Favorites (campsite IDs)
export const favorites: string[] = ['camp-1', 'camp-2', 'camp-6']

// FAQs
export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    category: 'Booking',
    question: 'How do I cancel a booking?',
    answer: 'You can cancel a booking from the My Bookings section. Select the booking you want to cancel and tap "Cancel Booking". Cancellation fees may apply depending on how close to the check-in date you cancel.',
  },
  {
    id: 'faq-2',
    category: 'Booking',
    question: 'Can I modify my booking dates?',
    answer: 'Yes! Go to My Bookings, select your booking, and tap "Modify Dates". You can change dates subject to availability. Price differences will be calculated automatically.',
  },
  {
    id: 'faq-3',
    category: 'Payment',
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, and Google Pay.',
  },
  {
    id: 'faq-4',
    category: 'Account',
    question: 'How do I delete my account?',
    answer: 'Go to Profile > Settings > Privacy & Security > Delete Account. Please note this action is permanent and will delete all your data including booking history.',
  },
  {
    id: 'faq-5',
    category: 'Campsite',
    question: 'Are pets allowed at campsites?',
    answer: 'Pet policies vary by campsite. Look for the "Pets" facility icon on campsite listings. Always check the specific campsite rules before booking with pets.',
  },
]

// Support tickets
export const supportTickets: SupportTicket[] = [
  {
    id: 'ticket-1',
    userId: 'user-1',
    subject: 'Refund for cancelled booking',
    status: 'in_progress',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        content: 'Hi, I cancelled my booking last week but haven\'t received my refund yet. Booking ID: book-123',
        createdAt: '2024-12-26T10:30:00',
      },
      {
        id: 'msg-2',
        sender: 'support',
        content: 'Hi John, thanks for reaching out. I can see your cancellation request. Refunds typically take 5-7 business days to process. Your refund should arrive by January 2nd.',
        createdAt: '2024-12-26T14:15:00',
      },
    ],
    createdAt: '2024-12-26T10:30:00',
    updatedAt: '2024-12-26T14:15:00',
  },
]

// Owner statistics (for owner mode)
export const ownerStats: OwnerStats = {
  totalBookings: 156,
  upcomingBookings: 12,
  revenue: 12450,
  revenueChange: 15.3,
  occupancyRate: 78,
  averageRating: 4.7,
}

// Owner revenue data
export const revenueData: RevenueData[] = [
  { month: 'Jul', revenue: 1850, bookings: 18 },
  { month: 'Aug', revenue: 2340, bookings: 24 },
  { month: 'Sep', revenue: 1620, bookings: 15 },
  { month: 'Oct', revenue: 980, bookings: 10 },
  { month: 'Nov', revenue: 540, bookings: 6 },
  { month: 'Dec', revenue: 1120, bookings: 11 },
]

// Generate lot availability for the next 60 days
function generateLotAvailability(lotId: string, pricePerNight: number): LotAvailability[] {
  const availability: LotAvailability[] = []
  const today = new Date()

  for (let i = 0; i < 60; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]

    // Random availability - 70% available, 20% booked, 10% blocked
    const rand = Math.random()
    let status: LotAvailability['status'] = 'available'
    if (rand > 0.9) status = 'blocked'
    else if (rand > 0.7) status = 'booked'

    availability.push({
      lotId,
      date: dateStr,
      status,
      price: pricePerNight,
    })
  }
  return availability
}

export const lotAvailability: LotAvailability[] = [
  ...generateLotAvailability('lot-1-1', 28),
  ...generateLotAvailability('lot-1-2', 38),
  ...generateLotAvailability('lot-2-1', 95),
  ...generateLotAvailability('lot-2-2', 145),
  ...generateLotAvailability('lot-3-1', 22),
]

// Check-in instructions for campsites
export const checkInInstructions: CheckInInstructions[] = [
  {
    campsiteId: 'camp-1',
    accessCode: '4892#',
    gateCode: '1234',
    wifiName: 'ClifdenEco_Guest',
    wifiPassword: 'WildAtlantic2025',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    directions: 'From Clifden town centre, take the Sky Road west. After 3km, turn left at the Eco Beach sign. Follow the gravel road for 500m to the reception.',
    parkingInfo: 'Park in the designated visitor bay on arrival. Your pitch has a dedicated parking space.',
    rules: [
      'Quiet hours: 11pm - 7am',
      'No open fires - fire pits provided',
      'Dogs must be kept on lead',
      'Please recycle - bins by reception',
      'Maximum 6 people per pitch',
    ],
    hostContact: {
      name: 'Siobhan O\'Malley',
      phone: '+353 87 234 5678',
      email: 'siobhan@clifdeneco.ie',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      responseTime: 'Usually responds within 1 hour',
    },
  },
  {
    campsiteId: 'camp-2',
    accessCode: '7531#',
    wifiName: 'RingOfKerry_Glamping',
    wifiPassword: 'Mountains2025',
    checkInTime: '15:00',
    checkOutTime: '10:00',
    directions: 'Take N72 from Killarney towards Kenmare. After 8km, look for our sign on the right. Turn right and follow the lane for 1km.',
    parkingInfo: 'Free parking at reception. A buggy will take you and your luggage to your accommodation.',
    rules: [
      'Quiet hours: 10pm - 8am',
      'No smoking in accommodation',
      'Breakfast served 8am - 10am',
      'Checkout: Leave key in lockbox',
    ],
    hostContact: {
      name: 'Patrick Kerry',
      phone: '+353 86 345 6789',
      email: 'info@ringofkerryglamping.ie',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      responseTime: 'Usually responds within 30 minutes',
    },
  },
]

// Host-guest messages
export const messages: Message[] = [
  {
    id: 'msg-1',
    bookingId: 'book-1',
    senderId: 'user-1',
    senderName: 'John Murphy',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    recipientId: 'owner-1',
    content: 'Hi Siobhan, we\'re really looking forward to our stay! What time does the gate close in the evening?',
    createdAt: '2025-01-10T14:30:00',
    read: true,
  },
  {
    id: 'msg-2',
    bookingId: 'book-1',
    senderId: 'owner-1',
    senderName: 'Siobhan O\'Malley',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    recipientId: 'user-1',
    content: 'Hi John! The gate is accessible 24/7 with your code. I\'ll send you the details closer to your arrival. Let me know if you have any other questions!',
    createdAt: '2025-01-10T15:45:00',
    read: true,
  },
]

// Owner's view of bookings
export const ownerBookings: OwnerBooking[] = [
  {
    id: 'owner-book-1',
    campsiteId: 'camp-1',
    lotId: 'lot-1-1',
    userId: 'user-2',
    checkIn: getRelativeDate(7), // Next week
    checkOut: getRelativeDate(10),
    guests: 3,
    status: 'confirmed',
    totalPrice: 84,
    extras: [],
    createdAt: getRelativeDate(-5),
    paymentMethod: { type: 'card', last4: '5678', brand: 'Visa' },
    guestName: 'Sarah O\'Connor',
    guestEmail: 'sarah@email.com',
    guestPhone: '+353 87 111 2222',
    guestAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    lotName: 'Ocean View Pitch 1',
    campsiteName: 'Clifden Eco Beach Camping',
  },
  {
    id: 'owner-book-2',
    campsiteId: 'camp-1',
    lotId: 'lot-1-2',
    userId: 'user-3',
    checkIn: getRelativeDate(21), // 3 weeks from now
    checkOut: getRelativeDate(23),
    guests: 2,
    status: 'pending',
    totalPrice: 76,
    extras: [{ id: 'ext-1', name: 'Firewood', price: 10, quantity: 1 }],
    createdAt: getRelativeDate(-1),
    guestName: 'Michael Kelly',
    guestEmail: 'michael.k@email.com',
    guestAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lotName: 'Beachside Campervan Spot',
    campsiteName: 'Clifden Eco Beach Camping',
  },
  {
    id: 'owner-book-3',
    campsiteId: 'camp-1',
    lotId: 'lot-1-1',
    userId: 'user-4',
    checkIn: getRelativeDate(-30), // 1 month ago
    checkOut: getRelativeDate(-26),
    guests: 4,
    status: 'completed',
    totalPrice: 112,
    extras: [],
    createdAt: getRelativeDate(-45),
    paymentMethod: { type: 'card', last4: '9012', brand: 'Mastercard' },
    guestName: 'Emma Walsh',
    guestEmail: 'emma.walsh@email.com',
    guestAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    lotName: 'Ocean View Pitch 1',
    campsiteName: 'Clifden Eco Beach Camping',
  },
  {
    id: 'owner-book-4',
    campsiteId: 'camp-1',
    lotId: 'lot-1-1',
    userId: 'user-5',
    checkIn: getRelativeDate(-45), // 1.5 months ago
    checkOut: getRelativeDate(-43),
    guests: 2,
    status: 'cancelled',
    totalPrice: 0,
    extras: [],
    createdAt: getRelativeDate(-60),
    guestName: 'David Murphy',
    guestEmail: 'david.m@email.com',
    lotName: 'Ocean View Pitch 1',
    campsiteName: 'Clifden Eco Beach Camping',
  },
]

// Owner's campsites
export const ownerCampsites: OwnerCampsite[] = [
  {
    ...campsites[0],
    status: 'active',
    totalRevenue: 8450,
    totalBookings: 89,
    viewsThisWeek: 1240,
  },
]

// Broadcast alerts
export const broadcastAlerts: BroadcastAlert[] = [
  {
    id: 'alert-1',
    campsiteId: 'camp-1',
    message: 'Fresh fish available at reception! Just arrived from Clifden harbour.',
    sentAt: '2025-01-10T16:00:00',
    sentTo: 12,
  },
  {
    id: 'alert-2',
    campsiteId: 'camp-1',
    message: 'Weather warning: Strong winds expected tonight. Please secure your tents and awnings.',
    sentAt: '2025-01-08T14:30:00',
    sentTo: 18,
  },
]

// Booking extras/add-ons
export const extras = [
  {
    id: 'extra-1',
    name: 'Firewood Bundle',
    description: 'Seasoned hardwood logs, enough for one evening',
    price: 12.00,
    icon: 'local_fire_department',
  },
  {
    id: 'extra-2',
    name: 'BBQ Rental',
    description: 'Portable charcoal BBQ with utensils',
    price: 25.00,
    icon: 'outdoor_grill',
  },
  {
    id: 'extra-3',
    name: 'Late Checkout',
    description: 'Extend your stay until 2pm instead of 11am',
    price: 15.00,
    icon: 'schedule',
  },
  {
    id: 'extra-4',
    name: 'Welcome Pack',
    description: 'Local artisan bread, butter, eggs, and orange juice',
    price: 18.00,
    icon: 'shopping_basket',
  },
  {
    id: 'extra-5',
    name: 'Bike Rental (per day)',
    description: 'Mountain bike with helmet and lock',
    price: 20.00,
    icon: 'pedal_bike',
  },
]

// Helper functions
export function getCampsiteById(id: string): Campsite | undefined {
  return campsites.find(c => c.id === id)
}

export function getLotsByCampsite(campsiteId: string): Lot[] {
  return lots.filter(l => l.campsiteId === campsiteId)
}

export function getBookingsBuUser(userId: string): Booking[] {
  return bookings.filter(b => b.userId === userId)
}

export function getReviewsByCampsite(campsiteId: string): Review[] {
  return reviews.filter(r => r.campsiteId === campsiteId)
}

export function getFavoriteCampsites(): Campsite[] {
  return campsites.filter(c => favorites.includes(c.id))
}

export function getUnreadNotificationCount(): number {
  return notifications.filter(n => !n.read).length
}

export function getFeaturedCampsites(): Campsite[] {
  return campsites.filter(c => c.featured)
}

export function searchCampsites(query: string): Campsite[] {
  const q = query.toLowerCase()
  return campsites.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.location.county.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q)
  )
}

export function getLotAvailability(lotId: string): LotAvailability[] {
  return lotAvailability.filter(a => a.lotId === lotId)
}

export function getCheckInInstructions(campsiteId: string): CheckInInstructions | undefined {
  return checkInInstructions.find(c => c.campsiteId === campsiteId)
}

export function getMessagesByBooking(bookingId: string): Message[] {
  return messages.filter(m => m.bookingId === bookingId)
}

export function getBookingById(bookingId: string): Booking | undefined {
  return bookings.find(b => b.id === bookingId)
}

export function getLotById(lotId: string): Lot | undefined {
  return lots.find(l => l.id === lotId)
}
