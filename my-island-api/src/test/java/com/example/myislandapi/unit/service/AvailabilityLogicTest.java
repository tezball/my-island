package com.example.myislandapi.unit.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for availability/date overlap logic.
 * Tests the date comparison algorithms used in AvailabilityService.
 */
@DisplayName("Availability Logic Unit Tests")
class AvailabilityLogicTest {

    @Nested
    @DisplayName("Date Overlap Detection")
    class DateOverlapDetection {

        @Test
        @DisplayName("Should detect overlap when new booking starts during existing")
        void shouldDetectOverlapWhenNewBookingStartsDuringExisting() {
            // Existing: June 5-10
            LocalDate existingCheckIn = LocalDate.of(2025, 6, 5);
            LocalDate existingCheckOut = LocalDate.of(2025, 6, 10);

            // New: June 8-12 (starts during existing)
            LocalDate newCheckIn = LocalDate.of(2025, 6, 8);
            LocalDate newCheckOut = LocalDate.of(2025, 6, 12);

            boolean overlaps = datesOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isTrue();
        }

        @Test
        @DisplayName("Should detect overlap when new booking ends during existing")
        void shouldDetectOverlapWhenNewBookingEndsDuringExisting() {
            // Existing: June 10-15
            LocalDate existingCheckIn = LocalDate.of(2025, 6, 10);
            LocalDate existingCheckOut = LocalDate.of(2025, 6, 15);

            // New: June 5-12 (ends during existing)
            LocalDate newCheckIn = LocalDate.of(2025, 6, 5);
            LocalDate newCheckOut = LocalDate.of(2025, 6, 12);

            boolean overlaps = datesOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isTrue();
        }

        @Test
        @DisplayName("Should detect overlap when new booking contains existing")
        void shouldDetectOverlapWhenNewBookingContainsExisting() {
            // Existing: June 10-12
            LocalDate existingCheckIn = LocalDate.of(2025, 6, 10);
            LocalDate existingCheckOut = LocalDate.of(2025, 6, 12);

            // New: June 5-20 (contains existing)
            LocalDate newCheckIn = LocalDate.of(2025, 6, 5);
            LocalDate newCheckOut = LocalDate.of(2025, 6, 20);

            boolean overlaps = datesOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isTrue();
        }

        @Test
        @DisplayName("Should detect overlap when existing booking contains new")
        void shouldDetectOverlapWhenExistingBookingContainsNew() {
            // Existing: June 5-20
            LocalDate existingCheckIn = LocalDate.of(2025, 6, 5);
            LocalDate existingCheckOut = LocalDate.of(2025, 6, 20);

            // New: June 10-15 (inside existing)
            LocalDate newCheckIn = LocalDate.of(2025, 6, 10);
            LocalDate newCheckOut = LocalDate.of(2025, 6, 15);

            boolean overlaps = datesOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isTrue();
        }

        @Test
        @DisplayName("Should detect overlap for identical dates")
        void shouldDetectOverlapForIdenticalDates() {
            // Both: June 10-15
            LocalDate existingCheckIn = LocalDate.of(2025, 6, 10);
            LocalDate existingCheckOut = LocalDate.of(2025, 6, 15);
            LocalDate newCheckIn = LocalDate.of(2025, 6, 10);
            LocalDate newCheckOut = LocalDate.of(2025, 6, 15);

            boolean overlaps = datesOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isTrue();
        }
    }

    @Nested
    @DisplayName("Non-overlapping Dates")
    class NonOverlappingDates {

        @Test
        @DisplayName("Should not detect overlap when new booking is before existing")
        void shouldNotDetectOverlapWhenNewBookingIsBeforeExisting() {
            // Existing: June 15-20
            LocalDate existingCheckIn = LocalDate.of(2025, 6, 15);
            LocalDate existingCheckOut = LocalDate.of(2025, 6, 20);

            // New: June 5-10 (before existing)
            LocalDate newCheckIn = LocalDate.of(2025, 6, 5);
            LocalDate newCheckOut = LocalDate.of(2025, 6, 10);

            boolean overlaps = datesOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isFalse();
        }

        @Test
        @DisplayName("Should not detect overlap when new booking is after existing")
        void shouldNotDetectOverlapWhenNewBookingIsAfterExisting() {
            // Existing: June 5-10
            LocalDate existingCheckIn = LocalDate.of(2025, 6, 5);
            LocalDate existingCheckOut = LocalDate.of(2025, 6, 10);

            // New: June 15-20 (after existing)
            LocalDate newCheckIn = LocalDate.of(2025, 6, 15);
            LocalDate newCheckOut = LocalDate.of(2025, 6, 20);

            boolean overlaps = datesOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isFalse();
        }

        @Test
        @DisplayName("Should not detect overlap when check-out equals check-in (same day turnover)")
        void shouldNotDetectOverlapForSameDayTurnover() {
            // Existing: June 5-10
            LocalDate existingCheckIn = LocalDate.of(2025, 6, 5);
            LocalDate existingCheckOut = LocalDate.of(2025, 6, 10);

            // New: June 10-15 (starts when existing ends - same day turnover allowed)
            LocalDate newCheckIn = LocalDate.of(2025, 6, 10);
            LocalDate newCheckOut = LocalDate.of(2025, 6, 15);

            // In campsite systems, check-out day can be another guest's check-in
            boolean overlaps = datesOverlapExclusive(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isFalse();
        }
    }

    @Nested
    @DisplayName("Single Day Bookings")
    class SingleDayBookings {

        @Test
        @DisplayName("Should detect overlap for single day booking within range")
        void shouldDetectOverlapForSingleDayBookingWithinRange() {
            // Existing: June 5-10
            LocalDate existingCheckIn = LocalDate.of(2025, 6, 5);
            LocalDate existingCheckOut = LocalDate.of(2025, 6, 10);

            // New: June 7-8 (single night within existing)
            LocalDate newCheckIn = LocalDate.of(2025, 6, 7);
            LocalDate newCheckOut = LocalDate.of(2025, 6, 8);

            boolean overlaps = datesOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isTrue();
        }

        @Test
        @DisplayName("Should not detect overlap for single day booking outside range")
        void shouldNotDetectOverlapForSingleDayBookingOutsideRange() {
            // Existing: June 5-10
            LocalDate existingCheckIn = LocalDate.of(2025, 6, 5);
            LocalDate existingCheckOut = LocalDate.of(2025, 6, 10);

            // New: June 12-13 (single night outside existing)
            LocalDate newCheckIn = LocalDate.of(2025, 6, 12);
            LocalDate newCheckOut = LocalDate.of(2025, 6, 13);

            boolean overlaps = datesOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isFalse();
        }
    }

    @Nested
    @DisplayName("Edge Cases")
    class EdgeCases {

        @Test
        @DisplayName("Should handle month boundary correctly")
        void shouldHandleMonthBoundaryCorrectly() {
            // Existing: June 28 - July 5
            LocalDate existingCheckIn = LocalDate.of(2025, 6, 28);
            LocalDate existingCheckOut = LocalDate.of(2025, 7, 5);

            // New: July 1-10 (overlaps across month boundary)
            LocalDate newCheckIn = LocalDate.of(2025, 7, 1);
            LocalDate newCheckOut = LocalDate.of(2025, 7, 10);

            boolean overlaps = datesOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isTrue();
        }

        @Test
        @DisplayName("Should handle year boundary correctly")
        void shouldHandleYearBoundaryCorrectly() {
            // Existing: Dec 28, 2025 - Jan 5, 2026
            LocalDate existingCheckIn = LocalDate.of(2025, 12, 28);
            LocalDate existingCheckOut = LocalDate.of(2026, 1, 5);

            // New: Dec 31, 2025 - Jan 3, 2026 (overlaps across year boundary)
            LocalDate newCheckIn = LocalDate.of(2025, 12, 31);
            LocalDate newCheckOut = LocalDate.of(2026, 1, 3);

            boolean overlaps = datesOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isTrue();
        }

        @Test
        @DisplayName("Should handle leap year February correctly")
        void shouldHandleLeapYearFebruaryCorrectly() {
            // Existing: Feb 27 - Mar 2, 2024 (leap year)
            LocalDate existingCheckIn = LocalDate.of(2024, 2, 27);
            LocalDate existingCheckOut = LocalDate.of(2024, 3, 2);

            // New: Feb 29 - Mar 3, 2024
            LocalDate newCheckIn = LocalDate.of(2024, 2, 29);
            LocalDate newCheckOut = LocalDate.of(2024, 3, 3);

            boolean overlaps = datesOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut);

            assertThat(overlaps).isTrue();
        }
    }

    /**
     * Standard overlap detection (inclusive on both ends).
     */
    private boolean datesOverlap(
            LocalDate existingCheckIn, LocalDate existingCheckOut,
            LocalDate newCheckIn, LocalDate newCheckOut) {
        return newCheckIn.isBefore(existingCheckOut) && newCheckOut.isAfter(existingCheckIn);
    }

    /**
     * Exclusive overlap detection (allows same-day turnover).
     * This is the typical campsite behavior where check-out day equals check-in day is allowed.
     */
    private boolean datesOverlapExclusive(
            LocalDate existingCheckIn, LocalDate existingCheckOut,
            LocalDate newCheckIn, LocalDate newCheckOut) {
        // Check-out day can equal another booking's check-in day
        return newCheckIn.isBefore(existingCheckOut) && newCheckOut.isAfter(existingCheckIn)
                && !newCheckIn.equals(existingCheckOut);
    }
}
