package com.myisland.api.modules.booking.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CreateBookingRequest(
        @NotNull(message = "Lot ID is required")
        Long lotId,

        @NotNull(message = "Check-in date is required")
        @FutureOrPresent(message = "Check-in date must be today or in the future")
        LocalDate checkInDate,

        @NotNull(message = "Check-out date is required")
        @Future(message = "Check-out date must be in the future")
        LocalDate checkOutDate,

        @Min(value = 1, message = "At least 1 guest is required")
        @Max(value = 20, message = "Maximum 20 guests allowed")
        int numGuests,

        String specialRequests,

        Boolean wantsPower
) {}
