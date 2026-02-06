package com.myisland.api.modules.booking.dto;

import java.math.BigDecimal;

public record PaymentIntentResponse(
        String clientSecret,
        String paymentIntentId,
        String publishableKey,
        BigDecimal amount,
        boolean devMode
) {}
