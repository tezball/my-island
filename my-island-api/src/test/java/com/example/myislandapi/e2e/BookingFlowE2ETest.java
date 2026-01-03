package com.example.myislandapi.e2e;

import com.example.myislandapi.config.AbstractIntegrationTest;
import com.example.myislandapi.fixture.TestDataSeeder.TestSetup;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * E2E tests for the complete booking flow.
 * Tests campsite search, booking creation, confirmation, and cancellation.
 */
@DisplayName("Booking Flow E2E Tests")
class BookingFlowE2ETest extends AbstractIntegrationTest {

    private TestSetup testSetup;
    private String userToken;

    @BeforeEach
    void setUp() {
        testSetup = dataSeeder.createCompleteSetup();
        userToken = authenticateNewUser();
    }

    @Nested
    @DisplayName("Create Booking")
    class CreateBooking {

        @Test
        @DisplayName("Should create booking successfully")
        void shouldCreateBookingSuccessfully() {
            LocalDate checkIn = LocalDate.now().plusDays(7);
            LocalDate checkOut = LocalDate.now().plusDays(10);

            given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", testSetup.lot().getId().toString(),
                    "checkIn", checkIn.toString(),
                    "checkOut", checkOut.toString(),
                    "guests", 2,
                    "specialRequests", "Late arrival around 8pm"
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(201)
                .body("id", notNullValue())
                .body("status", equalTo("PENDING"))
                .body("guests", equalTo(2))
                .body("totalPrice", greaterThan(0f))
                .body("specialRequests", equalTo("Late arrival around 8pm"));
        }

        @Test
        @DisplayName("Should reject booking without authentication")
        void shouldRejectBookingWithoutAuth() {
            LocalDate checkIn = LocalDate.now().plusDays(7);
            LocalDate checkOut = LocalDate.now().plusDays(10);

            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", testSetup.lot().getId().toString(),
                    "checkIn", checkIn.toString(),
                    "checkOut", checkOut.toString(),
                    "guests", 2
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("Should reject booking with invalid lot ID")
        void shouldRejectBookingWithInvalidLotId() {
            LocalDate checkIn = LocalDate.now().plusDays(7);
            LocalDate checkOut = LocalDate.now().plusDays(10);

            given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", UUID.randomUUID().toString(),
                    "checkIn", checkIn.toString(),
                    "checkOut", checkOut.toString(),
                    "guests", 2
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(404);
        }

        @Test
        @DisplayName("Should reject booking with past check-in date")
        void shouldRejectPastCheckInDate() {
            LocalDate pastDate = LocalDate.now().minusDays(1);
            LocalDate checkOut = LocalDate.now().plusDays(3);

            given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", testSetup.lot().getId().toString(),
                    "checkIn", pastDate.toString(),
                    "checkOut", checkOut.toString(),
                    "guests", 2
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(400);
        }

        @Test
        @DisplayName("Should reject booking with zero guests")
        void shouldRejectZeroGuests() {
            LocalDate checkIn = LocalDate.now().plusDays(7);
            LocalDate checkOut = LocalDate.now().plusDays(10);

            given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", testSetup.lot().getId().toString(),
                    "checkIn", checkIn.toString(),
                    "checkOut", checkOut.toString(),
                    "guests", 0
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(400);
        }
    }

    @Nested
    @DisplayName("View Bookings")
    class ViewBookings {

        @Test
        @DisplayName("Should return empty list for new user")
        void shouldReturnEmptyListForNewUser() {
            String newUserToken = authenticateNewUser();

            given()
                .header("Authorization", "Bearer " + newUserToken)
            .when()
                .get("/bookings")
            .then()
                .statusCode(200)
                .body("content", hasSize(0))
                .body("totalElements", equalTo(0));
        }

        @Test
        @DisplayName("Should return user's bookings")
        void shouldReturnUserBookings() {
            // Create a booking first
            LocalDate checkIn = LocalDate.now().plusDays(14);
            LocalDate checkOut = LocalDate.now().plusDays(17);

            given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", testSetup.lot().getId().toString(),
                    "checkIn", checkIn.toString(),
                    "checkOut", checkOut.toString(),
                    "guests", 2
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(201);

            // Then fetch bookings
            given()
                .header("Authorization", "Bearer " + userToken)
            .when()
                .get("/bookings")
            .then()
                .statusCode(200)
                .body("content", hasSize(greaterThanOrEqualTo(1)))
                .body("content[0].status", equalTo("PENDING"));
        }

        @Test
        @DisplayName("Should get booking by ID")
        void shouldGetBookingById() {
            LocalDate checkIn = LocalDate.now().plusDays(21);
            LocalDate checkOut = LocalDate.now().plusDays(24);

            // Create booking
            String bookingId = given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", testSetup.lot().getId().toString(),
                    "checkIn", checkIn.toString(),
                    "checkOut", checkOut.toString(),
                    "guests", 3
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(201)
                .extract()
                .path("id");

            // Get booking by ID
            given()
                .header("Authorization", "Bearer " + userToken)
            .when()
                .get("/bookings/{id}", bookingId)
            .then()
                .statusCode(200)
                .body("id", equalTo(bookingId))
                .body("guests", equalTo(3));
        }

        @Test
        @DisplayName("Should not allow accessing another user's booking")
        void shouldNotAccessOtherUserBooking() {
            LocalDate checkIn = LocalDate.now().plusDays(28);
            LocalDate checkOut = LocalDate.now().plusDays(31);

            // Create booking with first user
            String bookingId = given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", testSetup.lot().getId().toString(),
                    "checkIn", checkIn.toString(),
                    "checkOut", checkOut.toString(),
                    "guests", 2
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(201)
                .extract()
                .path("id");

            // Try to access with different user
            String otherUserToken = authenticateNewUser();

            given()
                .header("Authorization", "Bearer " + otherUserToken)
            .when()
                .get("/bookings/{id}", bookingId)
            .then()
                .statusCode(anyOf(equalTo(403), equalTo(404)));
        }
    }

    @Nested
    @DisplayName("Confirm Booking")
    class ConfirmBooking {

        @Test
        @DisplayName("Should confirm pending booking")
        void shouldConfirmPendingBooking() {
            LocalDate checkIn = LocalDate.now().plusDays(35);
            LocalDate checkOut = LocalDate.now().plusDays(38);

            // Create booking
            String bookingId = given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", testSetup.lot().getId().toString(),
                    "checkIn", checkIn.toString(),
                    "checkOut", checkOut.toString(),
                    "guests", 2
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(201)
                .extract()
                .path("id");

            // Confirm booking
            given()
                .header("Authorization", "Bearer " + userToken)
            .when()
                .post("/bookings/{id}/confirm", bookingId)
            .then()
                .statusCode(200)
                .body("status", equalTo("CONFIRMED"));
        }
    }

    @Nested
    @DisplayName("Cancel Booking")
    class CancelBooking {

        @Test
        @DisplayName("Should cancel booking with reason")
        void shouldCancelBookingWithReason() {
            LocalDate checkIn = LocalDate.now().plusDays(42);
            LocalDate checkOut = LocalDate.now().plusDays(45);

            // Create booking
            String bookingId = given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", testSetup.lot().getId().toString(),
                    "checkIn", checkIn.toString(),
                    "checkOut", checkOut.toString(),
                    "guests", 2
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(201)
                .extract()
                .path("id");

            // Cancel booking
            given()
                .header("Authorization", "Bearer " + userToken)
                .queryParam("reason", "Change of plans")
            .when()
                .post("/bookings/{id}/cancel", bookingId)
            .then()
                .statusCode(200)
                .body("status", equalTo("CANCELLED"));
        }

        @Test
        @DisplayName("Should cancel booking without reason")
        void shouldCancelBookingWithoutReason() {
            LocalDate checkIn = LocalDate.now().plusDays(49);
            LocalDate checkOut = LocalDate.now().plusDays(52);

            // Create booking
            String bookingId = given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", testSetup.lot().getId().toString(),
                    "checkIn", checkIn.toString(),
                    "checkOut", checkOut.toString(),
                    "guests", 2
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(201)
                .extract()
                .path("id");

            // Cancel without reason
            given()
                .header("Authorization", "Bearer " + userToken)
            .when()
                .post("/bookings/{id}/cancel", bookingId)
            .then()
                .statusCode(200)
                .body("status", equalTo("CANCELLED"));
        }
    }

    @Nested
    @DisplayName("Complete Booking Flow")
    class CompleteFlow {

        @Test
        @DisplayName("Should complete full booking lifecycle")
        void shouldCompleteFullBookingLifecycle() {
            LocalDate checkIn = LocalDate.now().plusDays(60);
            LocalDate checkOut = LocalDate.now().plusDays(63);

            // Step 1: Search for campsites (public endpoint)
            given()
            .when()
                .get("/campsites")
            .then()
                .statusCode(200)
                .body("content", notNullValue());

            // Step 2: View campsite details
            given()
            .when()
                .get("/campsites/{id}", testSetup.campsite().getId())
            .then()
                .statusCode(200)
                .body("name", notNullValue())
                .body("lots", notNullValue());

            // Step 3: Create booking
            String bookingId = given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", testSetup.lot().getId().toString(),
                    "checkIn", checkIn.toString(),
                    "checkOut", checkOut.toString(),
                    "guests", 2,
                    "specialRequests", "Quiet spot please"
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(201)
                .body("status", equalTo("PENDING"))
                .extract()
                .path("id");

            // Step 4: View booking details
            given()
                .header("Authorization", "Bearer " + userToken)
            .when()
                .get("/bookings/{id}", bookingId)
            .then()
                .statusCode(200)
                .body("id", equalTo(bookingId))
                .body("specialRequests", equalTo("Quiet spot please"));

            // Step 5: Confirm booking
            given()
                .header("Authorization", "Bearer " + userToken)
            .when()
                .post("/bookings/{id}/confirm", bookingId)
            .then()
                .statusCode(200)
                .body("status", equalTo("CONFIRMED"));

            // Step 6: View confirmed booking in list
            given()
                .header("Authorization", "Bearer " + userToken)
                .queryParam("status", "CONFIRMED")
            .when()
                .get("/bookings")
            .then()
                .statusCode(200)
                .body("content.find { it.id == '" + bookingId + "' }.status", equalTo("CONFIRMED"));
        }
    }
}
