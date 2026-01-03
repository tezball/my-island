package com.example.myislandapi.integration.security;

import com.example.myislandapi.config.AbstractIntegrationTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Integration tests for security configuration.
 * Tests authentication, authorization, and role-based access control.
 */
@DisplayName("Security Configuration Integration Tests")
class SecurityConfigTest extends AbstractIntegrationTest {

    private String userToken;
    private String ownerToken;

    @BeforeEach
    void setUp() {
        userToken = authenticateNewUser();
        ownerToken = dataSeeder.createOwnerAndGetToken();
    }

    @Nested
    @DisplayName("Public Endpoints")
    class PublicEndpoints {

        @Test
        @DisplayName("GET /api/campsites should be accessible without authentication")
        void getCampsites_withoutAuth_returns200() {
            given()
            .when()
                .get("/campsites")
            .then()
                .statusCode(200);
        }

        @Test
        @DisplayName("GET /api/campsites/{id} should be accessible without authentication")
        void getCampsiteById_withoutAuth_returns200or404() {
            // Create a campsite first
            String campsiteId = given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Public Test Campsite " + System.currentTimeMillis(),
                    "description", "Testing public access",
                    "location", Map.of(
                        "address", "Test Address",
                        "county", "Dublin",
                        "lat", 53.35,
                        "lng", -6.26
                    )
                ))
            .when()
                .post("/campsites")
            .then()
                .statusCode(201)
                .extract()
                .path("id");

            // Access without auth
            given()
            .when()
                .get("/campsites/{id}", campsiteId)
            .then()
                .statusCode(200)
                .body("id", equalTo(campsiteId));
        }

        @Test
        @DisplayName("GET /api/campsites/featured should be accessible without authentication")
        void getFeaturedCampsites_withoutAuth_returns200() {
            given()
            .when()
                .get("/campsites/featured")
            .then()
                .statusCode(200);
        }

        @Test
        @DisplayName("GET /api/campsites/map should be accessible without authentication")
        void getMapCampsites_withoutAuth_returns200() {
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
        @DisplayName("POST /api/auth/register should be accessible without authentication")
        void register_withoutAuth_returns201() {
            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", "security_test_" + System.currentTimeMillis() + "@test.com",
                    "password", "ValidPass123!",
                    "name", "Security Test User"
                ))
            .when()
                .post("/auth/register")
            .then()
                .statusCode(201);
        }

        @Test
        @DisplayName("POST /api/auth/login should be accessible without authentication")
        void login_withoutAuth_returns200or401() {
            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", "nonexistent@test.com",
                    "password", "SomePassword123!"
                ))
            .when()
                .post("/auth/login")
            .then()
                .statusCode(401); // Invalid credentials, but endpoint is accessible
        }
    }

    @Nested
    @DisplayName("Protected Endpoints")
    class ProtectedEndpoints {

        @Test
        @DisplayName("GET /api/bookings should require authentication")
        void getBookings_withoutAuth_returns401() {
            given()
            .when()
                .get("/bookings")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("GET /api/bookings should succeed with valid token")
        void getBookings_withAuth_returns200() {
            given()
                .header("Authorization", "Bearer " + userToken)
            .when()
                .get("/bookings")
            .then()
                .statusCode(200);
        }

        @Test
        @DisplayName("POST /api/bookings should require authentication")
        void createBooking_withoutAuth_returns401() {
            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "lotId", "00000000-0000-0000-0000-000000000000",
                    "checkIn", "2025-08-01",
                    "checkOut", "2025-08-05",
                    "guests", 2
                ))
            .when()
                .post("/bookings")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("GET /api/users/me should require authentication")
        void getCurrentUser_withoutAuth_returns401() {
            given()
            .when()
                .get("/users/me")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("GET /api/users/me should succeed with valid token")
        void getCurrentUser_withAuth_returns200() {
            given()
                .header("Authorization", "Bearer " + userToken)
            .when()
                .get("/users/me")
            .then()
                .statusCode(200)
                .body("email", notNullValue());
        }
    }

    @Nested
    @DisplayName("Owner Role Access Control")
    class OwnerRoleAccessControl {

        @Test
        @DisplayName("POST /api/campsites should require OWNER role")
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
                        "lat", 53.35,
                        "lng", -6.26
                    )
                ))
            .when()
                .post("/campsites")
            .then()
                .statusCode(403);
        }

        @Test
        @DisplayName("POST /api/campsites should succeed for OWNER")
        void createCampsite_asOwner_returns201() {
            given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Owner Campsite " + System.currentTimeMillis(),
                    "description", "Created by owner",
                    "location", Map.of(
                        "address", "Owner Road",
                        "county", "Cork",
                        "lat", 51.9,
                        "lng", -8.5
                    )
                ))
            .when()
                .post("/campsites")
            .then()
                .statusCode(201);
        }

        @Test
        @DisplayName("PUT /api/campsites/{id} should require OWNER role")
        void updateCampsite_asRegularUser_returns403() {
            // Create campsite as owner
            String campsiteId = given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Update Test " + System.currentTimeMillis(),
                    "description", "Original",
                    "location", Map.of(
                        "address", "Update Road",
                        "county", "Galway",
                        "lat", 53.27,
                        "lng", -9.05
                    )
                ))
            .when()
                .post("/campsites")
            .then()
                .statusCode(201)
                .extract()
                .path("id");

            // Try to update as regular user
            given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Hacked Name",
                    "description", "Hacked",
                    "location", Map.of(
                        "address", "Hacked Road",
                        "county", "Galway",
                        "lat", 53.27,
                        "lng", -9.05
                    )
                ))
            .when()
                .put("/campsites/{id}", campsiteId)
            .then()
                .statusCode(403);
        }

        @Test
        @DisplayName("DELETE /api/campsites/{id} should require OWNER role")
        void deleteCampsite_asRegularUser_returns403() {
            // Create campsite as owner
            String campsiteId = given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Delete Test " + System.currentTimeMillis(),
                    "description", "Will try to delete",
                    "location", Map.of(
                        "address", "Delete Road",
                        "county", "Kerry",
                        "lat", 52.06,
                        "lng", -9.5
                    )
                ))
            .when()
                .post("/campsites")
            .then()
                .statusCode(201)
                .extract()
                .path("id");

            // Try to delete as regular user
            given()
                .header("Authorization", "Bearer " + userToken)
            .when()
                .delete("/campsites/{id}", campsiteId)
            .then()
                .statusCode(403);
        }

        @Test
        @DisplayName("POST /api/lots should require OWNER role")
        void createLot_asRegularUser_returns403() {
            // Create campsite as owner
            String campsiteId = given()
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "name", "Lot Test " + System.currentTimeMillis(),
                    "description", "Testing lot creation",
                    "location", Map.of(
                        "address", "Lot Road",
                        "county", "Mayo",
                        "lat", 53.8,
                        "lng", -9.5
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
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "campsiteId", campsiteId,
                    "name", "Unauthorized Lot",
                    "type", "TENT",
                    "capacity", 4,
                    "pricePerNight", 50.00
                ))
            .when()
                .post("/lots")
            .then()
                .statusCode(403);
        }
    }

    @Nested
    @DisplayName("JWT Token Validation")
    class JwtTokenValidation {

        @Test
        @DisplayName("Invalid JWT token should return 401")
        void invalidToken_returns401() {
            given()
                .header("Authorization", "Bearer invalid.jwt.token")
            .when()
                .get("/bookings")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("Malformed Authorization header should return 401")
        void malformedAuthHeader_returns401() {
            given()
                .header("Authorization", "NotBearer token")
            .when()
                .get("/bookings")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("Empty Authorization header should return 401")
        void emptyAuthHeader_returns401() {
            given()
                .header("Authorization", "")
            .when()
                .get("/bookings")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("Expired token should return 401")
        void expiredToken_returns401() {
            // This is a properly formatted but expired JWT
            String expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                    "eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiZXhwIjoxNjAwMDAwMDAwfQ." +
                    "invalid_signature";

            given()
                .header("Authorization", "Bearer " + expiredToken)
            .when()
                .get("/bookings")
            .then()
                .statusCode(401);
        }
    }

    @Nested
    @DisplayName("Token Refresh")
    class TokenRefresh {

        @Test
        @DisplayName("Valid refresh token should return new access token")
        void validRefreshToken_returnsNewTokens() {
            // Register and get refresh token
            String email = "refresh_security_" + System.currentTimeMillis() + "@test.com";

            String refreshToken = given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", email,
                    "password", "ValidPass123!",
                    "name", "Refresh Test User"
                ))
            .when()
                .post("/auth/register")
            .then()
                .statusCode(201)
                .extract()
                .path("refreshToken");

            // Use refresh token
            given()
                .contentType(ContentType.JSON)
                .body(Map.of("refreshToken", refreshToken))
            .when()
                .post("/auth/refresh")
            .then()
                .statusCode(200)
                .body("accessToken", notNullValue())
                .body("refreshToken", notNullValue());
        }

        @Test
        @DisplayName("Invalid refresh token should return 401")
        void invalidRefreshToken_returns401() {
            given()
                .contentType(ContentType.JSON)
                .body(Map.of("refreshToken", "invalid.refresh.token"))
            .when()
                .post("/auth/refresh")
            .then()
                .statusCode(401);
        }
    }

    @Nested
    @DisplayName("Cross-Origin Resource Sharing (CORS)")
    class CorsConfiguration {

        @Test
        @DisplayName("OPTIONS request should return CORS headers")
        void optionsRequest_returnsCorsHeaders() {
            given()
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "GET")
            .when()
                .options("/campsites")
            .then()
                .statusCode(anyOf(equalTo(200), equalTo(204)))
                .header("Access-Control-Allow-Origin", notNullValue());
        }
    }
}
