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
