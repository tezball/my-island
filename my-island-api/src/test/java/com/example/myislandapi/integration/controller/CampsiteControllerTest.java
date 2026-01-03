package com.example.myislandapi.integration.controller;

import com.example.myislandapi.config.AbstractIntegrationTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Integration tests for CampsiteController.
 * Tests all campsite endpoints with real database.
 */
@DisplayName("CampsiteController Integration Tests")
class CampsiteControllerTest extends AbstractIntegrationTest {

    private String ownerToken;
    private String userToken;

    @BeforeEach
    void setUp() {
        ownerToken = dataSeeder.createOwnerAndGetToken();
        userToken = authenticateNewUser();
    }

    @Test
    @DisplayName("GET /api/campsites - should return 200 with campsites")
    void getCampsites_returns200() {
        given()
        .when()
            .get("/campsites")
        .then()
            .statusCode(200)
            .body("content", notNullValue())
            .body("totalElements", greaterThanOrEqualTo(0));
    }

    @Test
    @DisplayName("GET /api/campsites - should support pagination")
    void getCampsites_withPagination_returns200() {
        given()
            .queryParam("page", 0)
            .queryParam("size", 5)
        .when()
            .get("/campsites")
        .then()
            .statusCode(200)
            .body("size", equalTo(5))
            .body("number", equalTo(0));
    }

    @Test
    @DisplayName("GET /api/campsites - should filter by county")
    void getCampsites_withCountyFilter_returns200() {
        given()
            .queryParam("county", "Dublin")
        .when()
            .get("/campsites")
        .then()
            .statusCode(200);
    }

    @Test
    @DisplayName("GET /api/campsites - should filter by search term")
    void getCampsites_withSearchTerm_returns200() {
        given()
            .queryParam("search", "camping")
        .when()
            .get("/campsites")
        .then()
            .statusCode(200);
    }

    @Test
    @DisplayName("GET /api/campsites/featured - should return 200")
    void getFeaturedCampsites_returns200() {
        given()
        .when()
            .get("/campsites/featured")
        .then()
            .statusCode(200)
            .body("content", notNullValue());
    }

    @Test
    @DisplayName("GET /api/campsites/map - should return 200 with campsites in bounding box")
    void getCampsitesForMap_returns200() {
        given()
            .queryParam("minLat", 51.0)
            .queryParam("maxLat", 55.0)
            .queryParam("minLng", -11.0)
            .queryParam("maxLng", -5.0)
        .when()
            .get("/campsites/map")
        .then()
            .statusCode(200);
    }

    @Test
    @DisplayName("GET /api/campsites/{id} - should return 200 with campsite details")
    void getCampsite_withValidId_returns200() {
        // Create a campsite first
        String campsiteId = given()
            .header("Authorization", "Bearer " + ownerToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "name", "Test Campsite " + System.currentTimeMillis(),
                "description", "A test campsite",
                "location", Map.of(
                    "address", "Test Address",
                    "county", "Cork",
                    "lat", 51.8969,
                    "lng", -8.4863
                )
            ))
        .when()
            .post("/campsites")
        .then()
            .statusCode(201)
            .extract()
            .path("id");

        given()
        .when()
            .get("/campsites/{id}", campsiteId)
        .then()
            .statusCode(200)
            .body("id", equalTo(campsiteId))
            .body("name", containsString("Test Campsite"));
    }

    @Test
    @DisplayName("GET /api/campsites/{id} - should return 404 for non-existent campsite")
    void getCampsite_withInvalidId_returns404() {
        given()
        .when()
            .get("/campsites/{id}", UUID.randomUUID().toString())
        .then()
            .statusCode(404);
    }

    @Test
    @DisplayName("GET /api/campsites/{id}/lots - should return 200 with lots")
    void getCampsiteLots_returns200() {
        // Create campsite with lot
        String campsiteId = given()
            .header("Authorization", "Bearer " + ownerToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "name", "Lots Test Campsite " + System.currentTimeMillis(),
                "description", "Testing lots",
                "location", Map.of(
                    "address", "Lots Road",
                    "county", "Kerry",
                    "lat", 52.0598,
                    "lng", -9.5044
                )
            ))
        .when()
            .post("/campsites")
        .then()
            .statusCode(201)
            .extract()
            .path("id");

        // Add a lot
        given()
            .header("Authorization", "Bearer " + ownerToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "campsiteId", campsiteId,
                "name", "Lot A1",
                "type", "TENT",
                "capacity", 4,
                "pricePerNight", 35.00
            ))
        .when()
            .post("/lots")
        .then()
            .statusCode(201);

        given()
        .when()
            .get("/campsites/{id}/lots", campsiteId)
        .then()
            .statusCode(200)
            .body("$", hasSize(1));
    }

    @Test
    @DisplayName("POST /api/campsites - should return 201 for owner")
    void createCampsite_asOwner_returns201() {
        given()
            .header("Authorization", "Bearer " + ownerToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "name", "New Owner Campsite " + System.currentTimeMillis(),
                "description", "Created by owner",
                "location", Map.of(
                    "address", "Owner Road",
                    "county", "Galway",
                    "lat", 53.2707,
                    "lng", -9.0568
                ),
                "facilities", Set.of("WIFI", "SHOWER")
            ))
        .when()
            .post("/campsites")
        .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("name", containsString("New Owner Campsite"));
    }

    @Test
    @DisplayName("POST /api/campsites - should return 403 for regular user")
    void createCampsite_asRegularUser_returns403() {
        given()
            .header("Authorization", "Bearer " + userToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "name", "Unauthorized Campsite",
                "description", "Should fail",
                "location", Map.of(
                    "address", "Fail Road",
                    "county", "Dublin",
                    "lat", 53.3498,
                    "lng", -6.2603
                )
            ))
        .when()
            .post("/campsites")
        .then()
            .statusCode(403);
    }

    @Test
    @DisplayName("POST /api/campsites - should return 401 without authentication")
    void createCampsite_withoutAuth_returns401() {
        given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "name", "No Auth Campsite",
                "description", "Should fail",
                "location", Map.of(
                    "address", "Fail Road",
                    "county", "Dublin",
                    "lat", 53.3498,
                    "lng", -6.2603
                )
            ))
        .when()
            .post("/campsites")
        .then()
            .statusCode(401);
    }

    @Test
    @DisplayName("PUT /api/campsites/{id} - should return 200 for owner")
    void updateCampsite_asOwner_returns200() {
        // Create campsite
        String campsiteId = given()
            .header("Authorization", "Bearer " + ownerToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "name", "Original Name " + System.currentTimeMillis(),
                "description", "Original description",
                "location", Map.of(
                    "address", "Original Road",
                    "county", "Mayo",
                    "lat", 53.8008,
                    "lng", -9.5208
                )
            ))
        .when()
            .post("/campsites")
        .then()
            .statusCode(201)
            .extract()
            .path("id");

        // Update campsite
        given()
            .header("Authorization", "Bearer " + ownerToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "name", "Updated Name",
                "description", "Updated description",
                "location", Map.of(
                    "address", "Updated Road",
                    "county", "Mayo",
                    "lat", 53.8008,
                    "lng", -9.5208
                )
            ))
        .when()
            .put("/campsites/{id}", campsiteId)
        .then()
            .statusCode(200)
            .body("name", equalTo("Updated Name"))
            .body("description", equalTo("Updated description"));
    }

    @Test
    @DisplayName("DELETE /api/campsites/{id} - should return 204 for owner")
    void deleteCampsite_asOwner_returns204() {
        // Create campsite
        String campsiteId = given()
            .header("Authorization", "Bearer " + ownerToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "name", "To Delete " + System.currentTimeMillis(),
                "description", "Will be deleted",
                "location", Map.of(
                    "address", "Delete Road",
                    "county", "Sligo",
                    "lat", 54.2697,
                    "lng", -8.4694
                )
            ))
        .when()
            .post("/campsites")
        .then()
            .statusCode(201)
            .extract()
            .path("id");

        // Delete campsite
        given()
            .header("Authorization", "Bearer " + ownerToken)
        .when()
            .delete("/campsites/{id}", campsiteId)
        .then()
            .statusCode(204);

        // Verify deletion
        given()
        .when()
            .get("/campsites/{id}", campsiteId)
        .then()
            .statusCode(404);
    }
}
