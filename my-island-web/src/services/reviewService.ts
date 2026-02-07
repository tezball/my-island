import type { Review, CreateReviewRequest, ReviewEligibility, EligibleBooking } from '../types/review';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

class ReviewServiceError extends Error {
    readonly statusCode?: number;
    constructor(message: string, statusCode?: number) {
        super(message);
        this.name = 'ReviewServiceError';
        this.statusCode = statusCode;
    }
}

async function apiRequest<T>(
    endpoint: string,
    options: { method?: string; body?: unknown; requiresAuth?: boolean } = {}
): Promise<T> {
    const { method = 'GET', body, requiresAuth = false } = options;

    const headers: HeadersInit = { 'Content-Type': 'application/json' };

    if (requiresAuth) {
        const token = localStorage.getItem('token');
        if (!token) throw new ReviewServiceError('Authentication required', 401);
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
            const errorBody = await response.text();
            try {
                const errorJson = JSON.parse(errorBody);
                errorMessage = errorJson.message || errorJson.error || errorBody;
            } catch {
                if (errorBody && errorBody.length < 500) errorMessage = errorBody;
            }
        } catch { /* ignore */ }
        throw new ReviewServiceError(errorMessage, response.status);
    }

    return response.json();
}

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

interface EligibleBookingApiResponse {
    bookingId: number;
    lotName: string;
    checkInDate: string;
    checkOutDate: string;
    alreadyReviewed: boolean;
}

interface ReviewEligibilityApiResponse {
    canReview: boolean;
    eligibleBookings: EligibleBookingApiResponse[];
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
        const data = await apiRequest<ReviewApiResponse[]>(`/reviews/campsite/${ownerId}`);
        return data.map(transformReview);
    },

    async checkEligibility(ownerId: string): Promise<ReviewEligibility> {
        const data = await apiRequest<ReviewEligibilityApiResponse>(`/reviews/eligibility/${ownerId}`, {
            requiresAuth: true,
        });
        return transformEligibility(data);
    },

    async createReview(request: CreateReviewRequest): Promise<Review> {
        const data = await apiRequest<ReviewApiResponse>('/reviews', {
            method: 'POST',
            requiresAuth: true,
            body: request,
        });
        return transformReview(data);
    },

    async getOwnerReviews(): Promise<Review[]> {
        const data = await apiRequest<ReviewApiResponse[]>('/owner/reviews', {
            requiresAuth: true,
        });
        return data.map(transformReview);
    },

    async respondToReview(reviewId: string, response: string): Promise<Review> {
        const data = await apiRequest<ReviewApiResponse>(`/owner/reviews/${reviewId}/respond`, {
            method: 'PUT',
            requiresAuth: true,
            body: { response },
        });
        return transformReview(data);
    },
};
