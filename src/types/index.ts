export interface Coordinates {
  lat: number
  lng: number
}

export interface Facility {
  id: string
  name: string
  icon: string
}

export interface LocalSupplier {
  id: string
  name: string
  category: 'food' | 'activity' | 'gear' | 'other'
  distance: string
  alertsEnabled: boolean
}

export interface CampsiteLot {
  id: string
  name: string
  type: 'tent' | 'rv' | 'cabin' | 'glamping'
  maxGuests: number
  size: string
  pricePerNight: number
}

export interface Campsite {
  id: string
  name: string
  location: string
  coordinates: Coordinates
  pricePerNight: number
  rating: number
  reviewCount: number
  description: string
  imageUrl: string
  images: string[]
  facilities: Facility[]
  lots: CampsiteLot[]
  suppliers: LocalSupplier[]
  isSuperhost: boolean
  type: 'tent' | 'rv' | 'cabin' | 'glamping'
}

export interface Extra {
  id: string
  name: string
  description: string
  price: number
  icon: string
}

export interface BookingGuests {
  adults: number
  children: number
}

export interface Booking {
  id: string
  reference: string
  campsiteId: string
  campsite: Campsite
  lotId: string
  lot: CampsiteLot
  checkIn: string
  checkOut: string
  nights: number
  guests: BookingGuests
  extras: Extra[]
  status: 'confirmed' | 'completed' | 'cancelled'
  totalPrice: number
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  savedCampsites: string[]
}

export interface SupplierOffer {
  id: string
  supplierId: string
  supplierName: string
  supplierLogo: string
  category: 'food' | 'activity' | 'gear' | 'water' | 'wellness' | 'experience' | 'other'
  title: string
  description: string
  imageUrl: string
  discount: string
  tags: string[]
  location: string
  distance: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
