package island.gatling;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.ChainBuilder;

/**
 * One named chain per shipped customer API. A new feature adds a chain here and {@link #walkOnce()}
 * runs it. Both the 10-user trickle and the 100-user pulse use this walk. See
 * {@code docs/ops/workflow/GATLING.md}.
 */
public final class GuestFeatureChains {

  static final int THINK_SECONDS = 1;

  private GuestFeatureChains() {}

  public static ChainBuilder walkOnce() {
    return exec(health())
        .exec(listPublishedPlaces())
        .exec(getPlace())
        .exec(listCounties())
        .exec(listCategories())
        .exec(passwordLogin())
        .exec(me())
        .exec(saveVisitIntent())
        .exec(getVisitIntent())
        .exec(listVisitIntents())
        .exec(logout());
  }

  /** Actuator health. */
  public static ChainBuilder health() {
    return exec(
            http("health")
                .get("/actuator/health")
                .check(status().is(200))
                .check(jsonPath("$.status").is("UP")))
        .pause(THINK_SECONDS);
  }

  /** Published directory list. */
  public static ChainBuilder listPublishedPlaces() {
    return exec(
            http("list-places")
                .get("/api/v1/places?published=true")
                .check(status().is(200))
                .check(jsonPath("$[0].id").saveAs("placeId")))
        .pause(THINK_SECONDS);
  }

  /** One published place. */
  public static ChainBuilder getPlace() {
    return exec(
            http("get-place")
                .get("/api/v1/places/#{placeId}")
                .check(status().is(200))
                .check(jsonPath("$.id").exists())
                .check(jsonPath("$.slug").exists())
                .check(jsonPath("$.beenCount").exists()))
        .pause(THINK_SECONDS);
  }

  /** County lookup used by the directory. */
  public static ChainBuilder listCounties() {
    return exec(
            http("list-counties")
                .get("/api/v1/counties")
                .check(status().is(200))
                .check(jsonPath("$[0].id").exists())
                .check(jsonPath("$[0].name").exists()))
        .pause(THINK_SECONDS);
  }

  /** Category lookup. */
  public static ChainBuilder listCategories() {
    return exec(
            http("list-categories")
                .get("/api/v1/categories")
                .check(status().is(200))
                .check(jsonPath("$[0].id").exists())
                .check(jsonPath("$[0].label").exists()))
        .pause(THINK_SECONDS);
  }

  /** Seeded password login for this virtual user. */
  public static ChainBuilder passwordLogin() {
    return exec(
            session -> {
              String body =
                  "{\"username\":\""
                      + jsonString(session.getString("username"))
                      + "\",\"password\":\""
                      + jsonString(session.getString("password"))
                      + "\"}";
              return session.set("loginJson", body);
            })
        .exec(
            http("password-login")
                .post("/api/auth/login")
                .body(StringBody("#{loginJson}"))
                .asJson()
                .check(status().in(200, 204)))
        .pause(THINK_SECONDS);
  }

  /** Signed-in profile. */
  public static ChainBuilder me() {
    return exec(
            http("me").get("/api/v1/me").check(status().is(200)).check(jsonPath("$.id").exists()))
        .pause(THINK_SECONDS);
  }

  /** Save a visit intent on the place this customer opened. */
  public static ChainBuilder saveVisitIntent() {
    return exec(
            http("save-visit-intent")
                .put("/api/v1/me/places/#{placeId}/visit-intent")
                .body(StringBody("{\"mark\":\"want\"}"))
                .asJson()
                .check(status().is(200))
                .check(jsonPath("$.mark").is("want")))
        .pause(THINK_SECONDS);
  }

  /** Read that intent back. */
  public static ChainBuilder getVisitIntent() {
    return exec(
            http("get-visit-intent")
                .get("/api/v1/me/places/#{placeId}/visit-intent")
                .check(status().is(200))
                .check(jsonPath("$.mark").is("want")))
        .pause(THINK_SECONDS);
  }

  /** Private intent list, including the want filter the client uses. */
  public static ChainBuilder listVisitIntents() {
    return exec(
            http("list-intents")
                .get("/api/v1/me/visit-intents")
                .check(status().is(200))
                .check(jsonPath("$[0].placeId").exists()))
        .exec(
            http("list-intents-want")
                .get("/api/v1/me/visit-intents?mark=want")
                .check(status().is(200))
                .check(jsonPath("$[0].mark").is("want")))
        .pause(THINK_SECONDS);
  }

  /** End this customer's session. */
  public static ChainBuilder logout() {
    return exec(http("logout").post("/api/auth/logout").check(status().is(204)))
        .pause(THINK_SECONDS);
  }

  private static String jsonString(String value) {
    if (value == null) {
      return "";
    }
    return value.replace("\\", "\\\\").replace("\"", "\\\"");
  }
}
