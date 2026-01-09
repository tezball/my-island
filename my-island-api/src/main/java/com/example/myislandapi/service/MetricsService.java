package com.example.myislandapi.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Tags;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class MetricsService {

    private final MeterRegistry meterRegistry;

    // User metrics
    private final Counter userRegistrations;
    private final Counter userLogins;
    private final Counter userLoginFailures;
    private final Counter userLogouts;

    // Booking metrics
    private final Counter bookingsCreated;
    private final Counter bookingsConfirmed;
    private final Counter bookingsCancelled;
    private final Counter bookingsCompleted;
    private final Counter bookingsCheckedIn;

    // Payment metrics
    private final Counter paymentsInitiated;
    private final Counter paymentsSucceeded;
    private final Counter paymentsFailed;
    private final Counter paymentsRefunded;
    private final AtomicReference<BigDecimal> totalRevenue = new AtomicReference<>(BigDecimal.ZERO);

    // Review metrics
    private final Counter reviewsCreated;
    private final Counter reviewsUpdated;
    private final Counter reviewsDeleted;

    // Favorite metrics
    private final Counter favoritesAdded;
    private final Counter favoritesRemoved;

    // Search metrics
    private final Counter searchesPerformed;
    private final Counter campsiteViews;
    private final Counter lotViews;

    // Property metrics
    private final Counter propertiesCreated;
    private final Counter propertiesPublished;

    public MetricsService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;

        // User metrics
        this.userRegistrations = Counter.builder("myisland.users.registrations")
                .description("Total number of user registrations")
                .register(meterRegistry);

        this.userLogins = Counter.builder("myisland.users.logins")
                .description("Total number of successful logins")
                .register(meterRegistry);

        this.userLoginFailures = Counter.builder("myisland.users.login_failures")
                .description("Total number of failed login attempts")
                .register(meterRegistry);

        this.userLogouts = Counter.builder("myisland.users.logouts")
                .description("Total number of logouts")
                .register(meterRegistry);

        // Booking metrics
        this.bookingsCreated = Counter.builder("myisland.bookings.created")
                .description("Total number of bookings created")
                .register(meterRegistry);

        this.bookingsConfirmed = Counter.builder("myisland.bookings.confirmed")
                .description("Total number of bookings confirmed")
                .register(meterRegistry);

        this.bookingsCancelled = Counter.builder("myisland.bookings.cancelled")
                .description("Total number of bookings cancelled")
                .register(meterRegistry);

        this.bookingsCompleted = Counter.builder("myisland.bookings.completed")
                .description("Total number of bookings completed")
                .register(meterRegistry);

        this.bookingsCheckedIn = Counter.builder("myisland.bookings.checked_in")
                .description("Total number of bookings checked in")
                .register(meterRegistry);

        // Payment metrics
        this.paymentsInitiated = Counter.builder("myisland.payments.initiated")
                .description("Total number of payments initiated")
                .register(meterRegistry);

        this.paymentsSucceeded = Counter.builder("myisland.payments.succeeded")
                .description("Total number of successful payments")
                .register(meterRegistry);

        this.paymentsFailed = Counter.builder("myisland.payments.failed")
                .description("Total number of failed payments")
                .register(meterRegistry);

        this.paymentsRefunded = Counter.builder("myisland.payments.refunded")
                .description("Total number of refunded payments")
                .register(meterRegistry);

        // Revenue gauge
        meterRegistry.gauge("myisland.revenue.total", totalRevenue, ref -> ref.get().doubleValue());

        // Review metrics
        this.reviewsCreated = Counter.builder("myisland.reviews.created")
                .description("Total number of reviews created")
                .register(meterRegistry);

        this.reviewsUpdated = Counter.builder("myisland.reviews.updated")
                .description("Total number of reviews updated")
                .register(meterRegistry);

        this.reviewsDeleted = Counter.builder("myisland.reviews.deleted")
                .description("Total number of reviews deleted")
                .register(meterRegistry);

        // Favorite metrics
        this.favoritesAdded = Counter.builder("myisland.favorites.added")
                .description("Total number of favorites added")
                .register(meterRegistry);

        this.favoritesRemoved = Counter.builder("myisland.favorites.removed")
                .description("Total number of favorites removed")
                .register(meterRegistry);

        // Search metrics
        this.searchesPerformed = Counter.builder("myisland.searches.performed")
                .description("Total number of searches performed")
                .register(meterRegistry);

        this.campsiteViews = Counter.builder("myisland.views.campsite")
                .description("Total number of campsite views")
                .register(meterRegistry);

        this.lotViews = Counter.builder("myisland.views.lot")
                .description("Total number of lot views")
                .register(meterRegistry);

        // Property metrics
        this.propertiesCreated = Counter.builder("myisland.properties.created")
                .description("Total number of properties created")
                .register(meterRegistry);

        this.propertiesPublished = Counter.builder("myisland.properties.published")
                .description("Total number of properties published")
                .register(meterRegistry);
    }

    // User metric methods
    public void recordUserRegistration() {
        userRegistrations.increment();
    }

    public void recordUserLogin() {
        userLogins.increment();
    }

    public void recordUserLoginFailure() {
        userLoginFailures.increment();
    }

    public void recordUserLogout() {
        userLogouts.increment();
    }

    // Booking metric methods
    public void recordBookingCreated(BigDecimal amount) {
        bookingsCreated.increment();
        if (amount != null) {
            recordBookingAmount("created", amount);
        }
    }

    public void recordBookingConfirmed(BigDecimal amount) {
        bookingsConfirmed.increment();
        if (amount != null) {
            recordBookingAmount("confirmed", amount);
        }
    }

    public void recordBookingCancelled() {
        bookingsCancelled.increment();
    }

    public void recordBookingCompleted(BigDecimal amount) {
        bookingsCompleted.increment();
        if (amount != null) {
            recordBookingAmount("completed", amount);
        }
    }

    public void recordBookingCheckedIn() {
        bookingsCheckedIn.increment();
    }

    private void recordBookingAmount(String status, BigDecimal amount) {
        meterRegistry.counter("myisland.bookings.amount", Tags.of("status", status))
                .increment(amount.doubleValue());
    }

    // Payment metric methods
    public void recordPaymentInitiated(BigDecimal amount) {
        paymentsInitiated.increment();
    }

    public void recordPaymentSucceeded(BigDecimal amount) {
        paymentsSucceeded.increment();
        if (amount != null) {
            totalRevenue.updateAndGet(current -> current.add(amount));
            meterRegistry.counter("myisland.revenue.transactions")
                    .increment(amount.doubleValue());
        }
    }

    public void recordPaymentFailed() {
        paymentsFailed.increment();
    }

    public void recordPaymentRefunded(BigDecimal amount) {
        paymentsRefunded.increment();
        if (amount != null) {
            totalRevenue.updateAndGet(current -> current.subtract(amount));
        }
    }

    // Review metric methods
    public void recordReviewCreated(int rating) {
        reviewsCreated.increment();
        meterRegistry.counter("myisland.reviews.by_rating", Tags.of("rating", String.valueOf(rating)))
                .increment();
    }

    public void recordReviewUpdated() {
        reviewsUpdated.increment();
    }

    public void recordReviewDeleted() {
        reviewsDeleted.increment();
    }

    // Favorite metric methods
    public void recordFavoriteAdded() {
        favoritesAdded.increment();
    }

    public void recordFavoriteRemoved() {
        favoritesRemoved.increment();
    }

    // Search metric methods
    public void recordSearchPerformed(int resultsCount) {
        searchesPerformed.increment();
        meterRegistry.summary("myisland.searches.results_count").record(resultsCount);
    }

    public void recordCampsiteViewed() {
        campsiteViews.increment();
    }

    public void recordLotViewed() {
        lotViews.increment();
    }

    // Property metric methods
    public void recordPropertyCreated() {
        propertiesCreated.increment();
    }

    public void recordPropertyPublished() {
        propertiesPublished.increment();
    }
}
