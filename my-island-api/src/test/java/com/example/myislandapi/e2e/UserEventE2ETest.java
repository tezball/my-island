package com.example.myislandapi.e2e;

import com.example.myislandapi.config.AbstractIntegrationTest;
import com.example.myislandapi.config.TestKafkaConsumer;
import com.example.myislandapi.event.UserEvent;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.hamcrest.Matchers.*;

/**
 * E2E tests for user-related Kafka events.
 * Tests that user actions (login, signup, password reset) publish appropriate events.
 */
@DisplayName("User Event E2E Tests")
class UserEventE2ETest extends AbstractIntegrationTest {

    @Autowired
    private TestKafkaConsumer testKafkaConsumer;

    @BeforeEach
    void clearEvents() {
        testKafkaConsumer.clear();
    }

    @Test
    @DisplayName("Should publish USER_REGISTERED event when user signs up")
    void shouldPublishUserRegisteredEventOnSignup() {
        String email = "user_event_test_" + System.currentTimeMillis() + "@test.com";
        String name = "User Event Test";

        // Register a new user
        given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "email", email,
                "password", "SecurePass123!",
                "name", name
            ))
        .when()
            .post("/auth/register")
        .then()
            .statusCode(201)
            .body("accessToken", notNullValue())
            .body("user.email", equalTo(email));

        // Wait for the UserEvent to be published and consumed
        await()
            .atMost(10, TimeUnit.SECONDS)
            .pollInterval(500, TimeUnit.MILLISECONDS)
            .untilAsserted(() -> {
                var userEvents = testKafkaConsumer.getEventsOfType(UserEvent.class);
                assertThat(userEvents).isNotEmpty();
                assertThat(userEvents).anyMatch(event ->
                    UserEvent.TYPE_REGISTERED.equals(event.eventType()) &&
                    email.equals(event.email())
                );
            });
    }

    @Test
    @DisplayName("Should publish USER_LOGIN event on successful login")
    void shouldPublishUserLoginEventOnSuccessfulLogin() {
        // First register a user
        String email = "login_event_test_" + System.currentTimeMillis() + "@test.com";
        registerUser(email, "SecurePass123!", "Login Test User");

        // Clear events from registration
        testKafkaConsumer.clear();

        // Login
        given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "email", email,
                "password", "SecurePass123!"
            ))
        .when()
            .post("/auth/login")
        .then()
            .statusCode(200)
            .body("accessToken", notNullValue());

        // Wait for the UserEvent to be published
        await()
            .atMost(10, TimeUnit.SECONDS)
            .pollInterval(500, TimeUnit.MILLISECONDS)
            .untilAsserted(() -> {
                var userEvents = testKafkaConsumer.getEventsOfType(UserEvent.class);
                assertThat(userEvents).isNotEmpty();
                assertThat(userEvents).anyMatch(event ->
                    UserEvent.TYPE_LOGIN.equals(event.eventType()) &&
                    email.equals(event.email())
                );
            });
    }

    @Test
    @DisplayName("Should publish USER_LOGIN_FAILED event on failed login")
    void shouldPublishUserLoginFailedEventOnBadCredentials() {
        String email = "nonexistent_" + System.currentTimeMillis() + "@test.com";

        // Attempt login with bad credentials
        given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "email", email,
                "password", "WrongPassword123!"
            ))
        .when()
            .post("/auth/login")
        .then()
            .statusCode(401);

        // Wait for the USER_LOGIN_FAILED event
        await()
            .atMost(10, TimeUnit.SECONDS)
            .pollInterval(500, TimeUnit.MILLISECONDS)
            .untilAsserted(() -> {
                var userEvents = testKafkaConsumer.getEventsOfType(UserEvent.class);
                assertThat(userEvents).isNotEmpty();
                assertThat(userEvents).anyMatch(event ->
                    UserEvent.TYPE_LOGIN_FAILED.equals(event.eventType()) &&
                    email.equals(event.email())
                );
            });
    }

    @Test
    @DisplayName("Should publish USER_PASSWORD_RESET_REQUESTED event on forgot password")
    void shouldPublishPasswordResetRequestedEvent() {
        // First register a user
        String email = "reset_event_test_" + System.currentTimeMillis() + "@test.com";
        registerUser(email, "SecurePass123!", "Reset Test User");

        // Clear events from registration
        testKafkaConsumer.clear();

        // Request password reset
        given()
            .contentType(ContentType.JSON)
            .body(Map.of("email", email))
        .when()
            .post("/auth/forgot-password")
        .then()
            .statusCode(200);

        // Wait for the PASSWORD_RESET_REQUESTED event
        await()
            .atMost(10, TimeUnit.SECONDS)
            .pollInterval(500, TimeUnit.MILLISECONDS)
            .untilAsserted(() -> {
                var userEvents = testKafkaConsumer.getEventsOfType(UserEvent.class);
                assertThat(userEvents).isNotEmpty();
                assertThat(userEvents).anyMatch(event ->
                    UserEvent.TYPE_PASSWORD_RESET_REQUESTED.equals(event.eventType()) &&
                    email.equals(event.email())
                );
            });
    }
}
