package gatling;

import io.gatling.javaapi.core.FeederBuilder;
import io.gatling.javaapi.http.HttpProtocolBuilder;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

/**
 * Gatling configuration for My Island load testing.
 */
public final class GatlingConfig {

    // Base URL - configurable via system property
    public static final String BASE_URL = System.getProperty("baseUrl", "http://localhost:8080");

    // Common HTTP protocol configuration
    public static HttpProtocolBuilder httpProtocol = http
            .baseUrl(BASE_URL)
            .acceptHeader("application/json")
            .contentTypeHeader("application/json")
            .acceptEncodingHeader("gzip, deflate")
            .userAgentHeader("Gatling/MyIsland-LoadTest");

    // Feeder for generating unique user data
    @SuppressWarnings("unchecked")
    public static FeederBuilder<Object> userFeeder = listFeeder(
            java.util.stream.IntStream.range(0, 10000)
                    .mapToObj(i -> java.util.Map.of(
                            "email", (Object) ("loadtest_user_" + i + "_" + System.currentTimeMillis() + "@test.com"),
                            "password", (Object) "LoadTest1234",
                            "name", (Object) ("Load Test User " + i)
                    ))
                    .toList()
    ).random();

    // Known demo accounts for authenticated scenarios
    public static final String DEMO_USER_EMAIL = "visitor@my-island.com";
    public static final String DEMO_USER_PASSWORD = "demo1234";
    public static final String DEMO_OWNER_EMAIL = "owner@my-island.com";
    public static final String DEMO_OWNER_PASSWORD = "demo1234";

    // Timing configurations (in seconds)
    public static final int MIN_PAUSE = 1;
    public static final int MAX_PAUSE = 3;
    public static final int PAGE_LOAD_PAUSE = 2;

    private GatlingConfig() {
        // Utility class
    }
}
