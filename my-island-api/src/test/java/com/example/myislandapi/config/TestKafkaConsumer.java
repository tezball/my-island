package com.example.myislandapi.config;

import com.example.myislandapi.event.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

/**
 * Test-only Kafka consumer that captures all events for assertion in tests.
 * Provides methods to retrieve and filter captured events by type.
 */
@Component
@Profile("test")
public class TestKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(TestKafkaConsumer.class);

    private final List<Object> receivedEvents = new CopyOnWriteArrayList<>();

    @KafkaListener(topics = "user-events", groupId = "test-consumer-user")
    public void consumeUserEvent(UserEvent event) {
        log.info("Test consumer received UserEvent: {}", event.eventType());
        receivedEvents.add(event);
    }

    @KafkaListener(topics = "booking-events", groupId = "test-consumer-booking")
    public void consumeBookingEvent(BookingEvent event) {
        log.info("Test consumer received BookingEvent: {}", event.eventType());
        receivedEvents.add(event);
    }

    @KafkaListener(topics = "review-events", groupId = "test-consumer-review")
    public void consumeReviewEvent(ReviewEvent event) {
        log.info("Test consumer received ReviewEvent: {}", event.eventType());
        receivedEvents.add(event);
    }

    @KafkaListener(topics = "favorite-events", groupId = "test-consumer-favorite")
    public void consumeFavoriteEvent(FavoriteEvent event) {
        log.info("Test consumer received FavoriteEvent: {}", event.eventType());
        receivedEvents.add(event);
    }

    @KafkaListener(topics = "payment-events", groupId = "test-consumer-payment")
    public void consumePaymentEvent(PaymentEvent event) {
        log.info("Test consumer received PaymentEvent: {}", event.eventType());
        receivedEvents.add(event);
    }

    @KafkaListener(topics = "search-events", groupId = "test-consumer-search")
    public void consumeSearchEvent(SearchEvent event) {
        log.info("Test consumer received SearchEvent: {}", event.eventType());
        receivedEvents.add(event);
    }

    /**
     * Get all received events of a specific type.
     */
    @SuppressWarnings("unchecked")
    public <T> List<T> getEventsOfType(Class<T> type) {
        return receivedEvents.stream()
                .filter(type::isInstance)
                .map(e -> (T) e)
                .collect(Collectors.toList());
    }

    /**
     * Get all received events.
     */
    public List<Object> getAllEvents() {
        return List.copyOf(receivedEvents);
    }

    /**
     * Clear all captured events. Call this in @BeforeEach to isolate tests.
     */
    public void clear() {
        receivedEvents.clear();
    }

    /**
     * Check if any events of the given type have been received.
     */
    public <T> boolean hasEventsOfType(Class<T> type) {
        return receivedEvents.stream().anyMatch(type::isInstance);
    }

    /**
     * Get count of events of a specific type.
     */
    public <T> long countEventsOfType(Class<T> type) {
        return receivedEvents.stream().filter(type::isInstance).count();
    }
}
