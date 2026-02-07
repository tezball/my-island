package com.myisland.api.modules.review.dto;

import com.myisland.api.modules.review.entity.Review;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReviewDto(
        Long id,
        Long userId,
        String userName,
        Long ownerId,
        Long bookingId,
        String lotName,
        BigDecimal rating,
        String comment,
        String ownerResponse,
        LocalDateTime ownerResponseAt,
        LocalDateTime createdAt
) {
    public static ReviewDto from(Review review) {
        return new ReviewDto(
                review.getId(),
                review.getUser().getId(),
                review.getUser().getName(),
                review.getOwner().getId(),
                review.getBooking().getId(),
                review.getBooking().getLot().getName(),
                review.getRating(),
                review.getComment(),
                review.getOwnerResponse(),
                review.getOwnerResponseAt(),
                review.getCreatedAt()
        );
    }
}
