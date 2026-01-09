package com.example.myislandapi.event;

import java.math.BigDecimal;
import java.util.UUID;

public record PaymentEvent(
        UUID paymentId,
        UUID bookingId,
        UUID userId,
        String eventType,
        BigDecimal amount,
        String currency,
        String stripePaymentIntentId,
        String failureReason,
        long timestamp
) {
    public static final String TYPE_INITIATED = "PAYMENT_INITIATED";
    public static final String TYPE_SUCCEEDED = "PAYMENT_SUCCEEDED";
    public static final String TYPE_FAILED = "PAYMENT_FAILED";
    public static final String TYPE_REFUNDED = "PAYMENT_REFUNDED";
    public static final String TYPE_DISPUTED = "PAYMENT_DISPUTED";

    public static PaymentEvent initiated(UUID bookingId, UUID userId, BigDecimal amount, String currency, String stripePaymentIntentId) {
        return new PaymentEvent(null, bookingId, userId, TYPE_INITIATED, amount, currency, stripePaymentIntentId, null, System.currentTimeMillis());
    }

    public static PaymentEvent succeeded(UUID bookingId, UUID userId, BigDecimal amount, String currency, String stripePaymentIntentId) {
        return new PaymentEvent(null, bookingId, userId, TYPE_SUCCEEDED, amount, currency, stripePaymentIntentId, null, System.currentTimeMillis());
    }

    public static PaymentEvent failed(UUID bookingId, UUID userId, BigDecimal amount, String currency, String stripePaymentIntentId, String failureReason) {
        return new PaymentEvent(null, bookingId, userId, TYPE_FAILED, amount, currency, stripePaymentIntentId, failureReason, System.currentTimeMillis());
    }

    public static PaymentEvent refunded(UUID paymentId, UUID bookingId, UUID userId, BigDecimal amount, String currency) {
        return new PaymentEvent(paymentId, bookingId, userId, TYPE_REFUNDED, amount, currency, null, null, System.currentTimeMillis());
    }

    public static PaymentEvent disputed(UUID paymentId, UUID bookingId, UUID userId, BigDecimal amount, String currency) {
        return new PaymentEvent(paymentId, bookingId, userId, TYPE_DISPUTED, amount, currency, null, null, System.currentTimeMillis());
    }
}
