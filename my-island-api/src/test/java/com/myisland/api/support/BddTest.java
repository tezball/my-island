package com.myisland.api.support;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

/**
 * Base class for BDD-style integration tests with Testcontainers.
 * Provides Given-When-Then structure for API testing.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
@Import(TestContainersConfig.class)
public abstract class BddTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    protected ResultActions result;
    protected String authToken;

    /**
     * Reset state before each test scenario
     */
    protected void resetScenario() {
        result = null;
        authToken = null;
    }

    /**
     * Delete all rows from the given tables (in order) using TRUNCATE CASCADE.
     */
    protected void truncateTables(String... tables) {
        for (String table : tables) {
            jdbcTemplate.execute("TRUNCATE TABLE " + table + " CASCADE");
        }
    }

    /**
     * Print result for debugging
     */
    protected void debugResult() throws Exception {
        if (result != null) {
            result.andDo(print());
        }
    }
}
