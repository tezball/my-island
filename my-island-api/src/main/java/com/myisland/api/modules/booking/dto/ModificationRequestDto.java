package com.myisland.api.modules.booking.dto;

import com.myisland.api.modules.booking.entity.BookingModificationRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ModificationRequestDto(
    Long id,
    Long bookingId,
    String status,
    Long requestedLotId,
    String requestedLotName,
    LocalDate requestedCheckInDate,
    LocalDate requestedCheckOutDate,
    Boolean requestedWantsPower,
    BigDecimal estimatedNewPrice,
    BigDecimal priceDifference,
    String reason,
    String declineReason,
    LocalDateTime createdAt,
    LocalDateTime resolvedAt,
    // Current booking values for comparison
    Long currentLotId,
    String currentLotName,
    LocalDate currentCheckInDate,
    LocalDate currentCheckOutDate,
    BigDecimal currentTotalPrice,
    String guestName
) {
    public static ModificationRequestDto from(BookingModificationRequest request) {
        var booking = request.getBooking();
        return new ModificationRequestDto(
                request.getId(),
                booking.getId(),
                request.getStatus().name(),
                request.getRequestedLotId(),
                request.getRequestedLotId() != null && !request.getRequestedLotId().equals(booking.getLot().getId())
                        ? null : booking.getLot().getName(), // will be populated in service if lot changed
                request.getRequestedCheckInDate(),
                request.getRequestedCheckOutDate(),
                request.getRequestedWantsPower(),
                request.getEstimatedNewPrice(),
                request.getPriceDifference(),
                request.getReason(),
                request.getDeclineReason(),
                request.getCreatedAt(),
                request.getResolvedAt(),
                booking.getLot().getId(),
                booking.getLot().getName(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getTotalPrice(),
                booking.getUser() != null ? booking.getUser().getName() : booking.getGuestName()
        );
    }
}
