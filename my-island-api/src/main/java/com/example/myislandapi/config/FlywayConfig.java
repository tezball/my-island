package com.example.myislandapi.config;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@org.springframework.context.annotation.Profile("!test")
public class FlywayConfig {

    private static final Logger log = LoggerFactory.getLogger(FlywayConfig.class);

    /**
     * Configure Flyway to handle schema creation and seeding.
     * V1__init.sql contains both schema DDL and seed data.
     * Hibernate ddl-auto is set to 'none' - Flyway is the source of truth.
     */
    @Bean
    public Flyway flyway(DataSource dataSource) {
        log.info("Configuring Flyway - handles both schema creation and seed data");
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .cleanDisabled(false)
                .load();

        log.info("Running Flyway migrations (schema + seed data)...");
        flyway.migrate();
        log.info("Flyway migrations completed");

        return flyway;
    }
}
