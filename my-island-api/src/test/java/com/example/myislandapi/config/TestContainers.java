package com.example.myislandapi.config;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.localstack.LocalStackContainer;
import org.testcontainers.utility.DockerImageName;

/**
 * Shared test containers for integration tests.
 * Uses singleton pattern to reuse containers across test classes.
 */
public final class TestContainers {

    private static volatile boolean started = false;

    public static final PostgreSQLContainer<?> postgres;
    public static final KafkaContainer kafka;
    public static final LocalStackContainer localstack;

    static {
        postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:17-alpine"))
                .withDatabaseName("myisland_test")
                .withUsername("test")
                .withPassword("test");

        kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"));

        localstack = new LocalStackContainer(DockerImageName.parse("localstack/localstack:3.0"))
                .withServices(LocalStackContainer.Service.S3, LocalStackContainer.Service.SES);
    }

    private TestContainers() {}

    public static synchronized void startAll() {
        if (!started) {
            postgres.start();
            kafka.start();
            localstack.start();
            started = true;

            // Register shutdown hook to clean up containers
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                postgres.stop();
                kafka.stop();
                localstack.stop();
            }));
        }

        // Verify containers are actually running
        if (!postgres.isRunning()) {
            throw new IllegalStateException("PostgreSQL container failed to start");
        }
        if (!kafka.isRunning()) {
            throw new IllegalStateException("Kafka container failed to start");
        }
        if (!localstack.isRunning()) {
            throw new IllegalStateException("LocalStack container failed to start");
        }
    }

    /**
     * Register all container properties. Call this from @DynamicPropertySource in each test class.
     */
    public static void registerProperties(DynamicPropertyRegistry registry) {
        startAll();

        // PostgreSQL
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);

        // Kafka
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);

        // LocalStack S3/SES
        registry.add("aws.endpoint", () -> localstack.getEndpoint().toString());
        registry.add("aws.s3.endpoint", () ->
            localstack.getEndpointOverride(LocalStackContainer.Service.S3).toString());
    }
}
