package com.example.myislandapi.integration.controller;

import com.example.myislandapi.config.AbstractIntegrationTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Integration tests for AuthController.
 * Tests all authentication endpoints with real database and JWT handling.
 */
@DisplayName("AuthController Integration Tests")
class AuthControllerTest extends AbstractIntegrationTest {

    @Test
    @DisplayName("POST /api/auth/register - should return 201 with tokens")
    void register_withValidData_returns201() {
        String email = "register_test_" + System.currentTimeMillis() + "@test.com";

        given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "email", email,
                "password", "ValidPass123!",
                "name", "Test User"
            ))
        .when()
            .post("/auth/register")
        .then()
            .statusCode(201)
            .body("accessToken", notNullValue())
            .body("refreshToken", notNullValue())
            .body("expiresIn", greaterThan(0))
            .body("user.email", equalTo(email))
            .body("user.name", equalTo("Test User"));
    }

    @Test
    @DisplayName("POST /api/auth/register - should return 400 for invalid email")
    void register_withInvalidEmail_returns400() {
        given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "email", "invalid-email",
                "password", "ValidPass123!",
                "name", "Test User"
            ))
        .when()
            .post("/auth/register")
        .then()
            .statusCode(400);
    }

    @Test
    @DisplayName("POST /api/auth/register - should return 400 for short password")
    void register_withShortPassword_returns400() {
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
    @DisplayName("POST /api/auth/register - should return 409 for duplicate email")
    void register_withDuplicateEmail_returns409() {
        String email = "duplicate_" + System.currentTimeMillis() + "@test.com";

        // First registration
        registerUser(email, "ValidPass123!", "First User");

        // Second registration with same email
        given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "email", email,
                "password", "ValidPass123!",
                "name", "Second User"
            ))
        .when()
            .post("/auth/register")
        .then()
            .statusCode(409);
    }

    @Test
    @DisplayName("POST /api/auth/login - should return 200 with tokens")
    void login_withValidCredentials_returns200() {
        String email = "login_test_" + System.currentTimeMillis() + "@test.com";
        String password = "ValidPass123!";

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
    @DisplayName("POST /api/auth/login - should return 401 for wrong password")
    void login_withWrongPassword_returns401() {
        String email = "wrong_pass_" + System.currentTimeMillis() + "@test.com";

        registerUser(email, "CorrectPass123!", "Test User");

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
    @DisplayName("POST /api/auth/login - should return 401 for non-existent user")
    void login_withNonExistentUser_returns401() {
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

    @Test
    @DisplayName("POST /api/auth/refresh - should return 200 with new tokens")
    void refresh_withValidToken_returns200() {
        String email = "refresh_test_" + System.currentTimeMillis() + "@test.com";

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
    @DisplayName("POST /api/auth/refresh - should return 401 for invalid token")
    void refresh_withInvalidToken_returns401() {
        given()
            .contentType(ContentType.JSON)
            .body(Map.of("refreshToken", "invalid.token.here"))
        .when()
            .post("/auth/refresh")
        .then()
            .statusCode(401);
    }
}
