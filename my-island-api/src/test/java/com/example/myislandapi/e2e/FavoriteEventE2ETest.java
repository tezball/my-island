package com.example.myislandapi.e2e;

import com.example.myislandapi.config.AbstractIntegrationTest;
import com.example.myislandapi.config.TestKafkaConsumer;
import com.example.myislandapi.event.FavoriteEvent;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

/**
 * E2E tests for favorite-related Kafka events.
 * Tests that adding/removing favorites publishes appropriate events.
 */
@DisplayName("Favorite Event E2E Tests")
class FavoriteEventE2ETest extends AbstractIntegrationTest {

    @Autowired
    private TestKafkaConsumer testKafkaConsumer;

    @BeforeEach
    void clearEvents() {
        testKafkaConsumer.clear();
    }

    @Test
    @DisplayName("Should publish FAVORITE_ADDED event when user adds a favorite")
    void shouldPublishFavoriteAddedEventOnAddFavorite() {
        // Get a user token
        String token = authenticateNewUser();

        // Get a campsite ID
        UUID campsiteId = given()
            .when()
            .get("/campsites")
        .then()
            .statusCode(200)
            .extract()
            .jsonPath()
            .getUUID("content[0].id");

        // Add to favorites
        given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + token)
        .when()
            .post("/favorites/" + campsiteId)
        .then()
            .statusCode(200);

        // Wait for the FavoriteEvent to be published and consumed
        await()
            .atMost(10, TimeUnit.SECONDS)
            .pollInterval(500, TimeUnit.MILLISECONDS)
            .untilAsserted(() -> {
                var favoriteEvents = testKafkaConsumer.getEventsOfType(FavoriteEvent.class);
                assertThat(favoriteEvents).isNotEmpty();
                assertThat(favoriteEvents).anyMatch(event ->
                    FavoriteEvent.TYPE_ADDED.equals(event.eventType()) &&
                    campsiteId.equals(event.campsiteId())
                );
            });
    }

    @Test
    @DisplayName("Should publish FAVORITE_REMOVED event when user removes a favorite")
    void shouldPublishFavoriteRemovedEventOnRemoveFavorite() {
        // Get a user token
        String token = authenticateNewUser();

        // Get a campsite ID
        UUID campsiteId = given()
            .when()
            .get("/campsites")
        .then()
            .statusCode(200)
            .extract()
            .jsonPath()
            .getUUID("content[0].id");

        // First add to favorites
        given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + token)
        .when()
            .post("/favorites/" + campsiteId)
        .then()
            .statusCode(200);

        // Clear events from adding
        testKafkaConsumer.clear();

        // Remove from favorites
        given()
            .header("Authorization", "Bearer " + token)
        .when()
            .delete("/favorites/" + campsiteId)
        .then()
            .statusCode(204);

        // Wait for the FAVORITE_REMOVED event
        await()
            .atMost(10, TimeUnit.SECONDS)
            .pollInterval(500, TimeUnit.MILLISECONDS)
            .untilAsserted(() -> {
                var favoriteEvents = testKafkaConsumer.getEventsOfType(FavoriteEvent.class);
                assertThat(favoriteEvents).isNotEmpty();
                assertThat(favoriteEvents).anyMatch(event ->
                    FavoriteEvent.TYPE_REMOVED.equals(event.eventType()) &&
                    campsiteId.equals(event.campsiteId())
                );
            });
    }
}
