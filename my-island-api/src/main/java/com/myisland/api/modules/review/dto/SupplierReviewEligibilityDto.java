package com.myisland.api.modules.review.dto;

import java.time.LocalDateTime;
import java.util.List;

public record SupplierReviewEligibilityDto(
        boolean canReview,
        List<EligibleClaim> eligibleClaims
) {
    public record EligibleClaim(
            Long claimId,
            String offerTitle,
            LocalDateTime redeemedAt,
            boolean alreadyReviewed
    ) {}
}
