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
 * E2E tests for campsite search and discovery flow.
 * Tests search, filtering, pagination, and map-based queries.
 */
@DisplayName("Search Flow E2E Tests")
class SearchFlowE2ETest extends AbstractIntegrationTest {

    private String ownerToken;

    @BeforeEach
    void setUp() {
        ownerToken = dataSeeder.createOwnerAndGetToken();
    }

    private String createCampsiteInCounty(String name, String county) {
        return given()
            .header("Authorization", "Bearer " + ownerToken)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "name", name,
                "description", "A campsite in " + county,
                "location", Map.of(
                    "address", "123 " + county + " Road",
                    "county", county,
                    "lat", 53.0 + Math.random(),
                    "lng", -7.0 - Math.random()
                ),
                "facilities", Set.of("WIFI", "SHOWER")
            ))
        .when()
            .post("/campsites")
        .then()
            .statusCode(201)
            .extract()
            .path("id");
    }

    @Nested
    @DisplayName("List Campsites")
    class ListCampsites {

        @Test
        @DisplayName("Should list all campsites")
        void shouldListAllCampsites() {
            // Create a campsite to ensure there's at least one
            createCampsiteInCounty("List Test Campsite " + System.currentTimeMillis(), "Dublin");

            given()
            .when()
                .get("/campsites")
            .then()
                .statusCode(200)
                .body("content", hasSize(greaterThanOrEqualTo(1)))
                .body("totalElements", greaterThanOrEqualTo(1));
        }

        @Test
        @DisplayName("Should list campsites with pagination")
        void shouldListCampsitesWithPagination() {
            given()
                .queryParam("page", 0)
                .queryParam("size", 10)
            .when()
                .get("/campsites")
            .then()
                .statusCode(200)
                .body("content", hasSize(lessThanOrEqualTo(10)))
                .body("number", equalTo(0))
                .body("size", equalTo(10));
        }
    }

    @Nested
    @DisplayName("Filter By County")
    class FilterByCounty {

        @Test
        @DisplayName("Should filter campsites by county")
        void shouldFilterByCounty() {
            // Create campsites in different counties
            String uniqueCounty = "Galway";
            createCampsiteInCounty("Galway Campsite " + System.currentTimeMillis(), uniqueCounty);

            given()
                .queryParam("county", uniqueCounty)
            .when()
                .get("/campsites")
            .then()
                .statusCode(200)
                .body("content", hasSize(greaterThanOrEqualTo(1)));
        }
    }

    @Nested
    @DisplayName("Search By Text")
    class SearchByText {

        @Test
        @DisplayName("Should search campsites by name")
        void shouldSearchByName() {
            String uniqueName = "Searchable " + System.currentTimeMillis();
            createCampsiteInCounty(uniqueName, "Cork");

            given()
                .queryParam("search", "Searchable")
            .when()
                .get("/campsites")
            .then()
                .statusCode(200);
        }
    }

    @Nested
    @DisplayName("Filter By Facilities")
    class FilterByFacilities {

        @Test
        @DisplayName("Should filter by single facility")
        void shouldFilterBySingleFacility() {
            given()
                .queryParam("facilities", "WIFI")
            .when()
                .get("/campsites")
            .then()
                .statusCode(200);
        }

        @Test
        @DisplayName("Should filter by multiple facilities")
        void shouldFilterByMultipleFacilities() {
            given()
                .queryParam("facilities", "WIFI,SHOWER")
            .when()
                .get("/campsites")
            .then()
                .statusCode(200);
        }
    }

    @Nested
    @DisplayName("Featured Campsites")
    class FeaturedCampsites {

        @Test
        @DisplayName("Should get featured campsites")
        void shouldGetFeaturedCampsites() {
            given()
            .when()
                .get("/campsites/featured")
            .then()
                .statusCode(200)
                .body("content", notNullValue());
        }

        @Test
        @DisplayName("Should get featured campsites via query param")
        void shouldGetFeaturedViaQueryParam() {
            given()
                .queryParam("featured", true)
            .when()
                .get("/campsites")
            .then()
                .statusCode(200)
                .body("content", notNullValue());
        }
    }

    @Nested
    @DisplayName("Campsite Details")
    class CampsiteDetails {

        @Test
        @DisplayName("Should get campsite details")
        void shouldGetCampsiteDetails() {
            String campsiteId = createCampsiteInCounty("Details Test " + System.currentTimeMillis(), "Kerry");

            // Add a lot to the campsite
            given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "campsiteId", campsiteId,
                    "name", "Test Lot",
                    "type", "TENT",
                    "capacity", 4,
                    "pricePerNight", 45.00
                ))
            .when()
                .post("/lots")
            .then()
                .statusCode(201);

            // Get campsite details
            given()
            .when()
                .get("/campsites/{id}", campsiteId)
            .then()
                .statusCode(200)
                .body("id", equalTo(campsiteId))
                .body("name", containsString("Details Test"))
                .body("lots", hasSize(1));
        }

        @Test
        @DisplayName("Should return 404 for non-existent campsite")
        void shouldReturn404ForNonExistentCampsite() {
            given()
            .when()
                .get("/campsites/{id}", "00000000-0000-0000-0000-000000000000")
            .then()
                .statusCode(404);
        }

        @Test
        @DisplayName("Should get campsite lots")
        void shouldGetCampsiteLots() {
            String campsiteId = createCampsiteInCounty("Lots Test " + System.currentTimeMillis(), "Sligo");

            // Add multiple lots
            for (int i = 1; i <= 3; i++) {
                given()
                    .header("Authorization", "Bearer " + ownerToken)
                    .contentType(ContentType.JSON)
                    .body(Map.of(
                        "campsiteId", campsiteId,
                        "name", "Lot " + i,
                        "type", "TENT",
                        "capacity", 2 + i,
                        "pricePerNight", 30.00 + (i * 5)
                    ))
                .when()
                    .post("/lots")
                .then()
                    .statusCode(201);
            }

            given()
            .when()
                .get("/campsites/{id}/lots", campsiteId)
            .then()
                .statusCode(200)
                .body("$", hasSize(3));
        }
    }

    @Nested
    @DisplayName("Map View")
    class MapView {

        @Test
        @DisplayName("Should get campsites in bounding box")
        void shouldGetCampsitesInBoundingBox() {
            given()
                .queryParam("minLat", 51.0)
                .queryParam("maxLat", 55.0)
                .queryParam("minLng", -11.0)
                .queryParam("maxLng", -5.0)
            .when()
                .get("/campsites/map")
            .then()
                .statusCode(200)
                .body("$", notNullValue());
        }

        @Test
        @DisplayName("Should return empty for bounding box with no campsites")
        void shouldReturnEmptyForEmptyBoundingBox() {
            // Far away coordinates where no campsites exist
            given()
                .queryParam("minLat", -90.0)
                .queryParam("maxLat", -80.0)
                .queryParam("minLng", 170.0)
                .queryParam("maxLng", 180.0)
            .when()
                .get("/campsites/map")
            .then()
                .statusCode(200)
                .body("$", hasSize(0));
        }
    }

    @Nested
    @DisplayName("Lot Availability")
    class LotAvailability {

        @Test
        @DisplayName("Should check lot availability")
        void shouldCheckLotAvailability() {
            String campsiteId = createCampsiteInCounty("Availability Test " + System.currentTimeMillis(), "Donegal");

            String lotId = given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "campsiteId", campsiteId,
                    "name", "Available Lot",
                    "type", "TENT",
                    "capacity", 4,
                    "pricePerNight", 40.00
                ))
            .when()
                .post("/lots")
            .then()
                .statusCode(201)
                .extract()
                .path("id");

            given()
                .queryParam("startDate", "2025-07-01")
                .queryParam("endDate", "2025-07-07")
            .when()
                .get("/lots/{lotId}/availability", lotId)
            .then()
                .statusCode(200);
        }
    }

    @Nested
    @DisplayName("Combined Search")
    class CombinedSearch {

        @Test
        @DisplayName("Should combine county and search filters")
        void shouldCombineFilters() {
            given()
                .queryParam("county", "Dublin")
                .queryParam("search", "camping")
            .when()
                .get("/campsites")
            .then()
                .statusCode(200);
        }

        @Test
        @DisplayName("Should combine all filters")
        void shouldCombineAllFilters() {
            given()
                .queryParam("county", "Kerry")
                .queryParam("search", "lake")
                .queryParam("facilities", "WIFI")
                .queryParam("page", 0)
                .queryParam("size", 10)
            .when()
                .get("/campsites")
            .then()
                .statusCode(200)
                .body("number", equalTo(0))
                .body("size", equalTo(10));
        }
    }
}
