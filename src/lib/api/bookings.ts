/**
 * Bookings API Service
 *
 * Provides API methods for booking-related operations including:
 * - Create bookings
 * - List user bookings
 * - Get booking details
 * - Confirm/cancel bookings
 * - Check availability
 */

import api from '../api'

// Helper to build query string from params object
function buildQueryString<T extends object>(params: T): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined)
  if (entries.length === 0) return ''
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')
}

// Request types
export interface CreateBookingRequest {
  lotId: string
  checkIn: string // YYYY-MM-DD date string (LocalDate format)
  checkOut: string // YYYY-MM-DD date string (LocalDate format)
  guests: number
  extras?: BookingExtraRequest[] // List of extras with IDs and quantities
  specialRequests?: string
}

export interface BookingExtraRequest {
  extraId: string
  quantity: number
}

export interface CancelBookingRequest {
  reason?: string
}

// Response types
export interface BookingResponse {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'CHECKED_IN'
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  lotPrice: number
  extrasPrice: number
  serviceFee: number
  totalPrice: number
  specialRequests?: string
  lot: {
    id: string
    name: string
    type: string
    images: string[]
  }
  campsite: {
    id: string
    name: string
    county?: string
    imageUrl?: string
  }
  extras: BookingExtraResponse[]
  createdAt: string
}

export interface BookingExtraResponse {
  extraId: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface AvailabilityResponse {
  available: boolean
  blockedDates: string[] // Array of ISO date strings
  price: number
  minNights: number
  maxNights: number
}

export interface BookingListParams {
  status?: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  page?: number
  size?: number
}

// Paginated response wrapper
interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface AvailabilityParams {
  checkIn: string
  checkOut: string
}

export interface CheckInInstructionsResponse {
  checkInTime: string
  checkOutTime: string
  accessCode?: string
  gateCode?: string
  wifiName?: string
  wifiPassword?: string
  directions: string
  rules: string[]
  hostContact: {
    name: string
    phone: string
  }
}

export interface BookingDetailResponse extends BookingResponse {
  campsite: {
    id: string
    name: string
    images: string[]
    location: {
      address: string
      lat: number
      lng: number
    }
  }
  lot: {
    id: string
    name: string
    type: string
    images: string[]
  }
  checkInInstructions?: CheckInInstructionsResponse
}

// Bookings API service
export const bookingsApi = {
  // Create a new booking
  create: (data: CreateBookingRequest) =>
    api.post<BookingResponse>('/bookings', data),

  // Get user's bookings
  list: async (params?: BookingListParams): Promise<BookingResponse[]> => {
    const response = await api.get<PagedResponse<BookingResponse>>(`/bookings${params ? buildQueryString(params) : ''}`)
    return response.content
  },

  // Get booking details
  getById: (id: string) =>
    api.get<BookingResponse>(`/bookings/${id}`),

  // Get booking with full details (campsite, lot, check-in instructions)
  getDetailById: (id: string) =>
    api.get<BookingDetailResponse>(`/bookings/${id}/details`),

  // Confirm booking
  confirm: (id: string) =>
    api.post<BookingResponse>(`/bookings/${id}/confirm`),

  // Cancel booking
  cancel: (id: string, data?: CancelBookingRequest) =>
    api.post<BookingResponse>(`/bookings/${id}/cancel`, data),

  // Check lot availability
  checkAvailability: (lotId: string, params: AvailabilityParams) =>
    api.get<AvailabilityResponse>(`/lots/${lotId}/availability${buildQueryString(params)}`),

  // Modify booking (not yet implemented in backend)
  // modify: (id: string, data: Partial<CreateBookingRequest>) =>
  //   api.patch<BookingResponse>(`/bookings/${id}`, data),
}

export default bookingsApi
