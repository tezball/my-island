package com.myisland.loadtest.scenarios;

import com.myisland.loadtest.helpers.Auth;
import io.gatling.javaapi.core.ScenarioBuilder;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

public final class SupplierScenario {

    private SupplierScenario() {}

    public static final ScenarioBuilder scenario = scenario("Supplier")
        .feed(csv("data/credentials.csv").circular())
        .doIf(session -> "supplier".equals(session.getString("role"))).then(
            exec(Auth.loginFromSession())
            .pause(6, 12)
            .exec(
                http("Supplier Dashboard")
                    .get("/supplier/dashboard")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().in(200, 404))
            )
            .pause(4, 8)
            .exec(
                http("Supplier Offers")
                    .get("/supplier/offers")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().is(200))
            )
            .pause(3, 6)
            .exec(
                http("Supplier Claims")
                    .get("/supplier/claims")
                    .header("Authorization", "Bearer #{jwtToken}")
                    .check(status().in(200, 404))
            )
        );
}
