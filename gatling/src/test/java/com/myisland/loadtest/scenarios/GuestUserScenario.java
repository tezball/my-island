package com.myisland.loadtest.scenarios;

import com.myisland.loadtest.helpers.Auth;
import io.gatling.javaapi.core.ScenarioBuilder;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

public final class GuestUserScenario {

    private GuestUserScenario() {}

    public static final ScenarioBuilder scenario = scenario("Guest User")
        .feed(csv("data/credentials.csv").circular())
        .doIf(session -> "guest".equals(session.getString("role"))).then(
            exec(Auth.loginFromSession())
            .pause(1, 3)
            .exec(
                http("Unread Notification Count")
                    .get("/notifications/unread-count")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().in(200, 404))
            )
            .pause(2, 4)
            .exec(
                http("List Notifications")
                    .get("/notifications")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().in(200, 404))
            )
            .pause(5, 10)
            .exec(
                http("My Bookings")
                    .get("/bookings")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().is(200))
            )
            .pause(4, 8)
            .exec(
                http("Browse Campsites")
                    .get("/campsites")
                    .check(status().is(200))
                    .check(jsonPath("$[0].id").optional().saveAs("campsiteId"))
            )
            .doIf(session -> session.contains("campsiteId")).then(
                pause(4, 8)
                .exec(
                    http("Campsite Lots")
                        .get("/campsites/#{campsiteId}/lots")
                        .check(status().is(200))
                        .check(jsonPath("$[0].id").optional().saveAs("lotId"))
                )
                .doIf(session -> session.contains("lotId")).then(
                    pause(2, 4)
                    .exec(
                        http("Save Lot")
                            .post("/saved/#{lotId}")
                            .header("Authorization", "Bearer #{jwtToken}")
                            .check(status().in(200, 201, 409))
                    )
                    .pause(3, 5)
                    .exec(
                        http("List Saved Lots")
                            .get("/saved")
                            .header("Authorization", "Bearer #{jwtToken}")
                            .check(status().is(200))
                    )
                    .pause(2, 4)
                    .exec(
                        http("Unsave Lot")
                            .delete("/saved/#{lotId}")
                            .header("Authorization", "Bearer #{jwtToken}")
                            .check(status().in(200, 204, 404))
                    )
                )
            )
        );
}
