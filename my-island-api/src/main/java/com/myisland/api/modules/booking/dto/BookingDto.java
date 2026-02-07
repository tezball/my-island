package com.myisland.api.modules.booking.dto;

import com.myisland.api.modules.booking.entity.Booking;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record BookingDto(
        Long id,
        Long userId,
        String userName,
        Long lotId,
        String lotName,
        String campsiteName,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        int numGuests,
        BigDecimal totalPrice,
        BigDecimal serviceFee,
        BigDecimal chargeTotal,
        String status,
        String paymentStatus,
        String specialRequests,
        LocalDateTime createdAt,
        String guestName,
        String guestEmail,
        String guestPhone,
        String bookingSource
) {
    public static BookingDto from(Booking booking) {
        return new BookingDto(
                booking.getId(),
                booking.getUser() != null ? booking.getUser().getId() : null,
                booking.getUser() != null ? booking.getUser().getName() : booking.getGuestName(),
                booking.getLot().getId(),
                booking.getLot().getName(),
                booking.getLot().getOwner().getPropertyName(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getNumGuests(),
                booking.getTotalPrice(),
                booking.getServiceFee(),
                booking.getChargeTotal(),
                booking.getStatus().name(),
                booking.getPaymentStatus() != null ? booking.getPaymentStatus().name() : "NONE",
                booking.getSpecialRequests(),
                booking.getCreatedAt(),
                booking.getGuestName(),
                booking.getGuestEmail(),
                booking.getGuestPhone(),
                booking.getBookingSource() != null ? booking.getBookingSource().name() : null
        );
    }
}
