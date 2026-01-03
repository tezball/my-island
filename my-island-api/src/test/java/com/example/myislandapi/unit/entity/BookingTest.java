package com.example.myislandapi.unit.entity;

import com.example.myislandapi.entity.Booking;
import com.example.myislandapi.entity.BookingExtra;
import com.example.myislandapi.entity.Extra;
import com.example.myislandapi.enums.BookingStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for Booking entity logic.
 */
@DisplayName("Booking Entity Unit Tests")
class BookingTest {

    @Nested
    @DisplayName("getNights()")
    class GetNights {

        @Test
        @DisplayName("Should calculate 1 night for consecutive days")
        void shouldCalculateOneNight() {
            Booking booking = new Booking();
            booking.setCheckIn(LocalDate.of(2025, 7, 1));
            booking.setCheckOut(LocalDate.of(2025, 7, 2));

            assertThat(booking.getNights()).isEqualTo(1);
        }

        @Test
        @DisplayName("Should calculate 3 nights for 4-day span")
        void shouldCalculateThreeNights() {
            Booking booking = new Booking();
            booking.setCheckIn(LocalDate.of(2025, 7, 1));
            booking.setCheckOut(LocalDate.of(2025, 7, 4));

            assertThat(booking.getNights()).isEqualTo(3);
        }

        @Test
        @DisplayName("Should calculate nights across month boundary")
        void shouldCalculateNightsAcrossMonthBoundary() {
            Booking booking = new Booking();
            booking.setCheckIn(LocalDate.of(2025, 6, 29));
            booking.setCheckOut(LocalDate.of(2025, 7, 3));

            assertThat(booking.getNights()).isEqualTo(4);
        }

        @Test
        @DisplayName("Should calculate 7 nights for week-long stay")
        void shouldCalculateSevenNights() {
            Booking booking = new Booking();
            booking.setCheckIn(LocalDate.of(2025, 8, 1));
            booking.setCheckOut(LocalDate.of(2025, 8, 8));

            assertThat(booking.getNights()).isEqualTo(7);
        }

        @Test
        @DisplayName("Should return 0 for same day check-in and check-out")
        void shouldReturnZeroForSameDay() {
            Booking booking = new Booking();
            booking.setCheckIn(LocalDate.of(2025, 7, 15));
            booking.setCheckOut(LocalDate.of(2025, 7, 15));

            assertThat(booking.getNights()).isEqualTo(0);
        }
    }

    @Nested
    @DisplayName("Default Status")
    class DefaultStatus {

        @Test
        @DisplayName("Should have PENDING as default status")
        void shouldHavePendingAsDefaultStatus() {
            Booking booking = new Booking();

            assertThat(booking.getStatus()).isEqualTo(BookingStatus.PENDING);
        }
    }

    @Nested
    @DisplayName("Default Values")
    class DefaultValues {

        @Test
        @DisplayName("Should have zero as default extras price")
        void shouldHaveZeroAsDefaultExtrasPrice() {
            Booking booking = new Booking();

            assertThat(booking.getExtrasPrice()).isEqualByComparingTo(BigDecimal.ZERO);
        }

        @Test
        @DisplayName("Should have zero as default service fee")
        void shouldHaveZeroAsDefaultServiceFee() {
            Booking booking = new Booking();

            assertThat(booking.getServiceFee()).isEqualByComparingTo(BigDecimal.ZERO);
        }

        @Test
        @DisplayName("Should have empty booking extras list")
        void shouldHaveEmptyBookingExtrasList() {
            Booking booking = new Booking();

            assertThat(booking.getBookingExtras()).isEmpty();
        }
    }

    @Nested
    @DisplayName("addExtra()")
    class AddExtra {

        @Test
        @DisplayName("Should add extra and set booking reference")
        void shouldAddExtraAndSetBookingReference() {
            Booking booking = new Booking();
            Extra extra = new Extra();
            extra.setName("Breakfast");
            extra.setPrice(new BigDecimal("15.00"));

            BookingExtra bookingExtra = new BookingExtra();
            bookingExtra.setExtra(extra);
            bookingExtra.setQuantity(2);

            booking.addExtra(bookingExtra);

            assertThat(booking.getBookingExtras()).hasSize(1);
            assertThat(booking.getBookingExtras().get(0).getBooking()).isSameAs(booking);
        }

        @Test
        @DisplayName("Should add multiple extras")
        void shouldAddMultipleExtras() {
            Booking booking = new Booking();
            booking.setCheckIn(LocalDate.of(2025, 7, 1));
            booking.setCheckOut(LocalDate.of(2025, 7, 4));

            Extra breakfast = new Extra();
            breakfast.setName("Breakfast");
            breakfast.setPrice(new BigDecimal("15.00"));

            Extra firewood = new Extra();
            firewood.setName("Firewood");
            firewood.setPrice(new BigDecimal("10.00"));

            booking.addExtra(new BookingExtra(booking, breakfast, 2));
            booking.addExtra(new BookingExtra(booking, firewood, 1));

            assertThat(booking.getBookingExtras()).hasSize(2);
        }
    }

    @Nested
    @DisplayName("removeExtra()")
    class RemoveExtra {

        @Test
        @DisplayName("Should remove extra and clear booking reference")
        void shouldRemoveExtraAndClearBookingReference() {
            Booking booking = new Booking();
            booking.setCheckIn(LocalDate.of(2025, 7, 1));
            booking.setCheckOut(LocalDate.of(2025, 7, 4));

            Extra extra = new Extra();
            extra.setName("Breakfast");
            extra.setPrice(new BigDecimal("15.00"));

            BookingExtra bookingExtra = new BookingExtra(booking, extra, 2);
            booking.addExtra(bookingExtra);

            booking.removeExtra(bookingExtra);

            assertThat(booking.getBookingExtras()).isEmpty();
            assertThat(bookingExtra.getBooking()).isNull();
        }
    }
}
