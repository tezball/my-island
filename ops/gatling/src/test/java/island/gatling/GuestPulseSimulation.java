package island.gatling;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;
import java.time.Duration;

/**
 * On-demand 100-customer pulse. Each user is held for ten minutes and keeps walking with think
 * time. Local default is the compose catalog. Jenkins {@code gatling-pulse} sets the public site
 * when someone starts that job. Not the H/15 trickle.
 */
public class GuestPulseSimulation extends Simulation {

  static final int HOLD_MINUTES = 10;

  private static String propOrEnv(String prop, String env, String fallback) {
    String fromProp = System.getProperty(prop);
    if (fromProp != null && !fromProp.isBlank()) {
      return fromProp.trim();
    }
    String fromEnv = System.getenv(env);
    if (fromEnv != null && !fromEnv.isBlank()) {
      return fromEnv.trim();
    }
    return fallback;
  }

  {
    String baseUrl =
        propOrEnv("gatling.baseUrl", "GATLING_BASE_URL", "http://127.0.0.1:8081")
            .replaceAll("/$", "");

    HttpProtocolBuilder httpProtocol =
        http.baseUrl(baseUrl)
            .acceptHeader("application/json")
            .contentTypeHeader("application/json")
            .userAgentHeader("my-island-gatling-pulse");

    ScenarioBuilder customers =
        scenario("guest-pulse-100")
            .feed(listFeeder(PulseUsers.records(PulseUsers.POOL)).queue())
            .during(Duration.ofMinutes(HOLD_MINUTES))
            .on(GuestFeatureChains.walkOnce());

    setUp(customers.injectOpen(atOnceUsers(PulseUsers.POOL)))
        .protocols(httpProtocol)
        .assertions(
            global().successfulRequests().percent().gte(99.0),
            forAll().successfulRequests().percent().gte(99.0),
            global().responseTime().percentile(95.0).lte(5000));
  }
}
