package com.example.myislandapi.config;

import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.localstack.LocalStackContainer;
import org.testcontainers.utility.DockerImageName;

import javax.sql.DataSource;
import java.io.IOException;

/**
 * Test configuration that provides shared Testcontainers as Spring beans.
 * Uses singleton pattern to ensure containers are reused across all test classes.
 */
@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfiguration {

    private static final Logger log = LoggerFactory.getLogger(TestcontainersConfiguration.class);

    private static final PostgreSQLContainer<?> POSTGRES;
    private static final KafkaContainer KAFKA;
    private static final LocalStackContainer LOCALSTACK;

    static {
        POSTGRES = new PostgreSQLContainer<>(DockerImageName.parse("postgres:17-alpine"))
                .withDatabaseName("myisland_test")
                .withUsername("test")
                .withPassword("test");
        POSTGRES.start();

        KAFKA = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"));
        KAFKA.start();

        LOCALSTACK = new LocalStackContainer(DockerImageName.parse("localstack/localstack:3.0"))
                .withServices(LocalStackContainer.Service.S3, LocalStackContainer.Service.SES);
        LOCALSTACK.start();

        // Initialize LocalStack resources (S3 bucket, SES email identities)
        initializeLocalStackResources();

        // Initialize Kafka topics
        initializeKafkaTopics();

        // Register shutdown hook
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            POSTGRES.stop();
            KAFKA.stop();
            LOCALSTACK.stop();
        }));
    }

    /**
     * Initialize LocalStack resources for testing:
     * - S3 bucket for images
     * - SES verified email identities for sending emails
     */
    private static void initializeLocalStackResources() {
        try {
            // Create S3 bucket
            LOCALSTACK.execInContainer("awslocal", "s3", "mb", "s3://test-bucket");
            log.info("Created S3 bucket: test-bucket");

            // Verify SES email identities for sending emails
            LOCALSTACK.execInContainer("awslocal", "ses", "verify-email-identity",
                    "--email-address", "test@myisland.local");
            LOCALSTACK.execInContainer("awslocal", "ses", "verify-email-identity",
                    "--email-address", "noreply@myisland.local");
            log.info("Verified SES email identities for testing");
        } catch (IOException | InterruptedException e) {
            log.warn("Failed to initialize LocalStack resources: {}", e.getMessage());
        }
    }

    /**
     * Initialize Kafka topics for testing.
     * Creates topics and waits for them to be ready to avoid LEADER_NOT_AVAILABLE errors.
     */
    private static void initializeKafkaTopics() {
        try {
            String[] topics = {
                "email-events", "booking-events", "notification-events", "property-events",
                "user-events", "review-events", "favorite-events", "payment-events",
                "search-events", "analytics-events"
            };
            for (String topic : topics) {
                KAFKA.execInContainer(
                    "kafka-topics", "--create",
                    "--topic", topic,
                    "--partitions", "1",
                    "--replication-factor", "1",
                    "--bootstrap-server", "localhost:9092"
                );
            }
            // Wait for topics to be ready
            Thread.sleep(2000);
            log.info("Created Kafka topics for testing");
        } catch (IOException | InterruptedException e) {
            log.warn("Failed to initialize Kafka topics: {}", e.getMessage());
        }
    }

    // Static getters for @DynamicPropertySource access
    public static PostgreSQLContainer<?> getPostgres() {
        return POSTGRES;
    }

    public static KafkaContainer getKafka() {
        return KAFKA;
    }

    public static LocalStackContainer getLocalstack() {
        return LOCALSTACK;
    }

    @Bean
    @ServiceConnection
    public PostgreSQLContainer<?> postgresContainer() {
        return POSTGRES;
    }

    @Bean
    public KafkaContainer kafkaContainer() {
        return KAFKA;
    }

    @Bean
    public LocalStackContainer localstackContainer() {
        return LOCALSTACK;
    }

    /**
     * Configure Flyway for tests - runs migrations to create schema.
     * This ensures the database schema exists before tests run.
     */
    @Bean
    public Flyway flyway(DataSource dataSource) {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .cleanDisabled(false)
                .load();

        // Clean and migrate for a fresh test database
        flyway.clean();
        flyway.migrate();

        return flyway;
    }
}
