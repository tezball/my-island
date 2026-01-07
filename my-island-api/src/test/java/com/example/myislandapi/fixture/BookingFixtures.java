package com.example.myislandapi.fixture;

import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.model.BookingModel;
import com.example.myislandapi.model.LotModel;
import com.example.myislandapi.model.UserModel;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Fixtures for creating BookingModel instances in tests.
 */
public class BookingFixtures {

    public static BookingModel createBooking(UserModel user, LotModel lot) {
        return builder()
                .user(user)
                .lot(lot)
                .build();
    }

    public static BookingModel createBooking(UserModel user, LotModel lot, LocalDate checkIn, LocalDate checkOut) {
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
        private UserModel user;
        private LotModel lot;
        private LocalDate checkIn = LocalDate.now().plusDays(7);
        private LocalDate checkOut = LocalDate.now().plusDays(10);
        private int guests = 2;
        private BookingStatus status = BookingStatus.PENDING;
        private BigDecimal lotPrice = new BigDecimal("105.00"); // 3 nights * 35
        private BigDecimal extrasPrice = BigDecimal.ZERO;
        private BigDecimal serviceFee = new BigDecimal("10.00");
        private BigDecimal totalPrice = new BigDecimal("115.00");
        private String specialRequests = null;

        public BookingBuilder user(UserModel user) {
            this.user = user;
            return this;
        }

        public BookingBuilder lot(LotModel lot) {
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

        public BookingModel build() {
            BookingModel booking = new BookingModel();
            if (user != null) {
                booking.setUserId(user.getId());
                booking.setUser(user);
            }
            if (lot != null) {
                booking.setLotId(lot.getId());
                booking.setLot(lot);
            }
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
