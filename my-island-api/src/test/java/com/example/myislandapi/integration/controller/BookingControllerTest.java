package com.example.myislandapi.integration.controller;

import com.example.myislandapi.config.AbstractIntegrationTest;
import com.example.myislandapi.fixture.TestDataSeeder.TestSetup;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Integration tests for BookingController.
 * Tests all booking endpoints with real database.
 */
@DisplayName("BookingController Integration Tests")
class BookingControllerTest extends AbstractIntegrationTest {

    private TestSetup testSetup;
    private String userToken;

    @BeforeEach
    void setUp() {
        testSetup = dataSeeder.createCompleteSetup();
        userToken = authenticateNewUser();
    }

    @Test
    @DisplayName("POST /api/bookings - should return 201 with booking")
    void createBooking_withValidData_returns201() {
        LocalDate checkIn = LocalDate.now().plusDays(7);
        LocalDate checkOut = LocalDate.now().plusDays(10);

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
            .statusCode(201)
            .body("id", notNullValue())
            .body("status", equalTo("PENDING"))
            .body("guests", equalTo(2))
            .body("totalPrice", greaterThan(0f));
    }

    @Test
    @DisplayName("POST /api/bookings - should return 401 without authentication")
    void createBooking_withoutAuth_returns401() {
        given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "lotId", testSetup.lot().getId().toString(),
                "checkIn", LocalDate.now().plusDays(7).toString(),
                "checkOut", LocalDate.now().plusDays(10).toString(),
                "guests", 2
            ))
        .when()
            .post("/bookings")
        .then()
            .statusCode(401);
    }

    @Test
    @DisplayName("POST /api/bookings - should return 404 for non-existent lot")
    void createBooking_withInvalidLot_returns404() {
        given()
            .header("Authorization", "Bearer " + userToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "lotId", UUID.randomUUID().toString(),
                "checkIn", LocalDate.now().plusDays(7).toString(),
                "checkOut", LocalDate.now().plusDays(10).toString(),
                "guests", 2
            ))
        .when()
            .post("/bookings")
        .then()
            .statusCode(404);
    }

    @Test
    @DisplayName("POST /api/bookings - should return 400 for past dates")
    void createBooking_withPastDates_returns400() {
        given()
            .header("Authorization", "Bearer " + userToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "lotId", testSetup.lot().getId().toString(),
                "checkIn", LocalDate.now().minusDays(1).toString(),
                "checkOut", LocalDate.now().plusDays(2).toString(),
                "guests", 2
            ))
        .when()
            .post("/bookings")
        .then()
            .statusCode(400);
    }

    @Test
    @DisplayName("GET /api/bookings - should return 200 with user bookings")
    void getBookings_withAuth_returns200() {
        given()
            .header("Authorization", "Bearer " + userToken)
        .when()
            .get("/bookings")
        .then()
            .statusCode(200)
            .body("content", notNullValue())
            .body("totalElements", greaterThanOrEqualTo(0));
    }

    @Test
    @DisplayName("GET /api/bookings - should return 401 without authentication")
    void getBookings_withoutAuth_returns401() {
        given()
        .when()
            .get("/bookings")
        .then()
            .statusCode(401);
    }

    @Test
    @DisplayName("GET /api/bookings/{id} - should return 200 with booking")
    void getBooking_withValidId_returns200() {
        LocalDate checkIn = LocalDate.now().plusDays(14);
        LocalDate checkOut = LocalDate.now().plusDays(17);

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
    @DisplayName("GET /api/bookings/{id} - should return 404 for non-existent booking")
    void getBooking_withInvalidId_returns404() {
        given()
            .header("Authorization", "Bearer " + userToken)
        .when()
            .get("/bookings/{id}", UUID.randomUUID().toString())
        .then()
            .statusCode(404);
    }

    @Test
    @DisplayName("POST /api/bookings/{id}/confirm - should return 200 with confirmed booking")
    void confirmBooking_withValidId_returns200() {
        LocalDate checkIn = LocalDate.now().plusDays(21);
        LocalDate checkOut = LocalDate.now().plusDays(24);

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

        given()
            .header("Authorization", "Bearer " + userToken)
        .when()
            .post("/bookings/{id}/confirm", bookingId)
        .then()
            .statusCode(200)
            .body("status", equalTo("CONFIRMED"));
    }

    @Test
    @DisplayName("POST /api/bookings/{id}/cancel - should return 200 with cancelled booking")
    void cancelBooking_withValidId_returns200() {
        LocalDate checkIn = LocalDate.now().plusDays(28);
        LocalDate checkOut = LocalDate.now().plusDays(31);

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

        given()
            .header("Authorization", "Bearer " + userToken)
            .queryParam("reason", "Changed my plans")
        .when()
            .post("/bookings/{id}/cancel", bookingId)
        .then()
            .statusCode(200)
            .body("status", equalTo("CANCELLED"));
    }

    @Test
    @DisplayName("GET /api/bookings - should filter by status")
    void getBookings_withStatusFilter_returns200() {
        given()
            .header("Authorization", "Bearer " + userToken)
            .queryParam("status", "PENDING")
        .when()
            .get("/bookings")
        .then()
            .statusCode(200)
            .body("content", notNullValue());
    }
}
