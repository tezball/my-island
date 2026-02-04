package com.myisland.api.modules.marketplace.dto;

import jakarta.validation.constraints.NotBlank;

public record ConfirmSubscriptionRequest(
        @NotBlank(message = "Payment method ID is required")
        String paymentMethodId
) {}
