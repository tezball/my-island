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
  checkIn: string // ISO date string
  checkOut: string // ISO date string
  guests: number
  extras?: {
    breakfast?: boolean
    parking?: boolean
    pets?: boolean
  }
  promoCode?: string
}

export interface CancelBookingRequest {
  reason?: string
}

// Response types
export interface BookingResponse {
  id: string
  lotId: string
  campsiteId: string
  campsiteName: string
  campsiteImage?: string
  campsiteLocation?: string
  lotName: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  pricePerNight: number
  totalPrice: number
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'CHECKED_IN'
  extras?: {
    breakfast?: boolean
    parking?: boolean
    pets?: boolean
  }
  promoCode?: string
  discount?: number
  createdAt: string
  updatedAt: string
}

export interface AvailabilityResponse {
  available: boolean
  blockedDates: string[] // Array of ISO date strings
  price: number
  minNights: number
  maxNights: number
}

export interface BookingListParams {
  status?: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'UPCOMING' | 'PAST'
  page?: number
  size?: number
}

export interface AvailabilityParams {
  checkIn: string
  checkOut: string
}

// Bookings API service
export const bookingsApi = {
  // Create a new booking
  create: (data: CreateBookingRequest) =>
    api.post<BookingResponse>('/bookings', data),

  // Get user's bookings
  list: (params?: BookingListParams) =>
    api.get<BookingResponse[]>(`/bookings${params ? buildQueryString(params) : ''}`),

  // Get booking details
  getById: (id: string) =>
    api.get<BookingResponse>(`/bookings/${id}`),

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
