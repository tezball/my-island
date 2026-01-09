package gatling;

import gatling.scenarios.AuthScenarios;
import gatling.scenarios.BookingScenarios;
import gatling.scenarios.BrowseScenarios;
import gatling.scenarios.FavoritesReviewsScenarios;
import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;

import static gatling.GatlingConfig.*;
import static io.gatling.javaapi.core.CoreDsl.*;

/**
 * Smoke test simulation - quick validation that the application is working.
 *
 * Runs a small number of users through all major flows to verify functionality.
 * Use this for quick validation before full load tests.
 *
 * Run with:
 *   mvn gatling:test -Dgatling.simulationClass=gatling.SmokeTestSimulation
 */
public class SmokeTestSimulation extends Simulation {

    // Quick browse test
    ScenarioBuilder browseTest = scenario("Smoke - Browse")
            .exec(BrowseScenarios.browseCampsites)
            .exec(BrowseScenarios.viewCampsiteDetails)
            .exec(BrowseScenarios.viewCampsiteLots)
            .exec(BrowseScenarios.viewOffers);

    // Quick auth test
    ScenarioBuilder authTest = scenario("Smoke - Auth")
            .exec(AuthScenarios.signup)
            .exec(AuthScenarios.getCurrentUser)
            .exec(AuthScenarios.loginWithSessionCredentials);

    // Quick booking test
    ScenarioBuilder bookingTest = scenario("Smoke - Booking")
            .exec(AuthScenarios.signup)
            .exec(BrowseScenarios.browseCampsites)
            .exec(BrowseScenarios.viewCampsiteLots)
            .exec(BookingScenarios.createBooking)
            .exec(BookingScenarios.viewMyBookings);

    // Quick favorites test
    ScenarioBuilder favoritesTest = scenario("Smoke - Favorites")
            .exec(AuthScenarios.loginWithDemoUser)
            .exec(BrowseScenarios.browseCampsites)
            .exec(FavoritesReviewsScenarios.addToFavorites)
            .exec(FavoritesReviewsScenarios.viewMyFavorites);

    // Owner test
    ScenarioBuilder ownerTest = scenario("Smoke - Owner")
            .exec(AuthScenarios.loginAsOwner)
            .exec(BookingScenarios.ownerViewStats)
            .exec(BookingScenarios.ownerViewCampsites)
            .exec(BookingScenarios.ownerViewBookings);

    {
        setUp(
                browseTest.injectOpen(atOnceUsers(2)),
                authTest.injectOpen(atOnceUsers(1)),
                bookingTest.injectOpen(atOnceUsers(1)),
                favoritesTest.injectOpen(atOnceUsers(1)),
                ownerTest.injectOpen(atOnceUsers(1))
        ).protocols(httpProtocol)
                .assertions(
                        global().successfulRequests().percent().gt(90.0),
                        global().responseTime().max().lt(10000)
                );
    }
}
