package com.myisland.api.modules.review.dto;

import java.time.LocalDate;
import java.util.List;

public record ReviewEligibilityDto(
        boolean canReview,
        List<EligibleBooking> eligibleBookings
) {
    public record EligibleBooking(
            Long bookingId,
            String lotName,
            LocalDate checkInDate,
            LocalDate checkOutDate,
            boolean alreadyReviewed
    ) {}
}
