/**
 * Favorites API Service
 *
 * Provides API methods for favorites-related operations including:
 * - Add/remove favorites
 * - List user favorites
 * - Check if campsite is favorited
 */

import api from '../api'

// Response types
export interface FavoriteResponse {
  id: string
  campsiteId: string
  campsiteName: string
  campsiteImage: string
  location: string
  priceFrom: number
  rating: number
  createdAt: string
}

// Paginated response wrapper
interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// Favorites API service
export const favoritesApi = {
  // Add campsite to favorites
  add: (campsiteId: string) =>
    api.post<void>(`/favorites/${campsiteId}`),

  // Remove campsite from favorites
  remove: (campsiteId: string) =>
    api.delete<void>(`/favorites/${campsiteId}`),

  // List user's favorites
  list: async (): Promise<FavoriteResponse[]> => {
    const response = await api.get<FavoriteResponse[] | PagedResponse<FavoriteResponse>>('/favorites')
    // Handle both array and paginated response formats
    if (Array.isArray(response)) {
      return response
    }
    return response.content || []
  },

  // Check if campsite is favorited
  check: (campsiteId: string) =>
    api.get<{ isFavorite: boolean }>(`/favorites/${campsiteId}/check`),
}

export default favoritesApi
