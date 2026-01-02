/**
 * Offers API Service
 *
 * Provides API methods for public offer operations including:
 * - List offers with category filter
 * - Get offer details
 * - Get featured offers
 */

import api from '../api'
import type { OfferCategory } from '../../data/types'

// Response types
export interface OfferResponse {
  id: string
  title: string
  description: string
  supplierName: string
  supplierLogo: string
  discount: string
  code?: string
  category: OfferCategory
  validUntil: string
  location: {
    address: string
    lat: number
    lng: number
  }
}

// Paginated response wrapper
interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface OfferListParams {
  category?: OfferCategory
  page?: number
  size?: number
}

// Helper to build query string
function buildQueryString<T extends object>(params: T): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined)
  if (entries.length === 0) return ''
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')
}

// Offers API service
export const offersApi = {
  // List offers with optional category filter
  list: async (params?: OfferListParams): Promise<OfferResponse[]> => {
    const response = await api.get<PagedResponse<OfferResponse>>(`/offers${params ? buildQueryString(params) : ''}`)
    return response.content
  },

  // Get offer by ID
  getById: (id: string) =>
    api.get<OfferResponse>(`/offers/${id}`),

  // Get featured offers
  getFeatured: async (): Promise<OfferResponse[]> => {
    const response = await api.get<PagedResponse<OfferResponse>>('/offers/featured')
    return response.content
  },
}

export default offersApi
