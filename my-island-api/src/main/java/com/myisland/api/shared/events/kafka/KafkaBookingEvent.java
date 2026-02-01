package com.myisland.api.shared.events.kafka;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record KafkaBookingEvent(
        Long bookingId,
        Long userId,
        String userName,
        String userEmail,
        Long lotId,
        String lotName,
        Long ownerId,
        String ownerPropertyName,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        int numGuests,
        BigDecimal totalPrice,
        String status,
        LocalDateTime timestamp
) {}
