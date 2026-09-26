package island.gatling;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;

/** Five virtual users: health, list places, password login, VisitIntent upsert. Weekly perf. */
public class GuestWeeklySimulation extends Simulation {

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

  private static String jsonString(String value) {
    return value.replace("\\", "\\\\").replace("\"", "\\\"");
  }

  {
    String baseUrl =
        propOrEnv("gatling.baseUrl", "GATLING_BASE_URL", "https://fishing-journals.com")
            .replaceAll("/$", "");
    String username = propOrEnv("gatling.username", "CATALOG_SEED_GUEST_USERNAME", "guest");
    String password = propOrEnv("gatling.password", "CATALOG_SEED_GUEST_PASSWORD", "guest");
    String loginJson =
        "{\"username\":\""
            + jsonString(username)
            + "\",\"password\":\""
            + jsonString(password)
            + "\"}";

    HttpProtocolBuilder httpProtocol =
        http.baseUrl(baseUrl)
            .acceptHeader("application/json")
            .contentTypeHeader("application/json")
            .userAgentHeader("my-island-gatling-weekly");

    ScenarioBuilder guest =
        scenario("guest-weekly")
            .exec(
                http("health")
                    .get("/actuator/health")
                    .check(status().is(200))
                    .check(jsonPath("$.status").is("UP")))
            .exec(
                http("list-places")
                    .get("/api/v1/places?published=true")
                    .check(status().is(200))
                    .check(jsonPath("$[0].id").saveAs("placeId")))
            .exec(
                http("password-login")
                    .post("/api/auth/login")
                    .body(StringBody(loginJson))
                    .asJson()
                    .check(status().in(200, 204)))
            .exec(http("me").get("/api/v1/me").check(status().is(200)))
            .exec(
                http("upsert-want")
                    .put("/api/v1/me/places/#{placeId}/visit-intent")
                    .body(StringBody("{\"mark\":\"want\"}"))
                    .asJson()
                    .check(status().is(200))
                    .check(jsonPath("$.mark").is("want")))
            .exec(
                http("list-intents")
                    .get("/api/v1/me/visit-intents")
                    .check(status().is(200)));

    setUp(guest.injectOpen(atOnceUsers(5)))
        .protocols(httpProtocol)
        .assertions(
            global().successfulRequests().percent().is(100.0),
            global().failedRequests().count().is(0L));
  }
}
