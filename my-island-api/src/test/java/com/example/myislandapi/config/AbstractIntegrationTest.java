package com.example.myislandapi.config;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.localstack.LocalStackContainer;

import com.example.myislandapi.fixture.TestDataSeeder;

import java.util.Map;

import static io.restassured.RestAssured.given;

/**
 * Base class for ALL E2E and integration tests.
 * Uses shared Testcontainers via TestcontainersConfiguration to reuse
 * containers across all test classes for better performance and reliability.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestcontainersConfiguration.class)
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // PostgreSQL is auto-configured via @ServiceConnection
        // Configure Kafka and LocalStack properties
        registry.add("spring.kafka.bootstrap-servers",
                () -> TestcontainersConfiguration.getKafka().getBootstrapServers());
        registry.add("aws.endpoint",
                () -> TestcontainersConfiguration.getLocalstack().getEndpoint().toString());
        registry.add("aws.s3.endpoint",
                () -> TestcontainersConfiguration.getLocalstack()
                        .getEndpointOverride(LocalStackContainer.Service.S3).toString());
    }

    @LocalServerPort
    protected int port;

    @Autowired
    protected TestDataSeeder dataSeeder;

    @BeforeEach
    void setUpRestAssured() {
        RestAssured.port = port;
        RestAssured.basePath = "/api";
    }

    // ==================== Helper Methods ====================

    /**
     * Register a new user and return the access token.
     */
    protected String registerUser(String email, String password, String name) {
        Map<String, Object> request = Map.of(
                "email", email,
                "password", password,
                "name", name
        );

        return given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/auth/register")
                .then()
                .statusCode(201)
                .extract()
                .path("accessToken");
    }

    /**
     * Login and return the access token.
     */
    protected String login(String email, String password) {
        Map<String, Object> request = Map.of(
                "email", email,
                "password", password
        );

        return given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/auth/login")
                .then()
                .statusCode(200)
                .extract()
                .path("accessToken");
    }

    /**
     * Register a user and authenticate, returning the token.
     * Uses a unique email based on timestamp.
     */
    protected String authenticateNewUser() {
        String email = "user_" + System.currentTimeMillis() + "@test.com";
        return registerUser(email, "TestPass123!", "Test User");
    }

    /**
     * Create or get an existing owner user and return token.
     */
    protected String authenticateAsOwner() {
        return dataSeeder.createOwnerAndGetToken();
    }

    /**
     * Get a test user token using the data seeder.
     */
    protected String getTestUserToken() {
        return dataSeeder.createUserAndGetToken("testuser@test.com", false, false);
    }
}
