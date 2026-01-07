package com.example.myislandapi.e2e;

import com.example.myislandapi.config.AbstractIntegrationTest;
import com.example.myislandapi.service.EmailService;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;

/**
 * E2E test for signup welcome email flow.
 * Verifies that when a user signs up:
 * 1. The registration completes successfully
 * 2. A welcome email event is published to Kafka
 * 3. The EmailListener processes the event
 * 4. The EmailService sends a welcome email
 */
@DisplayName("Signup Email Flow E2E Tests")
class SignupEmailFlowE2ETest extends AbstractIntegrationTest {

    @MockitoSpyBean
    private EmailService emailService;

    @Test
    @DisplayName("Should send welcome email when user signs up")
    void shouldSendWelcomeEmailOnSignup() {
        String email = "welcome_email_test_" + System.currentTimeMillis() + "@test.com";
        String name = "Welcome Test User";

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
            .body("user.email", equalTo(email))
            .body("user.name", equalTo(name));

        // Wait for async Kafka event processing and email sending
        await()
            .atMost(10, TimeUnit.SECONDS)
            .pollInterval(500, TimeUnit.MILLISECONDS)
            .untilAsserted(() -> {
                verify(emailService, times(1)).sendWelcomeEmail(argThat(user ->
                    user != null &&
                    email.equals(user.getEmail()) &&
                    name.equals(user.getName())
                ));
            });
    }

    @Test
    @DisplayName("Should send welcome email with correct user details")
    void shouldSendWelcomeEmailWithCorrectUserDetails() {
        String email = "welcome_details_" + System.currentTimeMillis() + "@test.com";
        String name = "Details Test User";

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
            .statusCode(201);

        // Wait for the welcome email to be sent
        ArgumentCaptor<com.example.myislandapi.model.UserModel> userCaptor =
            ArgumentCaptor.forClass(com.example.myislandapi.model.UserModel.class);

        await()
            .atMost(10, TimeUnit.SECONDS)
            .pollInterval(500, TimeUnit.MILLISECONDS)
            .untilAsserted(() -> {
                verify(emailService, atLeastOnce()).sendWelcomeEmail(userCaptor.capture());
            });

        // Verify the user details in the captured argument
        var capturedUsers = userCaptor.getAllValues();
        var ourUser = capturedUsers.stream()
            .filter(u -> email.equals(u.getEmail()))
            .findFirst()
            .orElseThrow(() -> new AssertionError("Expected user not found in captured emails"));

        assertThat(ourUser.getEmail()).isEqualTo(email);
        assertThat(ourUser.getName()).isEqualTo(name);
        assertThat(ourUser.getId()).isNotNull();
    }

    @Test
    @DisplayName("Should handle multiple signups sending multiple welcome emails")
    void shouldHandleMultipleSignupsWithMultipleWelcomeEmails() {
        String email1 = "multi_signup_1_" + System.currentTimeMillis() + "@test.com";
        String email2 = "multi_signup_2_" + System.currentTimeMillis() + "@test.com";

        // Register first user
        given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "email", email1,
                "password", "SecurePass123!",
                "name", "User One"
            ))
        .when()
            .post("/auth/register")
        .then()
            .statusCode(201);

        // Register second user
        given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "email", email2,
                "password", "SecurePass123!",
                "name", "User Two"
            ))
        .when()
            .post("/auth/register")
        .then()
            .statusCode(201);

        // Wait for both welcome emails to be sent
        await()
            .atMost(15, TimeUnit.SECONDS)
            .pollInterval(500, TimeUnit.MILLISECONDS)
            .untilAsserted(() -> {
                verify(emailService, atLeastOnce()).sendWelcomeEmail(argThat(user ->
                    user != null && email1.equals(user.getEmail())
                ));
                verify(emailService, atLeastOnce()).sendWelcomeEmail(argThat(user ->
                    user != null && email2.equals(user.getEmail())
                ));
            });
    }
}
