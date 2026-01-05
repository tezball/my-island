/**
 * Extras API Service
 *
 * Provides API methods for extras operations including:
 * - Public: Get extras by campsite (for booking flow)
 * - Owner: CRUD operations for campsite extras
 */

import api from '../api'

// Response types
export interface ExtraResponse {
  id: string
  campsiteId: string
  campsiteName: string
  name: string
  description: string | null
  price: number
  perNight: boolean
  imageUrl: string | null
  available: boolean
}

// Request types
export interface CreateExtraRequest {
  campsiteId: string
  name: string
  description?: string
  price: number
  perNight?: boolean
  imageUrl?: string
  available?: boolean
}

export interface UpdateExtraRequest {
  name?: string
  description?: string
  price?: number
  perNight?: boolean
  imageUrl?: string
  available?: boolean
}

// Extras API service
export const extrasApi = {
  // ========== Public endpoints ==========

  /**
   * Get available extras for a campsite (for booking flow)
   */
  getExtrasByCampsite: (campsiteId: string) =>
    api.get<ExtraResponse[]>(`/extras?campsiteId=${campsiteId}`),

  /**
   * Get a specific extra by ID
   */
  getExtra: (id: string) =>
    api.get<ExtraResponse>(`/extras/${id}`),

  // ========== Owner endpoints ==========

  /**
   * Get all extras for owner's campsites
   * @param campsiteId - Optional filter by campsite
   */
  getOwnerExtras: (campsiteId?: string) =>
    api.get<ExtraResponse[]>(`/owner/extras${campsiteId ? `?campsiteId=${campsiteId}` : ''}`),

  /**
   * Get a specific extra by ID (owner)
   */
  getOwnerExtra: (id: string) =>
    api.get<ExtraResponse>(`/owner/extras/${id}`),

  /**
   * Create a new extra for a campsite
   */
  createExtra: (data: CreateExtraRequest) =>
    api.post<ExtraResponse>('/owner/extras', data),

  /**
   * Update an existing extra
   */
  updateExtra: (id: string, data: UpdateExtraRequest) =>
    api.put<ExtraResponse>(`/owner/extras/${id}`, data),

  /**
   * Delete an extra (soft delete - sets available to false)
   */
  deleteExtra: (id: string) =>
    api.delete<void>(`/owner/extras/${id}`),
}

export default extrasApi
