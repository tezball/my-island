package com.myisland.api.modules.marketplace.dto;

import com.myisland.api.modules.marketplace.entity.OfferClaim;

import java.time.LocalDateTime;

public record OfferClaimDto(
        Long id,
        Long offerId,
        String offerTitle,
        String supplierName,
        Long userId,
        String userName,
        Long bookingId,
        String claimCode,
        String status,
        boolean isTest,
        LocalDateTime claimedAt,
        LocalDateTime redeemedAt,
        LocalDateTime expiresAt,
        boolean isValid
) {
    public static OfferClaimDto from(OfferClaim claim) {
        return new OfferClaimDto(
                claim.getId(),
                claim.getOffer().getId(),
                claim.getOffer().getTitle(),
                claim.getOffer().getSupplier().getBusinessName(),
                claim.getUser().getId(),
                claim.getUser().getName(),
                claim.getBooking() != null ? claim.getBooking().getId() : null,
                claim.getClaimCode(),
                claim.getStatus().name(),
                claim.isTest(),
                claim.getClaimedAt(),
                claim.getRedeemedAt(),
                claim.getExpiresAt(),
                claim.isValid()
        );
    }
}
