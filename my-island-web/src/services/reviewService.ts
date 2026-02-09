import { apiRequest } from './apiClient';
import type { Review, CreateReviewRequest, ReviewEligibility, EligibleBooking, SupplierReview, CreateSupplierReviewRequest, SupplierReviewEligibility, EligibleClaim } from '../types/review';

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

// --- Supplier Review API types ---

interface SupplierReviewApiResponse {
    id: number;
    userId: number;
    userName: string;
    supplierId: number;
    offerClaimId: number;
    offerTitle: string;
    rating: number;
    comment: string;
    supplierResponse: string | null;
    supplierResponseAt: string | null;
    createdAt: string;
}

interface SupplierReviewEligibilityApiResponse {
    canReview: boolean;
    eligibleClaims: Array<{
        claimId: number;
        offerTitle: string;
        redeemedAt: string;
        alreadyReviewed: boolean;
    }>;
}

function transformSupplierReview(api: SupplierReviewApiResponse): SupplierReview {
    return {
        id: String(api.id),
        userId: String(api.userId),
        userName: api.userName,
        supplierId: String(api.supplierId),
        offerClaimId: String(api.offerClaimId),
        offerTitle: api.offerTitle,
        rating: api.rating,
        comment: api.comment,
        supplierResponse: api.supplierResponse ?? undefined,
        supplierResponseAt: api.supplierResponseAt ?? undefined,
        createdAt: api.createdAt,
    };
}

function transformSupplierEligibility(api: SupplierReviewEligibilityApiResponse): SupplierReviewEligibility {
    return {
        canReview: api.canReview,
        eligibleClaims: api.eligibleClaims.map((ec): EligibleClaim => ({
            claimId: String(ec.claimId),
            offerTitle: ec.offerTitle,
            redeemedAt: ec.redeemedAt,
            alreadyReviewed: ec.alreadyReviewed,
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

    // --- Supplier Review Functions ---

    async getSupplierReviews(supplierId: string): Promise<SupplierReview[]> {
        const data = await apiRequest<SupplierReviewApiResponse[]>(`/reviews/supplier/${supplierId}`, { requiresAuth: false });
        return data.map(transformSupplierReview);
    },

    async checkSupplierEligibility(supplierId: string): Promise<SupplierReviewEligibility> {
        const data = await apiRequest<SupplierReviewEligibilityApiResponse>(`/reviews/supplier/eligibility/${supplierId}`);
        return transformSupplierEligibility(data);
    },

    async createSupplierReview(request: CreateSupplierReviewRequest): Promise<SupplierReview> {
        const data = await apiRequest<SupplierReviewApiResponse>('/reviews/supplier', {
            method: 'POST', body: request,
        });
        return transformSupplierReview(data);
    },

    async getMySupplierReviews(): Promise<SupplierReview[]> {
        const data = await apiRequest<SupplierReviewApiResponse[]>('/supplier/reviews');
        return data.map(transformSupplierReview);
    },

    async respondToSupplierReview(reviewId: string, response: string): Promise<SupplierReview> {
        const data = await apiRequest<SupplierReviewApiResponse>(`/supplier/reviews/${reviewId}/respond`, {
            method: 'PUT', body: { response },
        });
        return transformSupplierReview(data);
    },
};
