/**
 * Campsites API Service
 *
 * Provides API methods for campsite-related operations including:
 * - Search and filter campsites
 * - Get campsite details
 * - Get featured campsites
 * - Get campsites for map view
 */

import api from '../api'
import type { Facility } from '../../data/types'

// Helper to build query string from params object
function buildQueryString<T extends object>(params: T): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined)
  if (entries.length === 0) return ''
  return '?' + entries.map(([k, v]) => {
    if (Array.isArray(v)) {
      return v.map(item => `${encodeURIComponent(k)}=${encodeURIComponent(String(item))}`).join('&')
    }
    return `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
  }).join('&')
}

// Paginated response wrapper
export interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
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

export interface MapMarkerResponse {
  id: string
  name: string
  lat: number
  lng: number
  priceFrom: number
  rating: number
}

export interface SearchParams {
  search?: string
  county?: string
  minPrice?: number
  maxPrice?: number
  facilities?: Facility[]
  guests?: number
  page?: number
  size?: number
}

export interface MapBoundsParams {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}

// Campsites API service
export const campsitesApi = {
  // Search and filter campsites (returns paginated response)
  search: async (params: SearchParams): Promise<CampsiteResponse[]> => {
    const response = await api.get<PagedResponse<CampsiteResponse>>(`/campsites${buildQueryString(params)}`)
    return response.content
  },

  // Search with full pagination info
  searchPaged: (params: SearchParams) =>
    api.get<PagedResponse<CampsiteResponse>>(`/campsites${buildQueryString(params)}`),

  // Get campsite details
  getById: (id: string) =>
    api.get<CampsiteDetailResponse>(`/campsites/${id}`),

  // Get featured campsites
  getFeatured: async (): Promise<CampsiteResponse[]> => {
    const response = await api.get<PagedResponse<CampsiteResponse>>('/campsites?featured=true')
    return response.content
  },

  // Get campsites for map view
  getMapMarkers: (bounds: MapBoundsParams) =>
    api.get<MapMarkerResponse[]>(`/campsites/map${buildQueryString(bounds)}`),

  // Get campsite reviews (delegated to reviews service)
  getReviews: (campsiteId: string) =>
    api.get(`/campsites/${campsiteId}/reviews`),
}

export default campsitesApi
