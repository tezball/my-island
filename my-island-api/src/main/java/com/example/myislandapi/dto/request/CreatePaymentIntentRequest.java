package com.example.myislandapi.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreatePaymentIntentRequest(
    @NotNull(message = "Booking ID is required")
    UUID bookingId
) {}
