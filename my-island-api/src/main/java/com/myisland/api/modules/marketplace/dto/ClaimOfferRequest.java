package com.myisland.api.modules.marketplace.dto;

import jakarta.validation.constraints.NotNull;

public record ClaimOfferRequest(
        @NotNull(message = "Offer ID is required")
        Long offerId,

        Long bookingId
) {}
