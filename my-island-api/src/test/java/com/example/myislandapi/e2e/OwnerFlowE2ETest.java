package com.example.myislandapi.e2e;

import com.example.myislandapi.config.AbstractIntegrationTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * E2E tests for owner management flow.
 * Tests campsite creation, lot management, and owner dashboard.
 */
@DisplayName("Owner Flow E2E Tests")
class OwnerFlowE2ETest extends AbstractIntegrationTest {

    private String ownerToken;
    private String regularUserToken;

    @BeforeEach
    void setUp() {
        ownerToken = dataSeeder.createOwnerAndGetToken();
        regularUserToken = authenticateNewUser();
    }

    @Nested
    @DisplayName("Create Campsite")
    class CreateCampsite {

        @Test
        @DisplayName("Should create campsite as owner")
        void shouldCreateCampsiteAsOwner() {
            given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Lakeside Retreat",
                    "description", "Beautiful lakeside camping with stunning views",
                    "location", Map.of(
                        "address", "123 Lake Road",
                        "county", "Kerry",
                        "lat", 52.0598,
                        "lng", -9.5044
                    ),
                    "facilities", Set.of("WIFI", "SHOWER", "ELECTRIC"),
                    "images", List.of("https://example.com/image1.jpg")
                ))
            .when()
                .post("/campsites")
            .then()
                .statusCode(201)
                .body("name", equalTo("Lakeside Retreat"))
                .body("description", containsString("lakeside"))
                .body("id", notNullValue());
        }

        @Test
        @DisplayName("Should reject campsite creation by regular user")
        void shouldRejectCampsiteCreationByRegularUser() {
            given()
                .header("Authorization", "Bearer " + regularUserToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Unauthorized Campsite",
                    "description", "This should fail",
                    "location", Map.of(
                        "address", "456 Test Road",
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
        @DisplayName("Should reject campsite without name")
        void shouldRejectCampsiteWithoutName() {
            given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "description", "No name provided",
                    "location", Map.of(
                        "address", "789 Test Road",
                        "county", "Cork",
                        "lat", 51.8969,
                        "lng", -8.4863
                    )
                ))
            .when()
                .post("/campsites")
            .then()
                .statusCode(400);
        }
    }

    @Nested
    @DisplayName("Create Lot")
    class CreateLot {

        @Test
        @DisplayName("Should create lot for owned campsite")
        void shouldCreateLotForOwnedCampsite() {
            // First create a campsite
            String campsiteId = given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Campsite for Lots " + System.currentTimeMillis(),
                    "description", "Test campsite for lot creation",
                    "location", Map.of(
                        "address", "Lot Test Road",
                        "county", "Galway",
                        "lat", 53.2707,
                        "lng", -9.0568
                    )
                ))
            .when()
                .post("/campsites")
            .then()
                .statusCode(201)
                .extract()
                .path("id");

            // Then create a lot
            given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "campsiteId", campsiteId,
                    "name", "Lot A1",
                    "type", "TENT",
                    "capacity", 4,
                    "pricePerNight", 35.00,
                    "amenities", List.of("Fire Pit", "Picnic Table"),
                    "available", true
                ))
            .when()
                .post("/lots")
            .then()
                .statusCode(201)
                .body("name", equalTo("Lot A1"))
                .body("type", equalTo("TENT"))
                .body("capacity", equalTo(4))
                .body("pricePerNight", equalTo(35.0f));
        }

        @Test
        @DisplayName("Should reject lot creation by non-owner")
        void shouldRejectLotCreationByNonOwner() {
            // First create a campsite as owner
            String campsiteId = given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Owner's Campsite " + System.currentTimeMillis(),
                    "description", "Test",
                    "location", Map.of(
                        "address", "Test Road",
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

            // Try to create lot as regular user
            given()
                .header("Authorization", "Bearer " + regularUserToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "campsiteId", campsiteId,
                    "name", "Unauthorized Lot",
                    "type", "TENT",
                    "capacity", 2,
                    "pricePerNight", 25.00
                ))
            .when()
                .post("/lots")
            .then()
                .statusCode(403);
        }
    }

    @Nested
    @DisplayName("Owner Dashboard")
    class OwnerDashboard {

        @Test
        @DisplayName("Should get owner stats")
        void shouldGetOwnerStats() {
            given()
                .header("Authorization", "Bearer " + ownerToken)
            .when()
                .get("/owner/stats")
            .then()
                .statusCode(200)
                .body("totalCampsites", greaterThanOrEqualTo(0))
                .body("totalBookings", greaterThanOrEqualTo(0))
                .body("totalRevenue", greaterThanOrEqualTo(0f));
        }

        @Test
        @DisplayName("Should get owner campsites")
        void shouldGetOwnerCampsites() {
            // Create a campsite first
            given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Dashboard Test Campsite " + System.currentTimeMillis(),
                    "description", "For dashboard testing",
                    "location", Map.of(
                        "address", "Dashboard Road",
                        "county", "Clare",
                        "lat", 52.8472,
                        "lng", -9.2795
                    )
                ))
            .when()
                .post("/campsites")
            .then()
                .statusCode(201);

            // Get owner's campsites
            given()
                .header("Authorization", "Bearer " + ownerToken)
            .when()
                .get("/owner/campsites")
            .then()
                .statusCode(200)
                .body("$", hasSize(greaterThanOrEqualTo(1)));
        }

        @Test
        @DisplayName("Should get owner bookings")
        void shouldGetOwnerBookings() {
            given()
                .header("Authorization", "Bearer " + ownerToken)
            .when()
                .get("/owner/bookings")
            .then()
                .statusCode(200)
                .body("content", notNullValue())
                .body("totalElements", greaterThanOrEqualTo(0));
        }

        @Test
        @DisplayName("Should get revenue data")
        void shouldGetRevenueData() {
            given()
                .header("Authorization", "Bearer " + ownerToken)
                .queryParam("months", 6)
            .when()
                .get("/owner/revenue-data")
            .then()
                .statusCode(200);
        }

        @Test
        @DisplayName("Should reject dashboard access by regular user")
        void shouldRejectDashboardAccessByRegularUser() {
            given()
                .header("Authorization", "Bearer " + regularUserToken)
            .when()
                .get("/owner/stats")
            .then()
                .statusCode(anyOf(equalTo(401), equalTo(403)));
        }
    }

    @Nested
    @DisplayName("Complete Owner Flow")
    class CompleteFlow {

        @Test
        @DisplayName("Should complete full owner management flow")
        void shouldCompleteFullOwnerManagementFlow() {
            // Step 1: Create campsite
            String campsiteId = given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Complete Flow Campsite " + System.currentTimeMillis(),
                    "description", "A beautiful campsite with amazing facilities",
                    "location", Map.of(
                        "address", "Complete Flow Road",
                        "county", "Wicklow",
                        "lat", 52.9808,
                        "lng", -6.0446
                    ),
                    "facilities", Set.of("WIFI", "SHOWER", "ELECTRIC", "TOILET"),
                    "images", List.of("https://example.com/campsite.jpg")
                ))
            .when()
                .post("/campsites")
            .then()
                .statusCode(201)
                .body("id", notNullValue())
                .extract()
                .path("id");

            // Step 2: Create multiple lots
            String lot1Id = given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "campsiteId", campsiteId,
                    "name", "Premium Lot 1",
                    "type", "GLAMPING",
                    "capacity", 4,
                    "pricePerNight", 85.00,
                    "amenities", List.of("Fire Pit", "Hot Tub", "Private Bathroom")
                ))
            .when()
                .post("/lots")
            .then()
                .statusCode(201)
                .extract()
                .path("id");

            given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "campsiteId", campsiteId,
                    "name", "Standard Lot 2",
                    "type", "TENT",
                    "capacity", 2,
                    "pricePerNight", 30.00
                ))
            .when()
                .post("/lots")
            .then()
                .statusCode(201);

            // Step 3: Verify campsite appears in public listing
            given()
            .when()
                .get("/campsites/{id}", campsiteId)
            .then()
                .statusCode(200)
                .body("lots", hasSize(2));

            // Step 4: Check owner stats
            given()
                .header("Authorization", "Bearer " + ownerToken)
            .when()
                .get("/owner/stats")
            .then()
                .statusCode(200)
                .body("totalCampsites", greaterThanOrEqualTo(1));

            // Step 5: Update campsite
            given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Updated Campsite Name",
                    "description", "Updated description with more details",
                    "location", Map.of(
                        "address", "Updated Address",
                        "county", "Wicklow",
                        "lat", 52.9808,
                        "lng", -6.0446
                    )
                ))
            .when()
                .put("/campsites/{id}", campsiteId)
            .then()
                .statusCode(200)
                .body("name", equalTo("Updated Campsite Name"));
        }
    }
}
