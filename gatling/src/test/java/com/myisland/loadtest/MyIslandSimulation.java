package com.myisland.loadtest;

import com.myisland.loadtest.scenarios.*;
import io.gatling.javaapi.core.PopulationBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

public class MyIslandSimulation extends Simulation {

    private final String baseUrl = System.getProperty("baseUrl", "http://localhost:8080/api");
    private final String profile = System.getProperty("profile", "smoke");

    private final HttpProtocolBuilder httpProtocol = http
        .baseUrl(baseUrl)
        .acceptHeader("application/json")
        .contentTypeHeader("application/json")
        .userAgentHeader("MyIsland-LoadTest/1.0");

    public MyIslandSimulation() {
        List<PopulationBuilder> populations = buildPopulations();

        setUp(populations.toArray(new PopulationBuilder[0]))
            .protocols(httpProtocol)
            .assertions(
                global().responseTime().percentile(95.0).lt(2000),
                global().failedRequests().percent().lt(1.0),
                details("Login").responseTime().percentile(95.0).lt(500),
                details("List Campsites").responseTime().percentile(95.0).lt(1000),
                details("Featured Campsites").responseTime().percentile(95.0).lt(1000),
                details("Browse Marketplace Offers").responseTime().percentile(95.0).lt(1000),
                details("Browse Suppliers").responseTime().percentile(95.0).lt(1000),
                details("Get Feature Toggles").responseTime().percentile(95.0).lt(1000)
            );
    }

    private List<PopulationBuilder> buildPopulations() {
        return switch (profile) {
            case "load" -> loadProfile();
            case "stress" -> stressProfile();
            default -> smokeProfile();
        };
    }

    private List<PopulationBuilder> smokeProfile() {
        List<PopulationBuilder> pops = new ArrayList<>();
        pops.add(
            AnonymousBrowserScenario.scenario.injectOpen(
                constantUsersPerSec(2).during(Duration.ofMinutes(1))
            )
        );
        pops.add(
            GuestUserScenario.scenario.injectOpen(
                constantUsersPerSec(1).during(Duration.ofMinutes(1))
            )
        );
        pops.add(
            OwnerScenario.scenario.injectOpen(
                constantUsersPerSec(0.2).during(Duration.ofMinutes(1))
            )
        );
        pops.add(
            SupplierScenario.scenario.injectOpen(
                constantUsersPerSec(0.1).during(Duration.ofMinutes(1))
            )
        );
        pops.add(
            AdminScenario.scenario.injectOpen(
                constantUsersPerSec(0.05).during(Duration.ofMinutes(1))
            )
        );
        return pops;
    }

    private List<PopulationBuilder> loadProfile() {
        Duration rampUp = Duration.ofMinutes(2);
        Duration hold = Duration.ofMinutes(6);
        Duration rampDown = Duration.ofMinutes(2);

        List<PopulationBuilder> pops = new ArrayList<>();
        pops.add(
            AnonymousBrowserScenario.scenario.injectOpen(
                rampUsersPerSec(0).to(30).during(rampUp),
                constantUsersPerSec(30).during(hold),
                rampUsersPerSec(30).to(0).during(rampDown)
            )
        );
        pops.add(
            GuestUserScenario.scenario.injectOpen(
                rampUsersPerSec(0).to(10).during(rampUp),
                constantUsersPerSec(10).during(hold),
                rampUsersPerSec(10).to(0).during(rampDown)
            )
        );
        pops.add(
            OwnerScenario.scenario.injectOpen(
                rampUsersPerSec(0).to(2).during(rampUp),
                constantUsersPerSec(2).during(hold),
                rampUsersPerSec(2).to(0).during(rampDown)
            )
        );
        pops.add(
            SupplierScenario.scenario.injectOpen(
                rampUsersPerSec(0).to(1).during(rampUp),
                constantUsersPerSec(1).during(hold),
                rampUsersPerSec(1).to(0).during(rampDown)
            )
        );
        pops.add(
            AdminScenario.scenario.injectOpen(
                rampUsersPerSec(0).to(0.5).during(rampUp),
                constantUsersPerSec(0.5).during(hold),
                rampUsersPerSec(0.5).to(0).during(rampDown)
            )
        );
        return pops;
    }

    private List<PopulationBuilder> stressProfile() {
        Duration rampUp = Duration.ofMinutes(5);
        Duration hold = Duration.ofMinutes(5);
        Duration spike = Duration.ofMinutes(2);
        Duration cooldown = Duration.ofMinutes(3);

        List<PopulationBuilder> pops = new ArrayList<>();
        pops.add(
            AnonymousBrowserScenario.scenario.injectOpen(
                rampUsersPerSec(0).to(100).during(rampUp),
                constantUsersPerSec(100).during(hold),
                rampUsersPerSec(100).to(150).during(spike),
                rampUsersPerSec(150).to(0).during(cooldown)
            )
        );
        pops.add(
            GuestUserScenario.scenario.injectOpen(
                rampUsersPerSec(0).to(30).during(rampUp),
                constantUsersPerSec(30).during(hold),
                rampUsersPerSec(30).to(45).during(spike),
                rampUsersPerSec(45).to(0).during(cooldown)
            )
        );
        pops.add(
            OwnerScenario.scenario.injectOpen(
                rampUsersPerSec(0).to(6).during(rampUp),
                constantUsersPerSec(6).during(hold),
                rampUsersPerSec(6).to(9).during(spike),
                rampUsersPerSec(9).to(0).during(cooldown)
            )
        );
        pops.add(
            SupplierScenario.scenario.injectOpen(
                rampUsersPerSec(0).to(4).during(rampUp),
                constantUsersPerSec(4).during(hold),
                rampUsersPerSec(4).to(6).during(spike),
                rampUsersPerSec(6).to(0).during(cooldown)
            )
        );
        pops.add(
            AdminScenario.scenario.injectOpen(
                rampUsersPerSec(0).to(2).during(rampUp),
                constantUsersPerSec(2).during(hold),
                rampUsersPerSec(2).to(3).during(spike),
                rampUsersPerSec(3).to(0).during(cooldown)
            )
        );
        return pops;
    }
}
