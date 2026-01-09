package gatling.scenarios;

import io.gatling.javaapi.core.ChainBuilder;

import static gatling.GatlingConfig.*;
import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

/**
 * Browsing scenarios: viewing campsites, searching, filtering.
 */
public final class BrowseScenarios {

    /**
     * Browse all campsites (paginated).
     */
    public static ChainBuilder browseCampsites = exec(
            http("Browse Campsites - Page 1")
                    .get("/api/campsites")
                    .queryParam("page", "0")
                    .queryParam("size", "12")
                    .check(status().is(200))
                    .check(jsonPath("$.content").exists())
                    .check(jsonPath("$.content[0].id").optional().saveAs("campsiteId"))
    ).pause(PAGE_LOAD_PAUSE);

    /**
     * Browse campsites with pagination.
     */
    public static ChainBuilder browseCampsitesPaginated = exec(
            http("Browse Campsites - Page 1")
                    .get("/api/campsites")
                    .queryParam("page", "0")
                    .queryParam("size", "12")
                    .check(status().is(200))
                    .check(jsonPath("$.content[0].id").optional().saveAs("campsiteId"))
    ).pause(PAGE_LOAD_PAUSE)
            .exec(
                    http("Browse Campsites - Page 2")
                            .get("/api/campsites")
                            .queryParam("page", "1")
                            .queryParam("size", "12")
                            .check(status().is(200))
            ).pause(PAGE_LOAD_PAUSE);

    /**
     * Search campsites by county.
     */
    public static ChainBuilder searchByCounty = exec(
            http("Search - Kerry County")
                    .get("/api/campsites")
                    .queryParam("county", "Kerry")
                    .check(status().is(200))
                    .check(jsonPath("$.content").exists())
    ).pause(MIN_PAUSE, MAX_PAUSE)
            .exec(
                    http("Search - Galway County")
                            .get("/api/campsites")
                            .queryParam("county", "Galway")
                            .check(status().is(200))
            ).pause(MIN_PAUSE, MAX_PAUSE)
            .exec(
                    http("Search - Cork County")
                            .get("/api/campsites")
                            .queryParam("county", "Cork")
                            .check(status().is(200))
            ).pause(MIN_PAUSE, MAX_PAUSE);

    /**
     * Search campsites with date filters.
     */
    public static ChainBuilder searchWithDates = exec(
            http("Search - With Dates")
                    .get("/api/campsites")
                    .queryParam("checkIn", "2026-07-01")
                    .queryParam("checkOut", "2026-07-05")
                    .queryParam("guests", "2")
                    .check(status().is(200))
                    .check(jsonPath("$.content").exists())
    ).pause(PAGE_LOAD_PAUSE);

    /**
     * View campsite details.
     */
    public static ChainBuilder viewCampsiteDetails = doIf(session -> session.contains("campsiteId")).then(
            exec(
                    http("View Campsite Details")
                            .get("/api/campsites/#{campsiteId}")
                            .check(status().is(200))
                            .check(jsonPath("$.id").exists())
                            .check(jsonPath("$.name").exists())
            ).pause(PAGE_LOAD_PAUSE)
    );

    /**
     * View campsite lots.
     */
    public static ChainBuilder viewCampsiteLots = doIf(session -> session.contains("campsiteId")).then(
            exec(
                    http("View Campsite Lots")
                            .get("/api/campsites/#{campsiteId}/lots")
                            .check(status().is(200))
                            .check(jsonPath("$[0].id").optional().saveAs("lotId"))
            ).pause(PAGE_LOAD_PAUSE)
    );

    /**
     * View lot details.
     */
    public static ChainBuilder viewLotDetails = doIf(session -> session.contains("lotId")).then(
            exec(
                    http("View Lot Details")
                            .get("/api/lots/#{lotId}")
                            .check(status().is(200))
                            .check(jsonPath("$.id").exists())
            ).pause(MIN_PAUSE)
    );

    /**
     * Check lot availability.
     */
    public static ChainBuilder checkAvailability = doIf(session -> session.contains("lotId")).then(
            exec(
                    http("Check Availability")
                            .get("/api/availability/#{lotId}")
                            .queryParam("startDate", "2026-07-01")
                            .queryParam("endDate", "2026-07-31")
                            .check(status().in(200, 404))
            ).pause(MIN_PAUSE)
    );

    /**
     * View campsite reviews.
     */
    public static ChainBuilder viewCampsiteReviews = doIf(session -> session.contains("campsiteId")).then(
            exec(
                    http("View Campsite Reviews")
                            .get("/api/campsites/#{campsiteId}/reviews")
                            .check(status().is(200))
            ).pause(MIN_PAUSE, MAX_PAUSE)
    );

    /**
     * View featured campsites.
     */
    public static ChainBuilder viewFeaturedCampsites = exec(
            http("View Featured Campsites")
                    .get("/api/campsites/featured")
                    .check(status().in(200, 404))
    ).pause(MIN_PAUSE);

    /**
     * View special offers.
     */
    public static ChainBuilder viewOffers = exec(
            http("View Special Offers")
                    .get("/api/offers")
                    .check(status().is(200))
    ).pause(MIN_PAUSE, MAX_PAUSE);

    /**
     * View local businesses.
     */
    public static ChainBuilder viewLocalBusinesses = exec(
            http("View Local Businesses")
                    .get("/api/local-businesses")
                    .check(status().is(200))
    ).pause(MIN_PAUSE);

    /**
     * Complete browse flow - simulates a user browsing the site.
     */
    public static ChainBuilder completeBrowseFlow =
            browseCampsites
                    .exec(viewCampsiteDetails)
                    .exec(viewCampsiteLots)
                    .exec(viewCampsiteReviews)
                    .exec(searchByCounty)
                    .exec(viewOffers);

    private BrowseScenarios() {
        // Utility class
    }
}
