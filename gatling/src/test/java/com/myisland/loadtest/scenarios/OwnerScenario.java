package com.myisland.loadtest.scenarios;

import com.myisland.loadtest.helpers.Auth;
import io.gatling.javaapi.core.ScenarioBuilder;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

public final class OwnerScenario {

    private OwnerScenario() {}

    public static final ScenarioBuilder scenario = scenario("Owner")
        .feed(csv("data/credentials.csv").circular())
        .doIf(session -> "owner".equals(session.getString("role"))).then(
            exec(Auth.loginFromSession())
            .pause(8, 15)
            .exec(
                http("Owner Dashboard")
                    .get("/owner/dashboard")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().in(200, 404))
            )
            .pause(3, 6)
            .exec(
                http("Today's Bookings")
                    .get("/owner/bookings/today")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().in(200, 404))
            )
            .pause(5, 10)
            .exec(
                http("All Owner Bookings")
                    .get("/owner/bookings")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().is(200))
            )
            .pause(4, 8)
            .exec(
                http("Owner Lots")
                    .get("/owner/lots")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().is(200))
            )
            .pause(3, 5)
            .exec(
                http("Owner Reviews")
                    .get("/owner/reviews")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().in(200, 404))
            )
            .pause(3, 5)
            .exec(
                http("Owner Modification Requests")
                    .get("/owner/modification-requests")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().in(200, 404))
            )
        );
}
