package com.example.myislandapi.e2e;

import com.example.myislandapi.config.AbstractIntegrationTest;
import com.example.myislandapi.config.TestKafkaConsumer;
import com.example.myislandapi.event.ReviewEvent;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

/**
 * E2E tests for review-related Kafka events.
 * Tests that review actions publish appropriate events.
 */
@DisplayName("Review Event E2E Tests")
class ReviewEventE2ETest extends AbstractIntegrationTest {

    @Autowired
    private TestKafkaConsumer testKafkaConsumer;

    @BeforeEach
    void clearEvents() {
        testKafkaConsumer.clear();
    }

    @Test
    @DisplayName("Should publish REVIEW_CREATED event when user creates a review")
    void shouldPublishReviewCreatedEventOnReviewCreation() {
        // Create an owner and their campsite
        String ownerToken = authenticateAsOwner();

        // Create a campsite for the owner
        String campsiteIdStr = given()
            .header("Authorization", "Bearer " + ownerToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "name", "Test Campsite for Review " + System.currentTimeMillis(),
                "description", "A test campsite for review event testing",
                "location", Map.of(
                    "address", "123 Test Road",
                    "county", "Kerry",
                    "lat", 52.0598,
                    "lng", -9.5079
                ),
                "facilities", Set.of("WIFI", "SHOWER")
            ))
        .when()
            .post("/campsites")
        .then()
            .statusCode(201)
            .extract()
            .jsonPath()
            .getString("id");

        UUID campsiteId = UUID.fromString(campsiteIdStr);

        // Create a lot for the campsite
        String lotIdStr = given()
            .header("Authorization", "Bearer " + ownerToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "campsiteId", campsiteId.toString(),
                "name", "Test Lot",
                "type", "GLAMPING",
                "pricePerNight", 100.00,
                "capacity", 4,
                "available", true
            ))
        .when()
            .post("/lots")
        .then()
            .statusCode(201)
            .extract()
            .jsonPath()
            .getString("id");

        UUID lotId = UUID.fromString(lotIdStr);

        // Create a new user who will make the booking and review
        String userToken = authenticateNewUser();

        // Create a booking with dates in the future
        var bookingResponse = given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + userToken)
            .body(Map.of(
                "lotId", lotId.toString(),
                "checkIn", "2026-06-01",
                "checkOut", "2026-06-03",
                "guests", 2
            ))
        .when()
            .post("/bookings")
        .then()
            .statusCode(201)
            .extract();

        UUID bookingId = bookingResponse.jsonPath().getUUID("id");

        // Owner confirms the booking
        given()
            .header("Authorization", "Bearer " + ownerToken)
        .when()
            .post("/owner/bookings/" + bookingId + "/confirm")
        .then()
            .statusCode(200);

        // Owner completes the booking (simulating checkout)
        given()
            .header("Authorization", "Bearer " + ownerToken)
        .when()
            .post("/owner/bookings/" + bookingId + "/complete")
        .then()
            .statusCode(200);

        // Clear events before the review
        testKafkaConsumer.clear();

        // Create a review for the completed booking
        var reviewResponse = given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + userToken)
            .body(Map.of(
                "bookingId", bookingId.toString(),
                "rating", 5,
                "comment", "Amazing glamping experience! Highly recommended."
            ))
        .when()
            .post("/reviews")
        .then()
            .statusCode(201)
            .extract();

        UUID reviewId = reviewResponse.jsonPath().getUUID("id");

        // Wait for the ReviewEvent to be published and consumed
        await()
            .atMost(10, TimeUnit.SECONDS)
            .pollInterval(500, TimeUnit.MILLISECONDS)
            .untilAsserted(() -> {
                var reviewEvents = testKafkaConsumer.getEventsOfType(ReviewEvent.class);
                assertThat(reviewEvents).isNotEmpty();
                assertThat(reviewEvents).anyMatch(event ->
                    ReviewEvent.TYPE_CREATED.equals(event.eventType()) &&
                    reviewId.equals(event.reviewId()) &&
                    campsiteId.equals(event.campsiteId()) &&
                    event.rating() == 5
                );
            });
    }
}
