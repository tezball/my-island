package com.myisland.api.shared.email;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookingEmailData(
        Long bookingId,
        String guestName,
        String guestEmail,
        String lotName,
        String propertyName,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        int numGuests,
        BigDecimal totalPrice
) {
}
