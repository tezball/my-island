/**
 * Reviews API Service
 *
 * Provides API methods for review-related operations including:
 * - Create reviews
 * - List campsite reviews
 * - Mark review as helpful
 * - Owner responses
 */

import api from '../api'

// Request types
export interface CreateReviewRequest {
  campsiteId: string
  bookingId?: string
  rating: number
  title: string
  comment: string
  categories?: {
    cleanliness?: number
    location?: number
    value?: number
    facilities?: number
  }
}

export interface OwnerResponseRequest {
  response: string
}

// Response types
export interface ReviewResponse {
  id: string
  campsiteId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  categories?: {
    cleanliness?: number
    location?: number
    value?: number
    facilities?: number
  }
  helpfulCount: number
  isHelpful: boolean
  ownerResponse?: {
    response: string
    respondedAt: string
  }
  createdAt: string
  updatedAt: string
}

export interface ReviewStatsResponse {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  categoryAverages?: {
    cleanliness: number
    location: number
    value: number
    facilities: number
  }
}

// Reviews API service
export const reviewsApi = {
  // Create a review
  create: (data: CreateReviewRequest) =>
    api.post<ReviewResponse>('/reviews', data),

  // Get reviews for a campsite
  getByCampsite: (campsiteId: string) =>
    api.get<ReviewResponse[]>(`/campsites/${campsiteId}/reviews`),

  // Get review statistics for a campsite
  getStats: (campsiteId: string) =>
    api.get<ReviewStatsResponse>(`/campsites/${campsiteId}/reviews/stats`),

  // Mark review as helpful
  markHelpful: (reviewId: string) =>
    api.post<void>(`/reviews/${reviewId}/helpful`),

  // Add owner response (owner only)
  respond: (reviewId: string, data: OwnerResponseRequest) =>
    api.post<ReviewResponse>(`/reviews/${reviewId}/respond`, data),
}

export default reviewsApi
