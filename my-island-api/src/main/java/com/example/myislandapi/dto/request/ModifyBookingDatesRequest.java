package com.example.myislandapi.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ModifyBookingDatesRequest(
    @NotNull(message = "Check-in date is required")
    @Future(message = "Check-in date must be in the future")
    LocalDate checkIn,

    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    LocalDate checkOut
) {}
