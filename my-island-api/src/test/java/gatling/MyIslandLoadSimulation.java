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
 * Main Gatling simulation for My Island application.
 *
 * This simulation covers the following user flows:
 * 1. Anonymous browsing (viewing campsites, searching)
 * 2. User signup and login
 * 3. Authenticated user actions (favorites, bookings)
 * 4. Owner dashboard activities
 *
 * Run with:
 *   mvn gatling:test
 *
 * Or with custom base URL:
 *   mvn gatling:test -DbaseUrl=http://localhost:8080
 */
public class MyIslandLoadSimulation extends Simulation {

    // ==================== SCENARIOS ====================

    /**
     * Anonymous user browsing the site.
     * Simulates a visitor who browses campsites without logging in.
     */
    ScenarioBuilder anonymousBrowsingScenario = scenario("Anonymous Browsing")
            .exec(BrowseScenarios.browseCampsites)
            .pause(PAGE_LOAD_PAUSE)
            .exec(BrowseScenarios.viewCampsiteDetails)
            .exec(BrowseScenarios.viewCampsiteLots)
            .pause(MIN_PAUSE, MAX_PAUSE)
            .exec(BrowseScenarios.searchByCounty)
            .exec(BrowseScenarios.viewOffers)
            .exec(BrowseScenarios.viewLocalBusinesses);

    /**
     * New user signup flow.
     * Creates account, browses, and adds favorites.
     */
    ScenarioBuilder newUserSignupScenario = scenario("New User Signup")
            .exec(AuthScenarios.signup)
            .exec(AuthScenarios.getCurrentUser)
            .pause(MIN_PAUSE, MAX_PAUSE)
            .exec(BrowseScenarios.browseCampsites)
            .exec(BrowseScenarios.viewCampsiteDetails)
            .exec(FavoritesReviewsScenarios.addToFavorites)
            .exec(FavoritesReviewsScenarios.viewMyFavorites);

    /**
     * Returning user login and browse.
     * Logs in with demo account and browses.
     */
    ScenarioBuilder returningUserScenario = scenario("Returning User")
            .exec(AuthScenarios.loginWithDemoUser)
            .exec(AuthScenarios.getCurrentUser)
            .pause(MIN_PAUSE)
            .exec(FavoritesReviewsScenarios.viewMyFavorites)
            .exec(BookingScenarios.viewMyBookings)
            .pause(MIN_PAUSE, MAX_PAUSE)
            .exec(BrowseScenarios.browseCampsites)
            .exec(BrowseScenarios.viewCampsiteDetails)
            .exec(BrowseScenarios.viewCampsiteLots)
            .exec(BrowseScenarios.viewCampsiteReviews);

    /**
     * User booking flow.
     * Logs in, browses, and creates a booking.
     */
    ScenarioBuilder bookingFlowScenario = scenario("Booking Flow")
            .exec(AuthScenarios.signup)
            .pause(MIN_PAUSE)
            .exec(BrowseScenarios.browseCampsites)
            .exec(BrowseScenarios.viewCampsiteDetails)
            .exec(BrowseScenarios.viewCampsiteLots)
            .exec(BrowseScenarios.checkAvailability)
            .pause(PAGE_LOAD_PAUSE)
            .exec(BookingScenarios.createBooking)
            .exec(BookingScenarios.viewMyBookings)
            .exec(BookingScenarios.viewBookingDetails);

    /**
     * Favorites flow.
     * User adds and removes favorites.
     */
    ScenarioBuilder favoritesFlowScenario = scenario("Favorites Flow")
            .exec(AuthScenarios.loginWithDemoUser)
            .exec(BrowseScenarios.browseCampsites)
            .exec(FavoritesReviewsScenarios.addToFavorites)
            .exec(FavoritesReviewsScenarios.viewMyFavorites)
            .pause(MAX_PAUSE)
            .exec(FavoritesReviewsScenarios.removeFromFavorites)
            .exec(FavoritesReviewsScenarios.viewMyFavorites);

    /**
     * Owner dashboard flow.
     * Owner logs in and manages their properties.
     */
    ScenarioBuilder ownerDashboardScenario = scenario("Owner Dashboard")
            .exec(AuthScenarios.loginAsOwner)
            .exec(AuthScenarios.getCurrentUser)
            .pause(MIN_PAUSE)
            .exec(BookingScenarios.ownerViewStats)
            .exec(BookingScenarios.ownerViewCampsites)
            .exec(BookingScenarios.ownerViewBookings)
            .pause(MIN_PAUSE, MAX_PAUSE)
            .repeat(3).on(
                    exec(BookingScenarios.ownerViewStats)
                            .pause(MAX_PAUSE)
            );

    /**
     * Search-heavy user.
     * User performs many searches with different filters.
     */
    ScenarioBuilder searchHeavyScenario = scenario("Search Heavy User")
            .repeat(5).on(
                    exec(BrowseScenarios.browseCampsites)
                            .exec(BrowseScenarios.searchByCounty)
                            .exec(BrowseScenarios.searchWithDates)
                            .pause(MIN_PAUSE, MAX_PAUSE)
            );

    // ==================== LOAD PROFILES ====================

    {
        setUp(
                // Anonymous browsing - highest load (most common user behavior)
                anonymousBrowsingScenario.injectOpen(
                        rampUsers(10).during(30),           // Warm up
                        constantUsersPerSec(2).during(120), // Steady state
                        rampUsersPerSec(2).to(5).during(60) // Ramp up
                ),

                // New user signups - moderate load
                newUserSignupScenario.injectOpen(
                        nothingFor(10),                      // Wait for system to warm up
                        rampUsers(5).during(30),             // Gradual increase
                        constantUsersPerSec(0.5).during(120) // Steady signups
                ),

                // Returning users - steady load
                returningUserScenario.injectOpen(
                        nothingFor(15),
                        rampUsers(8).during(30),
                        constantUsersPerSec(1).during(120)
                ),

                // Booking flow - lower load (high value actions)
                bookingFlowScenario.injectOpen(
                        nothingFor(20),
                        rampUsers(3).during(30),
                        constantUsersPerSec(0.3).during(120)
                ),

                // Favorites flow - moderate load
                favoritesFlowScenario.injectOpen(
                        nothingFor(15),
                        rampUsers(5).during(30),
                        constantUsersPerSec(0.5).during(120)
                ),

                // Owner dashboard - low load (fewer owners than users)
                ownerDashboardScenario.injectOpen(
                        nothingFor(10),
                        rampUsers(2).during(30),
                        constantUsersPerSec(0.2).during(120)
                ),

                // Search heavy users - moderate load
                searchHeavyScenario.injectOpen(
                        nothingFor(5),
                        rampUsers(5).during(30),
                        constantUsersPerSec(0.5).during(120)
                )
        ).protocols(httpProtocol)
                .assertions(
                        // Global assertions
                        global().responseTime().max().lt(5000),     // Max response time < 5s
                        global().responseTime().mean().lt(1000),    // Mean response time < 1s
                        global().successfulRequests().percent().gt(95.0), // >95% success rate
                        global().requestsPerSec().gt(10.0)          // At least 10 req/sec
                );
    }
}
