package com.myisland.api.modules.accommodation.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record BookingsDetailResponse(
        Summary summary,
        List<BookingDetail> bookings
) {
    public record Summary(
            int total,
            int confirmed,
            int pending,
            int cancelled,
            int checkInsThisWeek,
            int checkOutsThisWeek
    ) {}

    public record BookingDetail(
            Long id,
            String userName,
            String lotName,
            String lotType,
            LocalDate startDate,
            LocalDate endDate,
            String status,
            BigDecimal totalPrice,
            int guests
    ) {}
}
