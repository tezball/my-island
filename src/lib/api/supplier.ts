/**
 * Supplier API Service
 *
 * Provides API methods for supplier-related operations including:
 * - Business profile management
 * - Logo upload
 * - Supplier offers CRUD
 */

import api from '../api'
import type { SupplierProfile, Offer, OfferCategory } from '../../data/types'

// Request types
export interface UpdateProfileRequest {
  businessName: string
  description: string
  location: string
  contactEmail: string
  phoneNumber: string
}

export interface CreateOfferRequest {
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
}

export interface UpdateOfferRequest extends Partial<CreateOfferRequest> {
  status?: 'active' | 'inactive'
}

// Response types
export interface SupplierOfferResponse extends Offer {
  views: number
  claims: number
  status: 'active' | 'inactive' | 'expired'
}

export interface SupplierStatsResponse {
  activeOffers: number
  totalViews: number
  totalClaims: number
  viewsTrend: number
}

// Supplier API service
export const supplierApi = {
  // Get current supplier's business profile
  getProfile: () =>
    api.get<SupplierProfile>('/supplier/profile'),

  // Update business profile
  updateProfile: (data: UpdateProfileRequest) =>
    api.put<SupplierProfile>('/supplier/profile', data),

  // Upload business logo
  uploadLogo: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<{ logoUrl: string }>('/supplier/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Get supplier dashboard stats
  getStats: () =>
    api.get<SupplierStatsResponse>('/supplier/stats'),

  // Get supplier's offers
  getOffers: () =>
    api.get<SupplierOfferResponse[]>('/supplier/offers'),

  // Get single offer by ID
  getOfferById: (id: string) =>
    api.get<SupplierOfferResponse>(`/supplier/offers/${id}`),

  // Create a new offer
  createOffer: (data: CreateOfferRequest) =>
    api.post<SupplierOfferResponse>('/supplier/offers', data),

  // Update an existing offer
  updateOffer: (id: string, data: UpdateOfferRequest) =>
    api.put<SupplierOfferResponse>(`/supplier/offers/${id}`, data),

  // Delete an offer
  deleteOffer: (id: string) =>
    api.delete(`/supplier/offers/${id}`),

  // Toggle offer status (activate/deactivate)
  toggleOfferStatus: (id: string) =>
    api.post<SupplierOfferResponse>(`/supplier/offers/${id}/toggle-status`),
}

export default supplierApi
