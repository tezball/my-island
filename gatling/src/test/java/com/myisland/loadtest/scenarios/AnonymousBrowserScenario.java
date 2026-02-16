package com.myisland.loadtest.scenarios;

import io.gatling.javaapi.core.ScenarioBuilder;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

public final class AnonymousBrowserScenario {

    private AnonymousBrowserScenario() {}

    public static final ScenarioBuilder scenario = scenario("Anonymous Browser")
        .exec(
            http("List Campsites")
                .get("/campsites")
                .check(status().is(200))
                .check(jsonPath("$[0].id").optional().saveAs("campsiteId"))
        )
        .pause(3, 8)
        .exec(
            http("Featured Campsites")
                .get("/campsites/featured")
                .check(status().in(200, 404))
        )
        .pause(5, 10)
        .doIf(session -> session.contains("campsiteId")).then(
            exec(
                http("Get Campsite Details")
                    .get("/campsites/#{campsiteId}")
                    .check(status().is(200))
                    .check(jsonPath("$.ownerId").optional().saveAs("ownerId"))
            )
            .pause(3, 7)
            .exec(
                http("List Campsite Lots")
                    .get("/campsites/#{campsiteId}/lots")
                    .check(status().is(200))
                    .check(jsonPath("$[0].id").optional().saveAs("lotId"))
            )
            .pause(4, 8)
            .doIf(session -> session.contains("lotId")).then(
                exec(
                    http("Get Lot Details")
                        .get("/campsites/lots/#{lotId}")
                        .check(status().in(200, 404))
                )
                .pause(3, 6)
            )
            .doIf(session -> session.contains("ownerId")).then(
                exec(
                    http("Get Campsite Reviews")
                        .get("/reviews/campsite/#{ownerId}")
                        .check(status().in(200, 404))
                )
                .pause(3, 6)
            )
        )
        .exec(
            http("Browse Marketplace Offers")
                .get("/marketplace/offers")
                .check(status().is(200))
        )
        .pause(3, 6)
        .exec(
            http("Browse Suppliers")
                .get("/marketplace/suppliers")
                .check(status().is(200))
        )
        .pause(2, 5)
        .exec(
            http("Get Feature Toggles")
                .get("/feature-toggles/enabled")
                .check(status().is(200))
        );
}
