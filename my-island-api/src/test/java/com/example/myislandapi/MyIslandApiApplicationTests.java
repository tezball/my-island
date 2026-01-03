package com.example.myislandapi;

import com.example.myislandapi.config.TestcontainersConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertTrue;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@ActiveProfiles("test")
class MyIslandApiApplicationTests {

    @Test
    void contextLoads() {
        // Verify Spring context loads successfully with PostgreSQL
        assertTrue(true, "Application context should load");
    }
}
