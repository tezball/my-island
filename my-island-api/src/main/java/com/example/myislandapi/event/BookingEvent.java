package com.example.myislandapi.event;

import com.example.myislandapi.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record BookingEvent(
        UUID bookingId,
        UUID userId,
        UUID campsiteId,
        UUID lotId,
        String eventType,
        LocalDate checkIn,
        LocalDate checkOut,
        BigDecimal totalPrice,
        BookingStatus status,
        long timestamp
) {
    public static final String TYPE_CREATED = "BOOKING_CREATED";
    public static final String TYPE_CONFIRMED = "BOOKING_CONFIRMED";
    public static final String TYPE_CANCELLED = "BOOKING_CANCELLED";
    public static final String TYPE_CHECKED_IN = "BOOKING_CHECKED_IN";
    public static final String TYPE_COMPLETED = "BOOKING_COMPLETED";

    public static BookingEvent created(UUID bookingId, UUID userId, UUID campsiteId, UUID lotId,
                                       LocalDate checkIn, LocalDate checkOut, BigDecimal totalPrice) {
        return new BookingEvent(bookingId, userId, campsiteId, lotId, TYPE_CREATED,
                checkIn, checkOut, totalPrice, BookingStatus.PENDING, System.currentTimeMillis());
    }

    public static BookingEvent confirmed(UUID bookingId, UUID userId, UUID campsiteId, UUID lotId,
                                         LocalDate checkIn, LocalDate checkOut, BigDecimal totalPrice) {
        return new BookingEvent(bookingId, userId, campsiteId, lotId, TYPE_CONFIRMED,
                checkIn, checkOut, totalPrice, BookingStatus.CONFIRMED, System.currentTimeMillis());
    }

    public static BookingEvent cancelled(UUID bookingId, UUID userId, UUID campsiteId, UUID lotId,
                                         LocalDate checkIn, LocalDate checkOut, BigDecimal totalPrice) {
        return new BookingEvent(bookingId, userId, campsiteId, lotId, TYPE_CANCELLED,
                checkIn, checkOut, totalPrice, BookingStatus.CANCELLED, System.currentTimeMillis());
    }
}
