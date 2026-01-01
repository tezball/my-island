package com.example.myislandapi.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CreateBookingRequest(
    @NotNull UUID lotId,
    @NotNull @Future LocalDate checkIn,
    @NotNull @Future LocalDate checkOut,
    @Min(1) int guests,
    List<BookingExtraRequest> extras,
    String specialRequests
) {
    public record BookingExtraRequest(
        @NotNull UUID extraId,
        @Min(1) int quantity
    ) {}
}
