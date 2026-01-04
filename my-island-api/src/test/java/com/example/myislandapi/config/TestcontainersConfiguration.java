package com.example.myislandapi.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.localstack.LocalStackContainer;
import org.testcontainers.utility.DockerImageName;

/**
 * Test configuration that provides shared Testcontainers as Spring beans.
 * Uses singleton pattern to ensure containers are reused across all test classes.
 */
@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfiguration {

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

        // Register shutdown hook
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            POSTGRES.stop();
            KAFKA.stop();
            LOCALSTACK.stop();
        }));
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
}
