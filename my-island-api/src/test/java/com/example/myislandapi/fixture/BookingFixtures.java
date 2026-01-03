package com.example.myislandapi.fixture;

import com.example.myislandapi.entity.Booking;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Fixtures for creating Booking entities in tests.
 */
public class BookingFixtures {

    public static Booking createBooking(User user, Lot lot) {
        return builder()
                .user(user)
                .lot(lot)
                .build();
    }

    public static Booking createBooking(User user, Lot lot, LocalDate checkIn, LocalDate checkOut) {
        return builder()
                .user(user)
                .lot(lot)
                .checkIn(checkIn)
                .checkOut(checkOut)
                .build();
    }

    public static BookingBuilder builder() {
        return new BookingBuilder();
    }

    public static class BookingBuilder {
        private User user;
        private Lot lot;
        private LocalDate checkIn = LocalDate.now().plusDays(7);
        private LocalDate checkOut = LocalDate.now().plusDays(10);
        private int guests = 2;
        private BookingStatus status = BookingStatus.PENDING;
        private BigDecimal lotPrice = new BigDecimal("105.00"); // 3 nights * 35
        private BigDecimal extrasPrice = BigDecimal.ZERO;
        private BigDecimal serviceFee = new BigDecimal("10.00");
        private BigDecimal totalPrice = new BigDecimal("115.00");
        private String specialRequests = null;

        public BookingBuilder user(User user) {
            this.user = user;
            return this;
        }

        public BookingBuilder lot(Lot lot) {
            this.lot = lot;
            return this;
        }

        public BookingBuilder checkIn(LocalDate checkIn) {
            this.checkIn = checkIn;
            return this;
        }

        public BookingBuilder checkOut(LocalDate checkOut) {
            this.checkOut = checkOut;
            return this;
        }

        public BookingBuilder guests(int guests) {
            this.guests = guests;
            return this;
        }

        public BookingBuilder status(BookingStatus status) {
            this.status = status;
            return this;
        }

        public BookingBuilder confirmed() {
            this.status = BookingStatus.CONFIRMED;
            return this;
        }

        public BookingBuilder cancelled() {
            this.status = BookingStatus.CANCELLED;
            return this;
        }

        public BookingBuilder lotPrice(BigDecimal lotPrice) {
            this.lotPrice = lotPrice;
            return this;
        }

        public BookingBuilder extrasPrice(BigDecimal extrasPrice) {
            this.extrasPrice = extrasPrice;
            return this;
        }

        public BookingBuilder serviceFee(BigDecimal serviceFee) {
            this.serviceFee = serviceFee;
            return this;
        }

        public BookingBuilder totalPrice(BigDecimal totalPrice) {
            this.totalPrice = totalPrice;
            return this;
        }

        public BookingBuilder specialRequests(String specialRequests) {
            this.specialRequests = specialRequests;
            return this;
        }

        public Booking build() {
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setLot(lot);
            booking.setCheckIn(checkIn);
            booking.setCheckOut(checkOut);
            booking.setGuests(guests);
            booking.setStatus(status);
            booking.setLotPrice(lotPrice);
            booking.setExtrasPrice(extrasPrice);
            booking.setServiceFee(serviceFee);
            booking.setTotalPrice(totalPrice);
            booking.setSpecialRequests(specialRequests);
            return booking;
        }
    }
}
