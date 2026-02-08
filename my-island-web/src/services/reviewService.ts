import { apiRequest } from './apiClient';
import type { Review, CreateReviewRequest, ReviewEligibility, EligibleBooking } from '../types/review';

interface ReviewApiResponse {
    id: number;
    userId: number;
    userName: string;
    ownerId: number;
    bookingId: number;
    lotName: string;
    rating: number;
    comment: string;
    ownerResponse: string | null;
    ownerResponseAt: string | null;
    createdAt: string;
}

interface ReviewEligibilityApiResponse {
    canReview: boolean;
    eligibleBookings: Array<{
        bookingId: number;
        lotName: string;
        checkInDate: string;
        checkOutDate: string;
        alreadyReviewed: boolean;
    }>;
}

function transformReview(api: ReviewApiResponse): Review {
    return {
        id: String(api.id),
        userId: String(api.userId),
        userName: api.userName,
        ownerId: String(api.ownerId),
        bookingId: String(api.bookingId),
        lotName: api.lotName,
        rating: api.rating,
        comment: api.comment,
        ownerResponse: api.ownerResponse ?? undefined,
        ownerResponseAt: api.ownerResponseAt ?? undefined,
        createdAt: api.createdAt,
    };
}

function transformEligibility(api: ReviewEligibilityApiResponse): ReviewEligibility {
    return {
        canReview: api.canReview,
        eligibleBookings: api.eligibleBookings.map((eb): EligibleBooking => ({
            bookingId: String(eb.bookingId),
            lotName: eb.lotName,
            checkInDate: eb.checkInDate,
            checkOutDate: eb.checkOutDate,
            alreadyReviewed: eb.alreadyReviewed,
        })),
    };
}

export const reviewService = {
    async getCampsiteReviews(ownerId: string): Promise<Review[]> {
        const data = await apiRequest<ReviewApiResponse[]>(`/reviews/campsite/${ownerId}`, { requiresAuth: false });
        return data.map(transformReview);
    },

    async checkEligibility(ownerId: string): Promise<ReviewEligibility> {
        const data = await apiRequest<ReviewEligibilityApiResponse>(`/reviews/eligibility/${ownerId}`);
        return transformEligibility(data);
    },

    async createReview(request: CreateReviewRequest): Promise<Review> {
        const data = await apiRequest<ReviewApiResponse>('/reviews', {
            method: 'POST', body: request,
        });
        return transformReview(data);
    },

    async getOwnerReviews(): Promise<Review[]> {
        const data = await apiRequest<ReviewApiResponse[]>('/owner/reviews');
        return data.map(transformReview);
    },

    async respondToReview(reviewId: string, response: string): Promise<Review> {
        const data = await apiRequest<ReviewApiResponse>(`/owner/reviews/${reviewId}/respond`, {
            method: 'PUT', body: { response },
        });
        return transformReview(data);
    },
};
