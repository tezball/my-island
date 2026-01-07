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
  lat?: number
  lng?: number
  radius?: number
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

  // Search campsites near a location (uses map endpoint with calculated bounding box)
  searchNearby: async (lat: number, lng: number, radiusKm: number = 50, facilities?: Facility[]): Promise<CampsiteResponse[]> => {
    // Calculate bounding box from lat/lng and radius
    // 1 degree latitude ≈ 111km
    // 1 degree longitude ≈ 111km * cos(latitude)
    const latDelta = radiusKm / 111.0
    const lngDelta = radiusKm / (111.0 * Math.cos(lat * Math.PI / 180))

    const bounds: MapBoundsParams = {
      minLat: lat - latDelta,
      maxLat: lat + latDelta,
      minLng: lng - lngDelta,
      maxLng: lng + lngDelta,
    }

    const campsites = await api.get<CampsiteResponse[]>(`/campsites/map${buildQueryString(bounds)}`)

    // Filter by facilities client-side if specified (since map endpoint doesn't support it)
    if (facilities && facilities.length > 0) {
      return campsites.filter(c =>
        facilities.every(f => c.facilities.map(cf => cf.toLowerCase()).includes(f.toLowerCase()))
      )
    }

    // Sort by distance from user
    return campsites.sort((a, b) => {
      const distA = Math.sqrt(Math.pow(a.location.lat - lat, 2) + Math.pow(a.location.lng - lng, 2))
      const distB = Math.sqrt(Math.pow(b.location.lat - lat, 2) + Math.pow(b.location.lng - lng, 2))
      return distA - distB
    })
  },

  // Get campsite reviews (delegated to reviews service)
  getReviews: (campsiteId: string) =>
    api.get(`/campsites/${campsiteId}/reviews`),
}

export default campsitesApi
