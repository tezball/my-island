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
    public static final String TYPE_MODIFIED = "BOOKING_MODIFIED";
    public static final String TYPE_PAYMENT_RECEIVED = "BOOKING_PAYMENT_RECEIVED";
    public static final String TYPE_CHECK_IN_REMINDER = "BOOKING_CHECK_IN_REMINDER";
    public static final String TYPE_CHECK_OUT_REMINDER = "BOOKING_CHECK_OUT_REMINDER";
    public static final String TYPE_NO_SHOW = "BOOKING_NO_SHOW";
    public static final String TYPE_EXTENDED = "BOOKING_EXTENDED";
    public static final String TYPE_REFUND_REQUESTED = "BOOKING_REFUND_REQUESTED";

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

    public static BookingEvent modified(UUID bookingId, UUID userId, UUID campsiteId, UUID lotId,
                                        LocalDate checkIn, LocalDate checkOut, BigDecimal totalPrice, BookingStatus status) {
        return new BookingEvent(bookingId, userId, campsiteId, lotId, TYPE_MODIFIED,
                checkIn, checkOut, totalPrice, status, System.currentTimeMillis());
    }

    public static BookingEvent checkedIn(UUID bookingId, UUID userId, UUID campsiteId, UUID lotId,
                                         LocalDate checkIn, LocalDate checkOut, BigDecimal totalPrice) {
        return new BookingEvent(bookingId, userId, campsiteId, lotId, TYPE_CHECKED_IN,
                checkIn, checkOut, totalPrice, BookingStatus.CHECKED_IN, System.currentTimeMillis());
    }

    public static BookingEvent completed(UUID bookingId, UUID userId, UUID campsiteId, UUID lotId,
                                         LocalDate checkIn, LocalDate checkOut, BigDecimal totalPrice) {
        return new BookingEvent(bookingId, userId, campsiteId, lotId, TYPE_COMPLETED,
                checkIn, checkOut, totalPrice, BookingStatus.COMPLETED, System.currentTimeMillis());
    }
}
