// Core types for the my-island camping app

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  bio?: string
  memberSince: string
  isOwner: boolean
  isSupplier: boolean
  linkedAccounts: LinkedAccount[]
  notificationPreferences: NotificationPreferences
}

// Supplier categories matching backend enum
export type SupplierCategory =
  | 'RESTAURANT'
  | 'PUB'
  | 'FARM_SHOP'
  | 'GROCERY'
  | 'OUTDOOR_GEAR'
  | 'KAYAK_RENTAL'
  | 'BIKE_RENTAL'
  | 'FISHING'
  | 'CONVENIENCE'

// Supplier business profile
export interface SupplierProfile {
  id: string
  userId: string
  businessName: string
  description: string
  location: string
  contactEmail: string
  phoneNumber: string
  logoUrl?: string
  category?: SupplierCategory
  eircode?: string
  latitude?: number
  longitude?: number
  createdAt: string
  updatedAt: string
}

export interface LinkedAccount {
  provider: 'google' | 'apple' | 'facebook'
  email: string
  connected: boolean
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  marketing: boolean
}

export interface Campsite {
  id: string
  name: string
  description: string
  location: {
    address: string
    county: string
    lat: number
    lng: number
  }
  images: string[]
  rating: number
  reviewCount: number
  pricePerNight: number
  facilities: Facility[]
  ownerId: string
  lots: Lot[]
  featured: boolean
}

export type Facility =
  | 'wifi' | 'electric' | 'water' | 'toilet' | 'shower'
  | 'laundry' | 'shop' | 'restaurant' | 'playground'
  | 'beach' | 'fishing' | 'hiking' | 'cycling' | 'pets'

export type LotType =
  | 'tent'
  | 'caravan'
  | 'campervan'
  | 'rv'
  | 'glamping'
  | 'cabin'
  | 'treehouse'
  | 'yurt'
  | 'pod'
  | 'apartment'
  | 'cottage'
  | 'safari_tent'

export interface Lot {
  id: string
  campsiteId: string
  name: string
  type: LotType
  capacity: number
  pricePerNight: number
  images: string[]
  amenities: string[]
  available: boolean
  description?: string
}

export interface Booking {
  id: string
  campsiteId: string
  lotId: string
  userId: string
  checkIn: string
  checkOut: string
  guests: number
  status: 'confirmed' | 'checked_in' | 'completed' | 'cancelled'
  totalPrice: number
  extras: BookingExtra[]
  createdAt: string
  paymentMethod?: PaymentMethod
}

export interface BookingExtra {
  id: string
  name: string
  price: number
  quantity: number
}

export interface PaymentMethod {
  type: 'card' | 'apple_pay' | 'google_pay'
  last4?: string
  brand?: string
}

export interface Review {
  id: string
  campsiteId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  photos: string[]
  createdAt: string
  helpfulCount: number
  categories: {
    cleanliness: number
    location: number
    value: number
    facilities: number
  }
}

// Offer categories as per documentation
export type OfferCategory = 'food' | 'activity' | 'gear' | 'water' | 'wellness' | 'experience' | 'other'

export interface Offer {
  id: string
  supplierId: string
  supplierName: string
  supplierLogo: string
  title: string
  description: string
  imageUrl?: string
  discount: string
  category: OfferCategory
  tags?: string[]
  validUntil: string
  location: {
    address: string
    lat: number
    lng: number
  }
  distance?: string
  claimed: boolean
  code?: string
}

export interface Notification {
  id: string
  type: 'booking' | 'review' | 'offer' | 'system' | 'reminder'
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
  icon: string
}

export interface FAQ {
  id: string
  category: string
  question: string
  answer: string
}

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  messages: TicketMessage[]
  createdAt: string
  updatedAt: string
}

export interface TicketMessage {
  id: string
  sender: 'user' | 'support'
  content: string
  createdAt: string
}

// Owner-specific types
export interface OwnerStats {
  totalBookings: number
  upcomingBookings: number
  revenue: number
  revenueChange: number
  occupancyRate: number
  averageRating: number
}

export interface RevenueData {
  month: string
  revenue: number
  bookings: number
}

// Calendar availability for lots
export interface LotAvailability {
  lotId: string
  date: string
  status: 'available' | 'booked' | 'blocked' | 'maintenance'
  price?: number
}

// Check-in instructions for confirmed bookings
export interface CheckInInstructions {
  campsiteId: string
  accessCode?: string
  gateCode?: string
  wifiName?: string
  wifiPassword?: string
  checkInTime: string
  checkOutTime: string
  directions: string
  parkingInfo: string
  rules: string[]
  hostContact: {
    name: string
    phone: string
    email: string
    avatar?: string
    responseTime: string
  }
}

// Host-guest messaging
export interface Message {
  id: string
  bookingId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  recipientId: string
  content: string
  createdAt: string
  read: boolean
}

// Owner's view of a booking
export interface OwnerBooking extends Booking {
  guestName: string
  guestEmail: string
  guestPhone?: string
  guestAvatar?: string
  lotName: string
  campsiteName: string
}

// Owner's view of their campsite
export interface OwnerCampsite extends Campsite {
  status: 'active' | 'inactive' | 'pending'
  totalRevenue: number
  totalBookings: number
  viewsThisWeek: number
}

// Broadcast alerts from owners to guests
export interface BroadcastAlert {
  id: string
  campsiteId: string
  message: string
  sentAt: string
  sentTo: number
}

// ============================================
// Property Registration Wizard Types
// ============================================

// Property type for wizard flow differentiation
export type PropertyType = 'campsite' | 'bnb'

// Accommodation types selectable in wizard (maps to LotType)
export type AccommodationType =
  | 'TENT'
  | 'RV'
  | 'MOBILE_HOME'
  | 'GLAMPING'
  | 'CABIN'
  | 'APARTMENT'
  | 'BED_AND_BREAKFAST'

// Configuration for a specific accommodation type
export interface AccommodationConfig {
  type: AccommodationType
  quantity: number
  defaultCapacity: number
  pricePerNight: number
  amenities: string[]
  customAmenities: string[]
}

// Draft data for persistence
export interface PropertyDraft {
  id: string
  propertyType: PropertyType
  data: PropertyWizardData
  createdAt: string
  updatedAt: string
}

// Wizard data (separate from state control fields)
export interface PropertyWizardData {
  // Basic info
  name: string
  description: string
  address: string
  county: string
  lat: number | null
  lng: number | null
  images: string[]
  facilities: Facility[]

  // Accommodation selection (campsite only)
  selectedAccommodationTypes: AccommodationType[]

  // Configuration per type
  accommodationConfigs: Record<string, AccommodationConfig>
}

// Full wizard state (includes control fields)
export interface PropertyWizardState extends PropertyWizardData {
  // Flow control
  propertyType: PropertyType | null
  currentStepIndex: number
  completedStepIds: string[]

  // Draft management
  isDraft: boolean
  draftId: string | null
  lastSaved: string | null

  // Submission state
  isSubmitting: boolean
  error: string | null
}

// Step configuration for dynamic wizard
export interface WizardStepConfig {
  id: string
  title: string
  icon?: string
  isRequired: boolean
  appliesTo: PropertyType | 'both'
}

// API request/response types for draft endpoints
export interface PropertyDraftRequest {
  propertyType: PropertyType
  name?: string
  description?: string
  location?: {
    address: string
    county: string
    lat: number
    lng: number
  }
  images?: string[]
  facilities?: Facility[]
  selectedAccommodationTypes?: AccommodationType[]
  accommodationConfigs?: Record<string, AccommodationConfig>
}

export interface PropertyDraftResponse {
  id: string
  propertyType: PropertyType
  data: PropertyDraftRequest
  createdAt: string
  updatedAt: string
}

// Default amenities per accommodation type
export const ACCOMMODATION_AMENITIES: Record<AccommodationType, string[]> = {
  TENT: ['Fire Pit', 'Picnic Table', 'Vehicle Access', 'Power Hookup', 'Water Tap'],
  RV: ['Electric Hookup', 'Water Hookup', 'Waste Disposal', 'TV Hookup', 'Wi-Fi'],
  MOBILE_HOME: ['Electric Hookup', 'Water Hookup', 'Parking Space', 'Patio Area'],
  GLAMPING: ['Private Bathroom', 'Heating', 'Kitchen Area', 'Wi-Fi', 'Bed Linens'],
  CABIN: ['Private Bathroom', 'Kitchen', 'Heating', 'Wi-Fi', 'BBQ Grill', 'Parking'],
  APARTMENT: ['Private Bathroom', 'Kitchen', 'Heating', 'Wi-Fi', 'Laundry', 'Parking'],
  BED_AND_BREAKFAST: ['Private Bathroom', 'Breakfast Included', 'Wi-Fi', 'TV', 'Daily Cleaning'],
}

// Default capacity per accommodation type
export const ACCOMMODATION_DEFAULT_CAPACITY: Record<AccommodationType, number> = {
  TENT: 4,
  RV: 4,
  MOBILE_HOME: 4,
  GLAMPING: 2,
  CABIN: 4,
  APARTMENT: 4,
  BED_AND_BREAKFAST: 2,
}

// Display labels for accommodation types
export const ACCOMMODATION_LABELS: Record<AccommodationType, string> = {
  TENT: 'Tent Pitches',
  RV: 'RV / Motorhome Pitches',
  MOBILE_HOME: 'Mobile Home Pitches',
  GLAMPING: 'Glamping Pods',
  CABIN: 'Cabins / Cottages',
  APARTMENT: 'Apartments',
  BED_AND_BREAKFAST: 'B&B Rooms',
}
