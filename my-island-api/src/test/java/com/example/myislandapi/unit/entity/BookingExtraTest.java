package com.example.myislandapi.unit.entity;

import com.example.myislandapi.entity.Booking;
import com.example.myislandapi.entity.BookingExtra;
import com.example.myislandapi.entity.Extra;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for BookingExtra entity price calculation logic.
 */
@DisplayName("BookingExtra Entity Unit Tests")
class BookingExtraTest {

    @Nested
    @DisplayName("Price Calculation - One-time Extras")
    class OneTimeExtras {

        @Test
        @DisplayName("Should calculate total for single quantity one-time extra")
        void shouldCalculateTotalForSingleQuantity() {
            Booking booking = createBookingWithNights(3);
            Extra extra = createExtra("Welcome Pack", new BigDecimal("25.00"), false);

            BookingExtra bookingExtra = new BookingExtra(booking, extra, 1);

            assertThat(bookingExtra.getUnitPrice()).isEqualByComparingTo(new BigDecimal("25.00"));
            assertThat(bookingExtra.getTotalPrice()).isEqualByComparingTo(new BigDecimal("25.00"));
        }

        @Test
        @DisplayName("Should calculate total for multiple quantity one-time extra")
        void shouldCalculateTotalForMultipleQuantity() {
            Booking booking = createBookingWithNights(3);
            Extra extra = createExtra("Firewood Bundle", new BigDecimal("10.00"), false);

            BookingExtra bookingExtra = new BookingExtra(booking, extra, 3);

            assertThat(bookingExtra.getUnitPrice()).isEqualByComparingTo(new BigDecimal("10.00"));
            assertThat(bookingExtra.getTotalPrice()).isEqualByComparingTo(new BigDecimal("30.00")); // 10 * 3
        }

        @Test
        @DisplayName("Should not multiply by nights for one-time extras")
        void shouldNotMultiplyByNights() {
            Booking booking = createBookingWithNights(7);
            Extra extra = createExtra("Kayak Rental", new BigDecimal("50.00"), false);

            BookingExtra bookingExtra = new BookingExtra(booking, extra, 2);

            // Should be 50 * 2 = 100, NOT 50 * 2 * 7 = 700
            assertThat(bookingExtra.getTotalPrice()).isEqualByComparingTo(new BigDecimal("100.00"));
        }
    }

    @Nested
    @DisplayName("Price Calculation - Per-night Extras")
    class PerNightExtras {

        @Test
        @DisplayName("Should multiply by nights for per-night extras")
        void shouldMultiplyByNights() {
            Booking booking = createBookingWithNights(3);
            Extra extra = createExtra("Breakfast", new BigDecimal("15.00"), true);

            BookingExtra bookingExtra = new BookingExtra(booking, extra, 1);

            // 15 * 1 * 3 nights = 45
            assertThat(bookingExtra.getTotalPrice()).isEqualByComparingTo(new BigDecimal("45.00"));
        }

        @Test
        @DisplayName("Should multiply by nights and quantity for per-night extras")
        void shouldMultiplyByNightsAndQuantity() {
            Booking booking = createBookingWithNights(5);
            Extra extra = createExtra("Breakfast for 2", new BigDecimal("20.00"), true);

            BookingExtra bookingExtra = new BookingExtra(booking, extra, 2);

            // 20 * 2 quantity * 5 nights = 200
            assertThat(bookingExtra.getTotalPrice()).isEqualByComparingTo(new BigDecimal("200.00"));
        }

        @Test
        @DisplayName("Should calculate correctly for single night")
        void shouldCalculateCorrectlyForSingleNight() {
            Booking booking = createBookingWithNights(1);
            Extra extra = createExtra("Daily Newspaper", new BigDecimal("5.00"), true);

            BookingExtra bookingExtra = new BookingExtra(booking, extra, 1);

            assertThat(bookingExtra.getTotalPrice()).isEqualByComparingTo(new BigDecimal("5.00"));
        }
    }

    @Nested
    @DisplayName("recalculateTotalPrice()")
    class RecalculateTotalPrice {

        @Test
        @DisplayName("Should recalculate when called with different nights")
        void shouldRecalculateWithDifferentNights() {
            Booking booking = createBookingWithNights(3);
            Extra extra = createExtra("Breakfast", new BigDecimal("15.00"), true);

            BookingExtra bookingExtra = new BookingExtra(booking, extra, 2);

            // Initial: 15 * 2 * 3 = 90
            assertThat(bookingExtra.getTotalPrice()).isEqualByComparingTo(new BigDecimal("90.00"));

            // Recalculate with 5 nights
            bookingExtra.calculateTotalPrice(5);

            // New: 15 * 2 * 5 = 150
            assertThat(bookingExtra.getTotalPrice()).isEqualByComparingTo(new BigDecimal("150.00"));
        }
    }

    @Nested
    @DisplayName("Edge Cases")
    class EdgeCases {

        @Test
        @DisplayName("Should handle zero quantity")
        void shouldHandleZeroQuantity() {
            Booking booking = createBookingWithNights(3);
            Extra extra = createExtra("Test Extra", new BigDecimal("10.00"), false);

            BookingExtra bookingExtra = new BookingExtra();
            bookingExtra.setBooking(booking);
            bookingExtra.setExtra(extra);
            bookingExtra.setQuantity(0);
            bookingExtra.setUnitPrice(extra.getPrice());
            bookingExtra.calculateTotalPrice(booking.getNights());

            assertThat(bookingExtra.getTotalPrice()).isEqualByComparingTo(BigDecimal.ZERO);
        }

        @Test
        @DisplayName("Should handle decimal prices")
        void shouldHandleDecimalPrices() {
            Booking booking = createBookingWithNights(2);
            Extra extra = createExtra("Snack Pack", new BigDecimal("7.99"), false);

            BookingExtra bookingExtra = new BookingExtra(booking, extra, 3);

            // 7.99 * 3 = 23.97
            assertThat(bookingExtra.getTotalPrice()).isEqualByComparingTo(new BigDecimal("23.97"));
        }

        @Test
        @DisplayName("Should handle large quantities")
        void shouldHandleLargeQuantities() {
            Booking booking = createBookingWithNights(7);
            Extra extra = createExtra("Extra Towel", new BigDecimal("5.00"), true);

            BookingExtra bookingExtra = new BookingExtra(booking, extra, 10);

            // 5 * 10 * 7 = 350
            assertThat(bookingExtra.getTotalPrice()).isEqualByComparingTo(new BigDecimal("350.00"));
        }
    }

    private Booking createBookingWithNights(int nights) {
        Booking booking = new Booking();
        booking.setCheckIn(LocalDate.of(2025, 7, 1));
        booking.setCheckOut(LocalDate.of(2025, 7, 1).plusDays(nights));
        return booking;
    }

    private Extra createExtra(String name, BigDecimal price, boolean perNight) {
        Extra extra = new Extra();
        extra.setName(name);
        extra.setPrice(price);
        extra.setPerNight(perNight);
        return extra;
    }
}
