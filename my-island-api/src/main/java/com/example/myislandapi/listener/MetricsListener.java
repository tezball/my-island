package com.example.myislandapi.listener;

import com.example.myislandapi.config.KafkaConfig;
import com.example.myislandapi.event.*;
import com.example.myislandapi.service.MetricsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class MetricsListener {

    private static final Logger log = LoggerFactory.getLogger(MetricsListener.class);

    private final MetricsService metricsService;

    public MetricsListener(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @KafkaListener(
            topics = KafkaConfig.USER_EVENTS_TOPIC,
            groupId = "metrics-processor"
    )
    public void handleUserEvent(UserEvent event) {
        log.debug("Processing user event for metrics: {}", event.eventType());
        try {
            switch (event.eventType()) {
                case UserEvent.TYPE_REGISTERED -> metricsService.recordUserRegistration();
                case UserEvent.TYPE_LOGIN -> metricsService.recordUserLogin();
                case UserEvent.TYPE_LOGIN_FAILED -> metricsService.recordUserLoginFailure();
                case UserEvent.TYPE_LOGOUT -> metricsService.recordUserLogout();
            }
        } catch (Exception e) {
            log.error("Error processing user event for metrics: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(
            topics = KafkaConfig.BOOKING_EVENTS_TOPIC,
            groupId = "metrics-processor"
    )
    public void handleBookingEvent(BookingEvent event) {
        log.debug("Processing booking event for metrics: {}", event.eventType());
        try {
            switch (event.eventType()) {
                case BookingEvent.TYPE_CREATED -> metricsService.recordBookingCreated(event.totalPrice());
                case BookingEvent.TYPE_CONFIRMED -> metricsService.recordBookingConfirmed(event.totalPrice());
                case BookingEvent.TYPE_CANCELLED -> metricsService.recordBookingCancelled();
                case BookingEvent.TYPE_COMPLETED -> metricsService.recordBookingCompleted(event.totalPrice());
                case BookingEvent.TYPE_CHECKED_IN -> metricsService.recordBookingCheckedIn();
            }
        } catch (Exception e) {
            log.error("Error processing booking event for metrics: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(
            topics = KafkaConfig.PAYMENT_EVENTS_TOPIC,
            groupId = "metrics-processor"
    )
    public void handlePaymentEvent(PaymentEvent event) {
        log.debug("Processing payment event for metrics: {}", event.eventType());
        try {
            switch (event.eventType()) {
                case PaymentEvent.TYPE_INITIATED -> metricsService.recordPaymentInitiated(event.amount());
                case PaymentEvent.TYPE_SUCCEEDED -> metricsService.recordPaymentSucceeded(event.amount());
                case PaymentEvent.TYPE_FAILED -> metricsService.recordPaymentFailed();
                case PaymentEvent.TYPE_REFUNDED -> metricsService.recordPaymentRefunded(event.amount());
            }
        } catch (Exception e) {
            log.error("Error processing payment event for metrics: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(
            topics = KafkaConfig.REVIEW_EVENTS_TOPIC,
            groupId = "metrics-processor"
    )
    public void handleReviewEvent(ReviewEvent event) {
        log.debug("Processing review event for metrics: {}", event.eventType());
        try {
            switch (event.eventType()) {
                case ReviewEvent.TYPE_CREATED -> metricsService.recordReviewCreated(
                        event.rating() != null ? event.rating() : 0);
                case ReviewEvent.TYPE_UPDATED -> metricsService.recordReviewUpdated();
                case ReviewEvent.TYPE_DELETED -> metricsService.recordReviewDeleted();
            }
        } catch (Exception e) {
            log.error("Error processing review event for metrics: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(
            topics = KafkaConfig.FAVORITE_EVENTS_TOPIC,
            groupId = "metrics-processor"
    )
    public void handleFavoriteEvent(FavoriteEvent event) {
        log.debug("Processing favorite event for metrics: {}", event.eventType());
        try {
            switch (event.eventType()) {
                case FavoriteEvent.TYPE_ADDED -> metricsService.recordFavoriteAdded();
                case FavoriteEvent.TYPE_REMOVED -> metricsService.recordFavoriteRemoved();
            }
        } catch (Exception e) {
            log.error("Error processing favorite event for metrics: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(
            topics = KafkaConfig.SEARCH_EVENTS_TOPIC,
            groupId = "metrics-processor"
    )
    public void handleSearchEvent(SearchEvent event) {
        log.debug("Processing search event for metrics: {}", event.eventType());
        try {
            switch (event.eventType()) {
                case SearchEvent.TYPE_SEARCH_PERFORMED -> metricsService.recordSearchPerformed(
                        event.resultsCount() != null ? event.resultsCount() : 0);
                case SearchEvent.TYPE_CAMPSITE_VIEWED -> metricsService.recordCampsiteViewed();
                case SearchEvent.TYPE_LOT_VIEWED -> metricsService.recordLotViewed();
            }
        } catch (Exception e) {
            log.error("Error processing search event for metrics: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(
            topics = KafkaConfig.PROPERTY_EVENTS_TOPIC,
            groupId = "metrics-processor"
    )
    public void handlePropertyEvent(PropertyEvent event) {
        log.debug("Processing property event for metrics: {}", event.eventType());
        try {
            switch (event.eventType()) {
                case CREATED -> metricsService.recordPropertyCreated();
                case PUBLISHED -> metricsService.recordPropertyPublished();
                default -> { /* other property events not tracked */ }
            }
        } catch (Exception e) {
            log.error("Error processing property event for metrics: {}", e.getMessage(), e);
        }
    }
}
