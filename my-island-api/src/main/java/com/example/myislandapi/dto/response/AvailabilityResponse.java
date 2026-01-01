package com.example.myislandapi.dto.response;

import com.example.myislandapi.enums.AvailabilityStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record AvailabilityResponse(
    List<DateAvailability> dates
) {
    public record DateAvailability(
        LocalDate date,
        AvailabilityStatus status,
        BigDecimal price
    ) {}
}
