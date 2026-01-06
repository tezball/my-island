package com.example.myislandapi.config;

import jakarta.persistence.EntityManagerFactory;
import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@org.springframework.context.annotation.Profile("!test")
public class FlywayConfig {

    private static final Logger log = LoggerFactory.getLogger(FlywayConfig.class);

    /**
     * Configure Flyway to run AFTER Hibernate creates the schema.
     * Schema migrations (V1-V11) are skipped by setting baseline to V11.
     * Only seed data migrations (V12+) are executed.
     */
    @Bean
    @DependsOn("entityManagerFactory")
    public Flyway flyway(DataSource dataSource, EntityManagerFactory entityManagerFactory) {
        log.info("Configuring Flyway - schema created by Hibernate, Flyway handles seed data");
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .baselineVersion("25")  // Skip old migrations, only run V26+
                .cleanDisabled(false)
                .load();

        log.info("Running Flyway seed data migrations (V12+)...");
        flyway.migrate();
        log.info("Flyway migrations completed");

        return flyway;
    }
}
