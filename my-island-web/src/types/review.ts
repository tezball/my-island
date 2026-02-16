export interface Review {
    id: string;
    userId: string;
    userName: string;
    ownerId: string;
    bookingId: string;
    lotName: string;
    rating: number;
    comment: string;
    ownerResponse?: string;
    ownerResponseAt?: string;
    moderationStatus?: string;
    moderationReason?: string;
    createdAt: string;
}

export interface CreateReviewRequest {
    bookingId: number;
    rating: number;
    comment: string;
}

export interface EligibleBooking {
    bookingId: string;
    lotName: string;
    checkInDate: string;
    checkOutDate: string;
    alreadyReviewed: boolean;
}

export interface ReviewEligibility {
    canReview: boolean;
    eligibleBookings: EligibleBooking[];
}

// Supplier review types
export interface SupplierReview {
    id: string;
    userId: string;
    userName: string;
    supplierId: string;
    offerClaimId: string;
    offerTitle: string;
    rating: number;
    comment: string;
    supplierResponse?: string;
    supplierResponseAt?: string;
    moderationStatus?: string;
    moderationReason?: string;
    createdAt: string;
}

export interface CreateSupplierReviewRequest {
    offerClaimId: number;
    rating: number;
    comment: string;
}

export interface EligibleClaim {
    claimId: string;
    offerTitle: string;
    redeemedAt: string;
    alreadyReviewed: boolean;
}

export interface SupplierReviewEligibility {
    canReview: boolean;
    eligibleClaims: EligibleClaim[];
}
