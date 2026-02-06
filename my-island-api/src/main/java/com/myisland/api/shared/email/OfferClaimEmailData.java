package com.myisland.api.shared.email;

public record OfferClaimEmailData(
        Long claimId,
        String offerTitle,
        String supplierName,
        String guestName,
        String guestEmail,
        String claimCode
) {
}
