package gatling;

import gatling.scenarios.AuthScenarios;
import gatling.scenarios.BookingScenarios;
import gatling.scenarios.BrowseScenarios;
import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;

import static gatling.GatlingConfig.*;
import static io.gatling.javaapi.core.CoreDsl.*;

/**
 * Stress test simulation - finds the breaking point of the application.
 *
 * Gradually increases load until the system starts failing.
 * Use this to determine maximum capacity.
 *
 * Run with:
 *   mvn gatling:test -Dgatling.simulationClass=gatling.StressTestSimulation
 */
public class StressTestSimulation extends Simulation {

    // High-volume browsing
    ScenarioBuilder stressBrowse = scenario("Stress - Browse")
            .forever().on(
                    exec(BrowseScenarios.browseCampsites)
                            .exec(BrowseScenarios.viewCampsiteDetails)
                            .exec(BrowseScenarios.viewCampsiteLots)
                            .pause(MIN_PAUSE)
            );

    // High-volume search
    ScenarioBuilder stressSearch = scenario("Stress - Search")
            .forever().on(
                    exec(BrowseScenarios.searchByCounty)
                            .exec(BrowseScenarios.searchWithDates)
                            .pause(MIN_PAUSE)
            );

    // High-volume auth
    ScenarioBuilder stressAuth = scenario("Stress - Auth")
            .forever().on(
                    exec(AuthScenarios.signup)
                            .exec(AuthScenarios.getCurrentUser)
                            .pause(MIN_PAUSE)
            );

    // High-volume bookings
    ScenarioBuilder stressBookings = scenario("Stress - Bookings")
            .forever().on(
                    exec(AuthScenarios.signup)
                            .exec(BrowseScenarios.browseCampsites)
                            .exec(BrowseScenarios.viewCampsiteLots)
                            .exec(BookingScenarios.createBooking)
                            .pause(MIN_PAUSE)
            );

    {
        setUp(
                // Gradually increase load over time
                stressBrowse.injectOpen(
                        rampUsersPerSec(1).to(20).during(180), // 0-20 users over 3 min
                        constantUsersPerSec(20).during(60)     // Hold at 20 for 1 min
                ),

                stressSearch.injectOpen(
                        nothingFor(30),
                        rampUsersPerSec(1).to(15).during(150),
                        constantUsersPerSec(15).during(60)
                ),

                stressAuth.injectOpen(
                        nothingFor(60),
                        rampUsersPerSec(0.5).to(10).during(120),
                        constantUsersPerSec(10).during(60)
                ),

                stressBookings.injectOpen(
                        nothingFor(90),
                        rampUsersPerSec(0.5).to(5).during(90),
                        constantUsersPerSec(5).during(60)
                )
        ).protocols(httpProtocol)
                .maxDuration(300); // Max 5 minutes
    }
}
