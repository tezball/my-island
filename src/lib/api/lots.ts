/**
 * Lots API Service
 *
 * Provides API methods for lot-related operations including:
 * - Get lot types aggregated by campsite
 * - Auto-assign a lot for booking
 */

import api from '../api'
import type { LotType } from '../../data/types'

// Response types
export interface LotTypeAggregation {
  type: LotType
  totalCount: number
  availableCount: number
  minPrice: number
  maxPrice: number
  maxCapacity: number
  representativeImage: string
  commonAmenities: string[]
}

export interface AutoAssignRequest {
  campsiteId: string
  type: string // Backend uses uppercase enum
  checkIn: string // ISO date string
  checkOut: string // ISO date string
  guests: number
}

export interface AutoAssignResponse {
  lotId: string
  lotName: string
  type: LotType
  capacity: number
  pricePerNight: number
  images: string[]
  amenities: string[]
}

// Helper to convert LotType to backend format
function toBackendLotType(type: LotType): string {
  return type.toUpperCase().replace(/-/g, '_')
}

// Helper to convert backend LotType to frontend format
function fromBackendLotType(type: string): LotType {
  return type.toLowerCase().replace(/_/g, '_') as LotType
}

// Lots API service
export const lotsApi = {
  // Get lot types aggregated by campsite
  getLotTypes: async (campsiteId: string): Promise<LotTypeAggregation[]> => {
    const response = await api.get<LotTypeAggregation[]>(`/lots/types?campsiteId=${campsiteId}`)
    // Convert backend enum format to frontend format
    return response.map(lt => ({
      ...lt,
      type: fromBackendLotType(lt.type as unknown as string),
    }))
  },

  // Auto-assign the best available lot
  autoAssign: async (request: Omit<AutoAssignRequest, 'type'> & { type: LotType }): Promise<AutoAssignResponse> => {
    const backendRequest: AutoAssignRequest = {
      ...request,
      type: toBackendLotType(request.type),
    }
    const response = await api.post<AutoAssignResponse>('/lots/auto-assign', backendRequest)
    return {
      ...response,
      type: fromBackendLotType(response.type as unknown as string),
    }
  },
}

export default lotsApi
