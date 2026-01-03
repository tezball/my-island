/**
 * Local Businesses (Suppliers) API Service
 *
 * Provides API methods for local business operations including:
 * - Get all local businesses
 * - Get business by ID
 * - Get businesses by category
 * - Get businesses for map view
 * - Search nearby businesses
 */

import api from '../api'
import type { SupplierCategory } from '../../data/supplierTypes'

// Helper to build query string from params object
function buildQueryString<T extends object>(params: T): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
  if (entries.length === 0) return ''
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')
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

// Response types matching backend DTOs
export interface LocalBusinessResponse {
  id: string
  name: string
  category: SupplierCategory
  description: string
  location: {
    address: string
    county: string
    lat: number
    lng: number
  }
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  hours: {
    weekday?: string
    weekend?: string
  }
  images: string[]
  rating: number
  reviewCount: number
  featured: boolean
}

export interface LocalBusinessMapMarker {
  id: string
  name: string
  lat: number
  lng: number
  category: SupplierCategory
}

export interface SupplierSearchParams {
  category?: SupplierCategory
  search?: string
  page?: number
  size?: number
}

export interface MapBoundsParams {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
  category?: SupplierCategory
}

export interface NearbySearchParams {
  lat: number
  lng: number
  radius?: number
  category?: SupplierCategory
}

// Local Businesses API service
export const suppliersApi = {
  // Get all local businesses with optional filters (paginated)
  getAll: async (params?: SupplierSearchParams): Promise<LocalBusinessResponse[]> => {
    const response = await api.get<PagedResponse<LocalBusinessResponse>>(
      `/local-businesses${buildQueryString(params || {})}`
    )
    return response.content
  },

  // Get all with full pagination info
  getAllPaged: (params?: SupplierSearchParams) =>
    api.get<PagedResponse<LocalBusinessResponse>>(`/local-businesses${buildQueryString(params || {})}`),

  // Get local business by ID
  getById: (id: string) =>
    api.get<LocalBusinessResponse>(`/local-businesses/${id}`),

  // Get featured local businesses
  getFeatured: async (): Promise<LocalBusinessResponse[]> => {
    const response = await api.get<PagedResponse<LocalBusinessResponse>>('/local-businesses/featured')
    return response.content
  },

  // Get map markers within bounds
  getMapMarkers: (bounds: MapBoundsParams) =>
    api.get<LocalBusinessMapMarker[]>(`/local-businesses/map${buildQueryString(bounds)}`),

  // Search nearby local businesses
  searchNearby: (params: NearbySearchParams) =>
    api.get<LocalBusinessResponse[]>(`/local-businesses/nearby${buildQueryString(params)}`),

  // Get all counties with local businesses
  getCounties: () =>
    api.get<string[]>('/local-businesses/counties'),
}

export default suppliersApi
