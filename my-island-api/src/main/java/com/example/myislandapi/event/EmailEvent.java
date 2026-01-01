package com.example.myislandapi.event;

import java.util.UUID;

public record EmailEvent(
        String emailType,
        UUID userId,
        UUID referenceId,
        long timestamp
) {
    public static final String TYPE_BOOKING_CONFIRMATION = "BOOKING_CONFIRMATION";
    public static final String TYPE_BOOKING_CANCELLATION = "BOOKING_CANCELLATION";
    public static final String TYPE_WELCOME = "WELCOME";
    public static final String TYPE_PASSWORD_RESET = "PASSWORD_RESET";
    public static final String TYPE_CHECK_IN_REMINDER = "CHECK_IN_REMINDER";

    public static EmailEvent bookingConfirmation(UUID userId, UUID bookingId) {
        return new EmailEvent(TYPE_BOOKING_CONFIRMATION, userId, bookingId, System.currentTimeMillis());
    }

    public static EmailEvent bookingCancellation(UUID userId, UUID bookingId) {
        return new EmailEvent(TYPE_BOOKING_CANCELLATION, userId, bookingId, System.currentTimeMillis());
    }

    public static EmailEvent welcome(UUID userId) {
        return new EmailEvent(TYPE_WELCOME, userId, null, System.currentTimeMillis());
    }
}
