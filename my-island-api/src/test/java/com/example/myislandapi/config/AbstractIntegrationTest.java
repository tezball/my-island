package com.example.myislandapi.config;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.localstack.LocalStackContainer;
import org.testcontainers.lifecycle.Startables;
import org.testcontainers.utility.DockerImageName;

import com.example.myislandapi.fixture.TestDataSeeder;

import java.util.Map;

import static io.restassured.RestAssured.given;

/**
 * Base class for ALL E2E and integration tests.
 * Provides shared Testcontainers infrastructure using singleton pattern.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

    // Singleton containers - shared across all tests for performance
    static final PostgreSQLContainer<?> POSTGRES;
    static final KafkaContainer KAFKA;
    static final LocalStackContainer LOCALSTACK;

    static {
        POSTGRES = new PostgreSQLContainer<>(DockerImageName.parse("postgres:17-alpine"))
                .withDatabaseName("myisland_test")
                .withUsername("test")
                .withPassword("test")
                .withReuse(true);

        KAFKA = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"))
                .withReuse(true);

        LOCALSTACK = new LocalStackContainer(DockerImageName.parse("localstack/localstack:3.0"))
                .withServices(LocalStackContainer.Service.S3, LocalStackContainer.Service.SES)
                .withReuse(true);

        // Start all containers in parallel for faster startup
        Startables.deepStart(POSTGRES, KAFKA, LOCALSTACK).join();
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // PostgreSQL
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);

        // Kafka
        registry.add("spring.kafka.bootstrap-servers", KAFKA::getBootstrapServers);

        // LocalStack S3/SES
        registry.add("aws.endpoint", () -> LOCALSTACK.getEndpoint().toString());
        registry.add("aws.s3.endpoint", () ->
            LOCALSTACK.getEndpointOverride(LocalStackContainer.Service.S3).toString());
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
