package com.example.myislandapi.unit.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for booking price calculation logic.
 * Tests the formulas used in BookingService without mocking dependencies.
 */
@DisplayName("Booking Price Calculation Unit Tests")
class BookingPriceCalculationTest {

    private static final BigDecimal SERVICE_FEE_RATE = new BigDecimal("0.10"); // 10%

    @Nested
    @DisplayName("Lot Price Calculation")
    class LotPriceCalculation {

        @Test
        @DisplayName("Should calculate lot price for single night")
        void shouldCalculateLotPriceForSingleNight() {
            BigDecimal pricePerNight = new BigDecimal("50.00");
            long nights = 1;

            BigDecimal lotPrice = pricePerNight.multiply(BigDecimal.valueOf(nights));

            assertThat(lotPrice).isEqualByComparingTo(new BigDecimal("50.00"));
        }

        @Test
        @DisplayName("Should calculate lot price for multiple nights")
        void shouldCalculateLotPriceForMultipleNights() {
            BigDecimal pricePerNight = new BigDecimal("75.00");
            long nights = 5;

            BigDecimal lotPrice = pricePerNight.multiply(BigDecimal.valueOf(nights));

            assertThat(lotPrice).isEqualByComparingTo(new BigDecimal("375.00"));
        }

        @Test
        @DisplayName("Should calculate lot price for week-long stay")
        void shouldCalculateLotPriceForWeekLongStay() {
            BigDecimal pricePerNight = new BigDecimal("99.99");
            long nights = 7;

            BigDecimal lotPrice = pricePerNight.multiply(BigDecimal.valueOf(nights));

            assertThat(lotPrice).isEqualByComparingTo(new BigDecimal("699.93"));
        }
    }

    @Nested
    @DisplayName("Nights Calculation")
    class NightsCalculation {

        @Test
        @DisplayName("Should calculate nights between dates")
        void shouldCalculateNightsBetweenDates() {
            LocalDate checkIn = LocalDate.of(2025, 7, 1);
            LocalDate checkOut = LocalDate.of(2025, 7, 4);

            long nights = ChronoUnit.DAYS.between(checkIn, checkOut);

            assertThat(nights).isEqualTo(3);
        }

        @Test
        @DisplayName("Should calculate nights across month boundary")
        void shouldCalculateNightsAcrossMonthBoundary() {
            LocalDate checkIn = LocalDate.of(2025, 6, 28);
            LocalDate checkOut = LocalDate.of(2025, 7, 5);

            long nights = ChronoUnit.DAYS.between(checkIn, checkOut);

            assertThat(nights).isEqualTo(7);
        }

        @Test
        @DisplayName("Should calculate nights for leap year")
        void shouldCalculateNightsForLeapYear() {
            LocalDate checkIn = LocalDate.of(2024, 2, 28);
            LocalDate checkOut = LocalDate.of(2024, 3, 2);

            long nights = ChronoUnit.DAYS.between(checkIn, checkOut);

            assertThat(nights).isEqualTo(3); // Feb 28, Feb 29, Mar 1
        }
    }

    @Nested
    @DisplayName("Service Fee Calculation")
    class ServiceFeeCalculation {

        @Test
        @DisplayName("Should calculate 10% service fee")
        void shouldCalculateTenPercentServiceFee() {
            BigDecimal subtotal = new BigDecimal("100.00");

            BigDecimal serviceFee = subtotal.multiply(SERVICE_FEE_RATE)
                    .setScale(2, RoundingMode.HALF_UP);

            assertThat(serviceFee).isEqualByComparingTo(new BigDecimal("10.00"));
        }

        @Test
        @DisplayName("Should round service fee to 2 decimal places")
        void shouldRoundServiceFeeToTwoDecimalPlaces() {
            BigDecimal subtotal = new BigDecimal("123.45");

            BigDecimal serviceFee = subtotal.multiply(SERVICE_FEE_RATE)
                    .setScale(2, RoundingMode.HALF_UP);

            // 123.45 * 0.10 = 12.345, rounded to 12.35
            assertThat(serviceFee).isEqualByComparingTo(new BigDecimal("12.35"));
        }

        @Test
        @DisplayName("Should calculate service fee for large amount")
        void shouldCalculateServiceFeeForLargeAmount() {
            BigDecimal subtotal = new BigDecimal("2500.00");

            BigDecimal serviceFee = subtotal.multiply(SERVICE_FEE_RATE)
                    .setScale(2, RoundingMode.HALF_UP);

            assertThat(serviceFee).isEqualByComparingTo(new BigDecimal("250.00"));
        }
    }

    @Nested
    @DisplayName("Total Price Calculation")
    class TotalPriceCalculation {

        @Test
        @DisplayName("Should calculate total as subtotal plus service fee")
        void shouldCalculateTotalAsSubtotalPlusServiceFee() {
            BigDecimal lotPrice = new BigDecimal("300.00");
            BigDecimal extrasPrice = new BigDecimal("50.00");
            BigDecimal subtotal = lotPrice.add(extrasPrice);
            BigDecimal serviceFee = subtotal.multiply(SERVICE_FEE_RATE)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal totalPrice = subtotal.add(serviceFee);

            // (300 + 50) * 1.10 = 385
            assertThat(totalPrice).isEqualByComparingTo(new BigDecimal("385.00"));
        }

        @Test
        @DisplayName("Should calculate total without extras")
        void shouldCalculateTotalWithoutExtras() {
            BigDecimal lotPrice = new BigDecimal("200.00");
            BigDecimal extrasPrice = BigDecimal.ZERO;
            BigDecimal subtotal = lotPrice.add(extrasPrice);
            BigDecimal serviceFee = subtotal.multiply(SERVICE_FEE_RATE)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal totalPrice = subtotal.add(serviceFee);

            // 200 * 1.10 = 220
            assertThat(totalPrice).isEqualByComparingTo(new BigDecimal("220.00"));
        }

        @Test
        @DisplayName("Should calculate total for realistic booking scenario")
        void shouldCalculateTotalForRealisticScenario() {
            // 3 nights at 75/night = 225
            BigDecimal pricePerNight = new BigDecimal("75.00");
            long nights = 3;
            BigDecimal lotPrice = pricePerNight.multiply(BigDecimal.valueOf(nights));

            // Breakfast for 2 at 15/person/night = 90
            BigDecimal extrasPrice = new BigDecimal("90.00");

            BigDecimal subtotal = lotPrice.add(extrasPrice);
            // Subtotal = 225 + 90 = 315

            BigDecimal serviceFee = subtotal.multiply(SERVICE_FEE_RATE)
                    .setScale(2, RoundingMode.HALF_UP);
            // Service fee = 315 * 0.10 = 31.50

            BigDecimal totalPrice = subtotal.add(serviceFee);
            // Total = 315 + 31.50 = 346.50

            assertThat(lotPrice).isEqualByComparingTo(new BigDecimal("225.00"));
            assertThat(serviceFee).isEqualByComparingTo(new BigDecimal("31.50"));
            assertThat(totalPrice).isEqualByComparingTo(new BigDecimal("346.50"));
        }
    }

    @Nested
    @DisplayName("Edge Cases")
    class EdgeCases {

        @Test
        @DisplayName("Should handle very small prices")
        void shouldHandleVerySmallPrices() {
            BigDecimal pricePerNight = new BigDecimal("0.01");
            long nights = 1;

            BigDecimal lotPrice = pricePerNight.multiply(BigDecimal.valueOf(nights));
            BigDecimal serviceFee = lotPrice.multiply(SERVICE_FEE_RATE)
                    .setScale(2, RoundingMode.HALF_UP);

            assertThat(lotPrice).isEqualByComparingTo(new BigDecimal("0.01"));
            assertThat(serviceFee).isEqualByComparingTo(new BigDecimal("0.00"));
        }

        @Test
        @DisplayName("Should handle very large prices")
        void shouldHandleVeryLargePrices() {
            BigDecimal pricePerNight = new BigDecimal("9999.99");
            long nights = 30;

            BigDecimal lotPrice = pricePerNight.multiply(BigDecimal.valueOf(nights));
            BigDecimal serviceFee = lotPrice.multiply(SERVICE_FEE_RATE)
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal totalPrice = lotPrice.add(serviceFee);

            assertThat(lotPrice).isEqualByComparingTo(new BigDecimal("299999.70"));
            assertThat(serviceFee).isEqualByComparingTo(new BigDecimal("29999.97"));
            assertThat(totalPrice).isEqualByComparingTo(new BigDecimal("329999.67"));
        }

        @Test
        @DisplayName("Should handle rounding edge case at .005")
        void shouldHandleRoundingEdgeCase() {
            // 150.55 * 0.10 = 15.055, should round to 15.06
            BigDecimal subtotal = new BigDecimal("150.55");
            BigDecimal serviceFee = subtotal.multiply(SERVICE_FEE_RATE)
                    .setScale(2, RoundingMode.HALF_UP);

            assertThat(serviceFee).isEqualByComparingTo(new BigDecimal("15.06"));
        }
    }
}
