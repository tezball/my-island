package island.gatling;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;

/**
 * Scheduled deploy check: ten seeded pulse users, one walk, not a 10-minute hold. Jenkins {@code
 * gatling-trickle} cron {@code H/15} points this at the public site.
 */
public class GuestTrickleSimulation extends Simulation {

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
        propOrEnv("gatling.baseUrl", "GATLING_BASE_URL", "https://fishing-journals.com")
            .replaceAll("/$", "");

    HttpProtocolBuilder httpProtocol =
        http.baseUrl(baseUrl)
            .acceptHeader("application/json")
            .contentTypeHeader("application/json")
            .userAgentHeader("my-island-gatling-trickle");

    ScenarioBuilder guests =
        scenario("guest-trickle")
            .feed(listFeeder(PulseUsers.records(PulseUsers.TRICKLE)).queue())
            .exec(GuestFeatureChains.walkOnce());

    setUp(guests.injectOpen(atOnceUsers(PulseUsers.TRICKLE)))
        .protocols(httpProtocol)
        .assertions(
            global().successfulRequests().percent().is(100.0),
            global().failedRequests().count().is(0L));
  }
}
