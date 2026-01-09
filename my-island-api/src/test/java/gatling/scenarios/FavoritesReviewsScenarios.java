package gatling.scenarios;

import io.gatling.javaapi.core.ChainBuilder;

import static gatling.GatlingConfig.*;
import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

/**
 * Favorites and Reviews scenarios.
 */
public final class FavoritesReviewsScenarios {

    /**
     * Add campsite to favorites.
     */
    public static ChainBuilder addToFavorites = doIf(session ->
            session.contains("accessToken") && session.contains("campsiteId")
    ).then(
            exec(
                    http("Add to Favorites")
                            .post("/api/favorites/#{campsiteId}")
                            .header("Authorization", "Bearer #{accessToken}")
                            .check(status().in(200, 201, 400, 409)) // 400/409 if already favorited
            ).pause(MIN_PAUSE)
    );

    /**
     * Remove campsite from favorites.
     */
    public static ChainBuilder removeFromFavorites = doIf(session ->
            session.contains("accessToken") && session.contains("campsiteId")
    ).then(
            exec(
                    http("Remove from Favorites")
                            .delete("/api/favorites/#{campsiteId}")
                            .header("Authorization", "Bearer #{accessToken}")
                            .check(status().in(200, 204, 404))
            ).pause(MIN_PAUSE)
    );

    /**
     * View user's favorites.
     */
    public static ChainBuilder viewMyFavorites = doIf(session -> session.contains("accessToken")).then(
            exec(
                    http("View My Favorites")
                            .get("/api/favorites")
                            .header("Authorization", "Bearer #{accessToken}")
                            .check(status().is(200))
            ).pause(MIN_PAUSE, MAX_PAUSE)
    );

    /**
     * Toggle favorite - add then remove.
     */
    public static ChainBuilder toggleFavorite =
            exec(addToFavorites)
                    .pause(MIN_PAUSE)
                    .exec(removeFromFavorites);

    /**
     * Create a review (requires completed booking).
     */
    public static ChainBuilder createReview = doIf(session ->
            session.contains("accessToken") && session.contains("bookingId")
    ).then(
            exec(
                    http("Create Review")
                            .post("/api/reviews")
                            .header("Authorization", "Bearer #{accessToken}")
                            .body(StringBody("""
                                    {
                                        "bookingId": "#{bookingId}",
                                        "rating": 5,
                                        "comment": "Wonderful experience! The location was perfect and the staff were incredibly helpful. Would definitely recommend!"
                                    }
                                    """))
                            .check(status().in(201, 400, 404)) // 400 if booking not completed
                            .check(jsonPath("$.id").optional().saveAs("reviewId"))
            ).pause(MIN_PAUSE, MAX_PAUSE)
    );

    /**
     * View reviews for a campsite.
     */
    public static ChainBuilder viewCampsiteReviews = doIf(session -> session.contains("campsiteId")).then(
            exec(
                    http("View Campsite Reviews")
                            .get("/api/reviews")
                            .queryParam("campsiteId", "#{campsiteId}")
                            .check(status().is(200))
            ).pause(MIN_PAUSE)
    );

    /**
     * Complete favorites flow.
     */
    public static ChainBuilder completeFavoritesFlow =
            exec(BrowseScenarios.browseCampsites)
                    .exec(addToFavorites)
                    .exec(viewMyFavorites)
                    .pause(MAX_PAUSE)
                    .exec(removeFromFavorites)
                    .exec(viewMyFavorites);

    private FavoritesReviewsScenarios() {
        // Utility class
    }
}
