package com.example.myislandapi.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.MapPropertySource;
import org.testcontainers.containers.localstack.LocalStackContainer;

import java.util.Map;

/**
 * ApplicationContextInitializer that starts Testcontainers and registers their properties.
 * This approach is more reliable than @DynamicPropertySource inheritance.
 */
public class TestContainersInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        TestContainers.startAll();

        Map<String, Object> properties = Map.of(
            "spring.datasource.url", TestContainers.postgres.getJdbcUrl(),
            "spring.datasource.username", TestContainers.postgres.getUsername(),
            "spring.datasource.password", TestContainers.postgres.getPassword(),
            "spring.kafka.bootstrap-servers", TestContainers.kafka.getBootstrapServers(),
            "aws.endpoint", TestContainers.localstack.getEndpoint().toString(),
            "aws.s3.endpoint", TestContainers.localstack.getEndpointOverride(LocalStackContainer.Service.S3).toString()
        );

        applicationContext.getEnvironment().getPropertySources()
            .addFirst(new MapPropertySource("testcontainers", properties));
    }
}
