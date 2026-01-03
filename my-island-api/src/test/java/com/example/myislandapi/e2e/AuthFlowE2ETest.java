package com.example.myislandapi.e2e;

import com.example.myislandapi.config.AbstractIntegrationTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * E2E tests for the complete authentication flow.
 * Tests user registration, login, token refresh, and protected resource access.
 */
@DisplayName("Authentication Flow E2E Tests")
class AuthFlowE2ETest extends AbstractIntegrationTest {

    @Nested
    @DisplayName("User Registration")
    class Registration {

        @Test
        @DisplayName("Should register a new user successfully")
        void shouldRegisterNewUser() {
            String email = "newuser_" + System.currentTimeMillis() + "@test.com";

            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", email,
                    "password", "SecurePass123!",
                    "name", "New User"
                ))
            .when()
                .post("/auth/register")
            .then()
                .statusCode(201)
                .body("accessToken", notNullValue())
                .body("refreshToken", notNullValue())
                .body("expiresIn", greaterThan(0))
                .body("user.email", equalTo(email))
                .body("user.name", equalTo("New User"));
        }

        @Test
        @DisplayName("Should reject registration with invalid email")
        void shouldRejectInvalidEmail() {
            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", "not-an-email",
                    "password", "SecurePass123!",
                    "name", "Test User"
                ))
            .when()
                .post("/auth/register")
            .then()
                .statusCode(400);
        }

        @Test
        @DisplayName("Should reject registration with short password")
        void shouldRejectShortPassword() {
            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", "test_" + System.currentTimeMillis() + "@test.com",
                    "password", "short",
                    "name", "Test User"
                ))
            .when()
                .post("/auth/register")
            .then()
                .statusCode(400);
        }

        @Test
        @DisplayName("Should reject registration with missing name")
        void shouldRejectMissingName() {
            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", "test_" + System.currentTimeMillis() + "@test.com",
                    "password", "SecurePass123!"
                ))
            .when()
                .post("/auth/register")
            .then()
                .statusCode(400);
        }

        @Test
        @DisplayName("Should reject duplicate email registration")
        void shouldRejectDuplicateEmail() {
            String email = "duplicate_" + System.currentTimeMillis() + "@test.com";

            // First registration
            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", email,
                    "password", "SecurePass123!",
                    "name", "First User"
                ))
            .when()
                .post("/auth/register")
            .then()
                .statusCode(201);

            // Duplicate registration
            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", email,
                    "password", "SecurePass123!",
                    "name", "Second User"
                ))
            .when()
                .post("/auth/register")
            .then()
                .statusCode(409);
        }
    }

    @Nested
    @DisplayName("User Login")
    class Login {

        @Test
        @DisplayName("Should login with valid credentials")
        void shouldLoginWithValidCredentials() {
            String email = "login_" + System.currentTimeMillis() + "@test.com";
            String password = "SecurePass123!";

            // Register first
            registerUser(email, password, "Login Test User");

            // Then login
            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", email,
                    "password", password
                ))
            .when()
                .post("/auth/login")
            .then()
                .statusCode(200)
                .body("accessToken", notNullValue())
                .body("refreshToken", notNullValue())
                .body("user.email", equalTo(email));
        }

        @Test
        @DisplayName("Should reject login with wrong password")
        void shouldRejectWrongPassword() {
            String email = "wrongpass_" + System.currentTimeMillis() + "@test.com";

            // Register first
            registerUser(email, "CorrectPass123!", "Wrong Pass User");

            // Login with wrong password
            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", email,
                    "password", "WrongPass123!"
                ))
            .when()
                .post("/auth/login")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("Should reject login for non-existent user")
        void shouldRejectNonExistentUser() {
            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", "nonexistent_" + System.currentTimeMillis() + "@test.com",
                    "password", "SomePass123!"
                ))
            .when()
                .post("/auth/login")
            .then()
                .statusCode(401);
        }
    }

    @Nested
    @DisplayName("Token Refresh")
    class TokenRefresh {

        @Test
        @DisplayName("Should refresh access token with valid refresh token")
        void shouldRefreshToken() {
            String email = "refresh_" + System.currentTimeMillis() + "@test.com";

            // Register and get tokens
            var response = given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", email,
                    "password", "SecurePass123!",
                    "name", "Refresh Test User"
                ))
            .when()
                .post("/auth/register")
            .then()
                .statusCode(201)
                .extract();

            String refreshToken = response.path("refreshToken");

            // Refresh token
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
        @DisplayName("Should reject invalid refresh token")
        void shouldRejectInvalidRefreshToken() {
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
    @DisplayName("Protected Resource Access")
    class ProtectedResources {

        @Test
        @DisplayName("Should access protected endpoint with valid token")
        void shouldAccessProtectedEndpointWithValidToken() {
            String token = authenticateNewUser();

            given()
                .header("Authorization", "Bearer " + token)
            .when()
                .get("/bookings")
            .then()
                .statusCode(200);
        }

        @Test
        @DisplayName("Should reject access without token")
        void shouldRejectAccessWithoutToken() {
            given()
            .when()
                .get("/bookings")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("Should reject access with invalid token")
        void shouldRejectAccessWithInvalidToken() {
            given()
                .header("Authorization", "Bearer invalid.token.here")
            .when()
                .get("/bookings")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("Should reject access with malformed authorization header")
        void shouldRejectMalformedAuthHeader() {
            given()
                .header("Authorization", "InvalidScheme token")
            .when()
                .get("/bookings")
            .then()
                .statusCode(401);
        }
    }

    @Nested
    @DisplayName("Complete Authentication Flow")
    class CompleteFlow {

        @Test
        @DisplayName("Should complete full authentication lifecycle")
        void shouldCompleteFullAuthenticationLifecycle() {
            String email = "lifecycle_" + System.currentTimeMillis() + "@test.com";
            String password = "SecurePass123!";

            // Step 1: Register
            var registerResponse = given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", email,
                    "password", password,
                    "name", "Lifecycle User"
                ))
            .when()
                .post("/auth/register")
            .then()
                .statusCode(201)
                .body("user.email", equalTo(email))
                .extract();

            String accessToken = registerResponse.path("accessToken");
            String refreshToken = registerResponse.path("refreshToken");

            // Step 2: Access protected resource with token
            given()
                .header("Authorization", "Bearer " + accessToken)
            .when()
                .get("/bookings")
            .then()
                .statusCode(200);

            // Step 3: Refresh the token
            var refreshResponse = given()
                .contentType(ContentType.JSON)
                .body(Map.of("refreshToken", refreshToken))
            .when()
                .post("/auth/refresh")
            .then()
                .statusCode(200)
                .extract();

            String newAccessToken = refreshResponse.path("accessToken");

            // Step 4: Access protected resource with new token
            given()
                .header("Authorization", "Bearer " + newAccessToken)
            .when()
                .get("/bookings")
            .then()
                .statusCode(200);

            // Step 5: Login again
            given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "email", email,
                    "password", password
                ))
            .when()
                .post("/auth/login")
            .then()
                .statusCode(200)
                .body("user.email", equalTo(email));
        }
    }
}
