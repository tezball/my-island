package gatling.scenarios;

import io.gatling.javaapi.core.ChainBuilder;

import static gatling.GatlingConfig.*;
import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

/**
 * Booking scenarios: create booking, view bookings, manage bookings.
 */
public final class BookingScenarios {

    /**
     * Create a new booking (requires authentication and lotId).
     */
    public static ChainBuilder createBooking = doIf(session ->
            session.contains("accessToken") && session.contains("lotId")
    ).then(
            exec(
                    http("Create Booking")
                            .post("/api/bookings")
                            .header("Authorization", "Bearer #{accessToken}")
                            .body(StringBody("""
                                    {
                                        "lotId": "#{lotId}",
                                        "checkIn": "2026-08-01",
                                        "checkOut": "2026-08-05",
                                        "guests": 2,
                                        "specialRequests": "Late check-in please"
                                    }
                                    """))
                            .check(status().in(201, 400, 409)) // 400/409 if dates not available
                            .check(jsonPath("$.id").optional().saveAs("bookingId"))
            ).pause(PAGE_LOAD_PAUSE)
    );

    /**
     * View user's bookings.
     */
    public static ChainBuilder viewMyBookings = doIf(session -> session.contains("accessToken")).then(
            exec(
                    http("View My Bookings")
                            .get("/api/bookings")
                            .header("Authorization", "Bearer #{accessToken}")
                            .check(status().is(200))
            ).pause(MIN_PAUSE, MAX_PAUSE)
    );

    /**
     * View booking details.
     */
    public static ChainBuilder viewBookingDetails = doIf(session ->
            session.contains("accessToken") && session.contains("bookingId")
    ).then(
            exec(
                    http("View Booking Details")
                            .get("/api/bookings/#{bookingId}")
                            .header("Authorization", "Bearer #{accessToken}")
                            .check(status().in(200, 404))
            ).pause(MIN_PAUSE)
    );

    /**
     * Cancel booking.
     */
    public static ChainBuilder cancelBooking = doIf(session ->
            session.contains("accessToken") && session.contains("bookingId")
    ).then(
            exec(
                    http("Cancel Booking")
                            .delete("/api/bookings/#{bookingId}")
                            .header("Authorization", "Bearer #{accessToken}")
                            .check(status().in(200, 204, 400, 404))
            ).pause(MIN_PAUSE)
    );

    /**
     * Owner confirms a booking.
     */
    public static ChainBuilder ownerConfirmBooking = doIf(session ->
            session.contains("accessToken") && session.contains("bookingId")
    ).then(
            exec(
                    http("Owner - Confirm Booking")
                            .post("/api/owner/bookings/#{bookingId}/confirm")
                            .header("Authorization", "Bearer #{accessToken}")
                            .check(status().in(200, 400, 404))
            ).pause(MIN_PAUSE)
    );

    /**
     * Owner completes a booking.
     */
    public static ChainBuilder ownerCompleteBooking = doIf(session ->
            session.contains("accessToken") && session.contains("bookingId")
    ).then(
            exec(
                    http("Owner - Complete Booking")
                            .post("/api/owner/bookings/#{bookingId}/complete")
                            .header("Authorization", "Bearer #{accessToken}")
                            .check(status().in(200, 400, 404))
            ).pause(MIN_PAUSE)
    );

    /**
     * Owner views their bookings.
     */
    public static ChainBuilder ownerViewBookings = doIf(session -> session.contains("accessToken")).then(
            exec(
                    http("Owner - View Bookings")
                            .get("/api/owner/bookings")
                            .header("Authorization", "Bearer #{accessToken}")
                            .check(status().is(200))
            ).pause(MIN_PAUSE, MAX_PAUSE)
    );

    /**
     * Owner views stats.
     */
    public static ChainBuilder ownerViewStats = doIf(session -> session.contains("accessToken")).then(
            exec(
                    http("Owner - View Stats")
                            .get("/api/owner/stats")
                            .header("Authorization", "Bearer #{accessToken}")
                            .check(status().is(200))
            ).pause(MIN_PAUSE)
    );

    /**
     * Owner views campsites.
     */
    public static ChainBuilder ownerViewCampsites = doIf(session -> session.contains("accessToken")).then(
            exec(
                    http("Owner - View Campsites")
                            .get("/api/owner/campsites")
                            .header("Authorization", "Bearer #{accessToken}")
                            .check(status().is(200))
                            .check(jsonPath("$[0].id").optional().saveAs("ownerCampsiteId"))
            ).pause(MIN_PAUSE)
    );

    /**
     * Complete booking flow - find campsite, view lot, create booking.
     */
    public static ChainBuilder completeBookingFlow =
            exec(BrowseScenarios.browseCampsites)
                    .exec(BrowseScenarios.viewCampsiteDetails)
                    .exec(BrowseScenarios.viewCampsiteLots)
                    .exec(createBooking)
                    .exec(viewMyBookings);

    private BookingScenarios() {
        // Utility class
    }
}
