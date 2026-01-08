package com.example.myislandapi.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record PaymentIntentResponse(
    String clientSecret,
    String paymentIntentId,
    BigDecimal amount,
    String currency,
    UUID bookingId,
    String publishableKey
) {}
