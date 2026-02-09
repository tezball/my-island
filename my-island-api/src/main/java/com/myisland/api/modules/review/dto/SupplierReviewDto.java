package com.myisland.api.modules.review.dto;

import com.myisland.api.modules.review.entity.SupplierReview;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SupplierReviewDto(
        Long id,
        Long userId,
        String userName,
        Long supplierId,
        Long offerClaimId,
        String offerTitle,
        BigDecimal rating,
        String comment,
        String supplierResponse,
        LocalDateTime supplierResponseAt,
        LocalDateTime createdAt
) {
    public static SupplierReviewDto from(SupplierReview review) {
        return new SupplierReviewDto(
                review.getId(),
                review.getUser().getId(),
                review.getUser().getName(),
                review.getSupplier().getId(),
                review.getOfferClaim().getId(),
                review.getOfferClaim().getOffer().getTitle(),
                review.getRating(),
                review.getComment(),
                review.getSupplierResponse(),
                review.getSupplierResponseAt(),
                review.getCreatedAt()
        );
    }
}
