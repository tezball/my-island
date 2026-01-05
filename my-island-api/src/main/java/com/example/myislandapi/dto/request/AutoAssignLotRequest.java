package com.example.myislandapi.dto.request;

import com.example.myislandapi.enums.LotType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record AutoAssignLotRequest(
    @NotNull(message = "Campsite ID is required")
    UUID campsiteId,

    @NotNull(message = "Lot type is required")
    LotType type,

    @NotNull(message = "Check-in date is required")
    LocalDate checkIn,

    @NotNull(message = "Check-out date is required")
    LocalDate checkOut,

    @Min(value = 1, message = "At least 1 guest is required")
    int guests
) {}
