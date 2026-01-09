# Kafka Events Documentation

This document provides a comprehensive list of all Kafka events used in the My Island application for event-driven architecture.

## Overview

The application uses Apache Kafka for asynchronous event processing. Events are published when significant business actions occur, enabling loose coupling between services and supporting features like:

- Email notifications
- In-app notifications
- Analytics and reporting
- Audit logging
- Real-time updates

## Kafka Topics

| Topic Name | Description | Partitions |
|------------|-------------|------------|
| `booking-events` | Booking lifecycle events | 3 |
| `user-events` | User authentication and profile events | 3 |
| `property-events` | Campsite and lot management events | 3 |
| `review-events` | Review creation and moderation | 3 |
| `favorite-events` | User favorites management | 3 |
| `payment-events` | Stripe payment lifecycle | 3 |
| `email-events` | Transactional email triggers | 3 |
| `notification-events` | In-app notification triggers | 3 |
| `search-events` | Search and analytics tracking | 3 |
| `analytics-events` | General analytics events | 3 |

---

## Event Types by Category

### User Events (`user-events`)

Events related to user authentication, registration, and profile management.

| Event Type | Description | Published By |
|------------|-------------|--------------|
| `USER_REGISTERED` | User successfully created an account | AuthService |
| `USER_LOGIN` | User successfully logged in | AuthService |
| `USER_LOGIN_FAILED` | Failed login attempt (wrong credentials) | AuthService |
| `USER_LOGOUT` | User logged out | AuthService |
| `USER_PASSWORD_RESET_REQUESTED` | Password reset email requested | AuthService |
| `USER_PASSWORD_RESET_COMPLETED` | Password successfully reset | AuthService |
| `USER_PROFILE_UPDATED` | User updated their profile | UserService |
| `USER_EMAIL_VERIFIED` | User verified their email address | AuthService |
| `USER_DEACTIVATED` | User account deactivated | UserService |
| `USER_ROLE_CHANGED` | User role changed (e.g., to OWNER) | UserService |

**Event Schema:**
```java
record UserEvent(
    UUID userId,
    String eventType,
    String email,
    String ipAddress,
    String userAgent,
    long timestamp
)
```

---

### Booking Events (`booking-events`)

Events related to the booking lifecycle from creation to completion.

| Event Type | Description | Published By |
|------------|-------------|--------------|
| `BOOKING_CREATED` | New booking created | BookingService |
| `BOOKING_CONFIRMED` | Booking confirmed by owner | BookingService |
| `BOOKING_CANCELLED` | Booking cancelled | BookingService |
| `BOOKING_CHECKED_IN` | Guest checked in | BookingService |
| `BOOKING_COMPLETED` | Stay completed | BookingService |
| `BOOKING_MODIFIED` | Booking dates or guests changed | BookingService |
| `BOOKING_PAYMENT_RECEIVED` | Payment received for booking | PaymentService |
| `BOOKING_CHECK_IN_REMINDER` | Check-in reminder sent | ScheduledTasks |
| `BOOKING_CHECK_OUT_REMINDER` | Check-out reminder sent | ScheduledTasks |
| `BOOKING_NO_SHOW` | Guest did not show up | BookingService |
| `BOOKING_EXTENDED` | Booking stay extended | BookingService |
| `BOOKING_REFUND_REQUESTED` | Refund requested | BookingService |

**Event Schema:**
```java
record BookingEvent(
    UUID bookingId,
    UUID userId,
    UUID campsiteId,
    UUID lotId,
    String eventType,
    LocalDate checkIn,
    LocalDate checkOut,
    BigDecimal totalPrice,
    BookingStatus status,
    long timestamp
)
```

---

### Property Events (`property-events`)

Events related to campsite and lot management.

| Event Type | Description | Published By |
|------------|-------------|--------------|
| `DRAFT_SAVED` | Property draft saved | CampsiteService |
| `CREATED` | Property created | CampsiteService |
| `PENDING_REVIEW` | Property submitted for review | CampsiteService |
| `UPDATED` | Property details updated | CampsiteService |
| `DELETED` | Property deleted | CampsiteService |
| `PUBLISHED` | Property published and visible | CampsiteService |
| `UNPUBLISHED` | Property unpublished/hidden | CampsiteService |
| `FEATURED` | Property featured on homepage | AdminService |
| `LOT_CREATED` | New lot added to property | LotService |
| `LOT_UPDATED` | Lot details updated | LotService |
| `LOT_DELETED` | Lot removed | LotService |
| `LOT_AVAILABILITY_CHANGED` | Lot availability changed | LotService |
| `PRICING_UPDATED` | Lot pricing updated | LotService |
| `IMAGES_UPLOADED` | Images added to property | CampsiteService |

**Event Schema:**
```java
record PropertyEvent(
    UUID propertyId,
    UUID ownerId,
    PropertyType propertyType,
    PropertyEventType eventType,
    Instant timestamp
)
```

---

### Review Events (`review-events`)

Events related to reviews and ratings.

| Event Type | Description | Published By |
|------------|-------------|--------------|
| `REVIEW_CREATED` | User submitted a review | ReviewService |
| `REVIEW_UPDATED` | User updated their review | ReviewService |
| `REVIEW_DELETED` | Review deleted | ReviewService |
| `REVIEW_REPORTED` | Review flagged for moderation | ReviewService |
| `REVIEW_RESPONSE_ADDED` | Owner responded to review | ReviewService |

**Event Schema:**
```java
record ReviewEvent(
    UUID reviewId,
    UUID userId,
    UUID campsiteId,
    UUID bookingId,
    String eventType,
    Integer rating,
    long timestamp
)
```

---

### Favorite Events (`favorite-events`)

Events for tracking user favorites.

| Event Type | Description | Published By |
|------------|-------------|--------------|
| `FAVORITE_ADDED` | User added campsite to favorites | FavoriteService |
| `FAVORITE_REMOVED` | User removed campsite from favorites | FavoriteService |

**Event Schema:**
```java
record FavoriteEvent(
    UUID userId,
    UUID campsiteId,
    String eventType,
    long timestamp
)
```

---

### Payment Events (`payment-events`)

Events related to Stripe payment processing.

| Event Type | Description | Published By |
|------------|-------------|--------------|
| `PAYMENT_INITIATED` | Payment intent created | PaymentService |
| `PAYMENT_SUCCEEDED` | Payment completed successfully | PaymentService (webhook) |
| `PAYMENT_FAILED` | Payment failed | PaymentService (webhook) |
| `PAYMENT_REFUNDED` | Payment refunded | PaymentService |
| `PAYMENT_DISPUTED` | Payment disputed by customer | PaymentService (webhook) |

**Event Schema:**
```java
record PaymentEvent(
    UUID paymentId,
    UUID bookingId,
    UUID userId,
    String eventType,
    BigDecimal amount,
    String currency,
    String stripePaymentIntentId,
    String failureReason,
    long timestamp
)
```

---

### Email Events (`email-events`)

Triggers for transactional emails.

| Event Type | Description | Listener |
|------------|-------------|----------|
| `WELCOME` | Welcome email for new users | EmailListener |
| `BOOKING_CONFIRMATION` | Booking confirmed email | EmailListener |
| `BOOKING_CANCELLATION` | Booking cancelled email | EmailListener |
| `PASSWORD_RESET` | Password reset link email | EmailListener |
| `CHECK_IN_REMINDER` | Check-in reminder email | EmailListener |

**Event Schema:**
```java
record EmailEvent(
    String emailType,
    UUID userId,
    UUID referenceId,
    long timestamp
)
```

---

### Notification Events (`notification-events`)

Triggers for in-app notifications.

| Notification Type | Description | Listener |
|-------------------|-------------|----------|
| `BOOKING` | Booking-related notifications | NotificationListener |
| `REVIEW` | New review notifications | NotificationListener |
| `OFFER` | Special offer notifications | NotificationListener |
| `SYSTEM` | System announcements | NotificationListener |
| `REMINDER` | Reminder notifications | NotificationListener |

**Event Schema:**
```java
record NotificationEvent(
    UUID userId,
    NotificationType type,
    String title,
    String message,
    UUID referenceId,
    long timestamp
)
```

---

### Search Events (`search-events`)

Analytics events for search and browsing behavior.

| Event Type | Description | Published By |
|------------|-------------|--------------|
| `SEARCH_PERFORMED` | User performed a search | SearchService |
| `CAMPSITE_VIEWED` | User viewed a campsite page | CampsiteController |
| `LOT_VIEWED` | User viewed a specific lot | LotController |
| `FILTER_APPLIED` | User applied search filters | SearchService |

**Event Schema:**
```java
record SearchEvent(
    UUID userId,
    String eventType,
    String query,
    String location,
    LocalDate checkIn,
    LocalDate checkOut,
    Integer guests,
    Integer resultsCount,
    UUID campsiteId,
    UUID lotId,
    long timestamp
)
```

---

## Event Summary

| Category | Event Count |
|----------|-------------|
| User Events | 10 |
| Booking Events | 12 |
| Property Events | 14 |
| Review Events | 5 |
| Favorite Events | 2 |
| Payment Events | 5 |
| Email Events | 5 |
| Notification Events | 5 |
| Search Events | 4 |
| **Total** | **62** |

---

## Implementation Details

### Publishing Events

Events are published via the `EventPublisher` service:

```java
@Service
public class EventPublisher {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishUserEvent(UserEvent event) {
        kafkaTemplate.send(KafkaConfig.USER_EVENTS_TOPIC, event.userId().toString(), event);
    }

    public void publishBookingEvent(BookingEvent event) {
        kafkaTemplate.send(KafkaConfig.BOOKING_EVENTS_TOPIC, event.bookingId().toString(), event);
    }
    // ... other publish methods
}
```

### Consuming Events

Events are consumed by Kafka listeners:

```java
@Component
public class EmailListener {
    @KafkaListener(topics = KafkaConfig.EMAIL_EVENTS_TOPIC)
    public void handleEmailEvent(EmailEvent event) {
        // Process email event
    }
}
```

---

## Monitoring

Kafka UI is available at `http://localhost:8090` when running locally. It provides:

- Topic browsing and message inspection
- Consumer group monitoring
- Topic configuration management

---

## Testing

Integration tests use Testcontainers to spin up a real Kafka instance. The `TestKafkaConsumer` captures events for verification:

```java
@Test
void shouldPublishUserLoginEvent() {
    // Perform login
    // ...

    await().atMost(10, TimeUnit.SECONDS).untilAsserted(() -> {
        var events = testKafkaConsumer.getEventsOfType(UserEvent.class);
        assertThat(events).anyMatch(e ->
            e.eventType().equals(UserEvent.TYPE_LOGIN)
        );
    });
}
```
