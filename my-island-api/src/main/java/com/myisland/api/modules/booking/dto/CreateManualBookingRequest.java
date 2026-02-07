package com.myisland.api.modules.booking.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CreateManualBookingRequest(
        @NotNull(message = "Lot ID is required")
        Long lotId,

        @NotNull(message = "Check-in date is required")
        LocalDate checkInDate,

        @NotNull(message = "Check-out date is required")
        LocalDate checkOutDate,

        @Min(value = 1, message = "At least 1 guest is required")
        @Max(value = 20, message = "Maximum 20 guests allowed")
        int numGuests,

        @NotBlank(message = "Guest name is required")
        String guestName,

        String guestEmail,

        String guestPhone,

        String specialRequests,

        String bookingSource
) {}
