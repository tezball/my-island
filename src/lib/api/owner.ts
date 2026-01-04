/**
 * Owner API Service
 *
 * Provides API methods for owner-related operations including:
 * - Becoming an owner
 * - Campsite CRUD operations
 * - Lot CRUD operations
 */

import api from '../api'
import type { User, Facility, LotType } from '../../data/types'

// Request types
export interface CreateCampsiteRequest {
  name: string
  description?: string
  location: {
    address: string
    county: string
    lat: number
    lng: number
  }
  images?: string[]
  facilities?: Facility[]
}

export interface UpdateCampsiteRequest {
  name?: string
  description?: string
  location?: {
    address?: string
    county?: string
    lat?: number
    lng?: number
  }
  images?: string[]
  facilities?: Facility[]
  active?: boolean
}

export interface CreateLotRequest {
  campsiteId: string
  name: string
  type: LotType
  capacity: number
  pricePerNight: number
  images?: string[]
  amenities?: string[]
  available?: boolean
}

export interface UpdateLotRequest {
  name?: string
  type?: LotType
  capacity?: number
  pricePerNight?: number
  images?: string[]
  amenities?: string[]
  available?: boolean
}

// Response types
export interface CampsiteResponse {
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
  priceFrom: number
  facilities: Facility[]
  featured: boolean
  ownerId: string
}

export interface CampsiteDetailResponse extends CampsiteResponse {
  lots: LotResponse[]
  isFavorite: boolean
}

export interface LotResponse {
  id: string
  name: string
  type: 'TENT' | 'CARAVAN' | 'CAMPERVAN' | 'GLAMPING' | 'CABIN'
  capacity: number
  pricePerNight: number
  images: string[]
  amenities: string[]
  available: boolean
}

export interface OwnerStats {
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  upcomingBookings: number
  totalRevenue: number
  thisMonthRevenue: number
  lastMonthRevenue: number
  revenueChange: number
  occupancyRate: number
  averageRating: number
  totalReviews: number
  totalCampsites: number
  totalLots: number
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  bookings: number
}

export interface RevenueDataResponse {
  monthlyData: RevenueDataPoint[]
}

// Owner API service
export const ownerApi = {
  // User becomes owner
  becomeOwner: () =>
    api.post<User>('/users/me/become-owner'),

  // Get owner statistics
  getStats: () =>
    api.get<OwnerStats>('/owner/stats'),

  // Get revenue data for charts
  getRevenueData: (months: number = 6) =>
    api.get<RevenueDataResponse>(`/owner/revenue-data?months=${months}`),

  // Get owner's campsites
  getMyCampsites: () =>
    api.get<CampsiteResponse[]>('/owner/campsites'),

  // Campsite CRUD
  createCampsite: (data: CreateCampsiteRequest) =>
    api.post<CampsiteDetailResponse>('/campsites', data),

  getCampsite: (id: string) =>
    api.get<CampsiteDetailResponse>(`/campsites/${id}`),

  updateCampsite: (id: string, data: UpdateCampsiteRequest) =>
    api.put<CampsiteDetailResponse>(`/campsites/${id}`, data),

  deleteCampsite: (id: string) =>
    api.delete<void>(`/campsites/${id}`),

  // Lot CRUD
  createLot: (data: CreateLotRequest) =>
    api.post<LotResponse>('/lots', data),

  getLot: (id: string) =>
    api.get<LotResponse>(`/lots/${id}`),

  getLotsByCampsite: (campsiteId: string) =>
    api.get<LotResponse[]>(`/lots?campsiteId=${campsiteId}`),

  updateLot: (id: string, data: UpdateLotRequest) =>
    api.put<LotResponse>(`/lots/${id}`, data),

  deleteLot: (id: string) =>
    api.delete<void>(`/lots/${id}`),
}

export default ownerApi
