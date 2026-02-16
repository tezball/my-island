package com.myisland.loadtest.scenarios;

import com.myisland.loadtest.helpers.Auth;
import io.gatling.javaapi.core.ScenarioBuilder;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

public final class AdminScenario {

    private AdminScenario() {}

    public static final ScenarioBuilder scenario = scenario("Admin")
        .feed(csv("data/credentials.csv").circular())
        .doIf(session -> "admin".equals(session.getString("role"))).then(
            exec(Auth.loginFromSession())
            .pause(10, 15)
            .exec(
                http("Admin Dashboard")
                    .get("/admin/dashboard")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().is(200))
            )
            .pause(5, 8)
            .exec(
                http("Admin Users")
                    .get("/admin/users")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().is(200))
            )
            .pause(4, 7)
            .exec(
                http("Admin Bookings")
                    .get("/admin/bookings")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().is(200))
            )
            .pause(3, 5)
            .exec(
                http("Admin Owners")
                    .get("/admin/owners")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().is(200))
            )
            .pause(3, 5)
            .exec(
                http("Admin Feature Toggles")
                    .get("/admin/feature-toggles")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().is(200))
            )
        );
}
