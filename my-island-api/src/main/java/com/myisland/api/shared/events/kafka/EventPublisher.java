package com.myisland.api.shared.events.kafka;

import com.myisland.api.config.KafkaConfig;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.marketplace.entity.OfferClaim;
import com.myisland.api.modules.marketplace.repository.OfferClaimRepository;
import com.myisland.api.shared.events.BookingEvent;
import com.myisland.api.shared.events.OfferEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.LocalDateTime;

@Component
public class EventPublisher {

    private static final Logger log = LoggerFactory.getLogger(EventPublisher.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final BookingRepository bookingRepository;
    private final OfferClaimRepository offerClaimRepository;

    public EventPublisher(KafkaTemplate<String, Object> kafkaTemplate,
                          BookingRepository bookingRepository,
                          OfferClaimRepository offerClaimRepository) {
        this.kafkaTemplate = kafkaTemplate;
        this.bookingRepository = bookingRepository;
        this.offerClaimRepository = offerClaimRepository;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void handleBookingEvent(BookingEvent event) {
        Booking booking = bookingRepository.findByIdWithDetails(event.getBookingId()).orElse(null);
        if (booking == null) {
            log.warn("Booking not found for event: {}", event.getBookingId());
            return;
        }

        KafkaBookingEvent kafkaEvent = new KafkaBookingEvent(
                booking.getId(),
                booking.getUser() != null ? booking.getUser().getId() : null,
                booking.getUser() != null ? booking.getUser().getName() : booking.getGuestName(),
                booking.getUser() != null ? booking.getUser().getEmail() : booking.getGuestEmail(),
                booking.getLot().getId(),
                booking.getLot().getName(),
                booking.getLot().getOwner().getId(),
                booking.getLot().getOwner().getPropertyName(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getNumGuests(),
                booking.getTotalPrice(),
                booking.getStatus().name(),
                LocalDateTime.now()
        );

        String topic = switch (event.getType()) {
            case CREATED -> KafkaConfig.BOOKING_CREATED_TOPIC;
            case CONFIRMED -> KafkaConfig.BOOKING_CONFIRMED_TOPIC;
            case CANCELLED -> KafkaConfig.BOOKING_CANCELLED_TOPIC;
            case COMPLETED -> KafkaConfig.BOOKING_CONFIRMED_TOPIC; // Reuse confirmed topic
            case CHECKED_IN, CHECKED_OUT -> KafkaConfig.BOOKING_CONFIRMED_TOPIC; // Reuse confirmed topic
        };

        kafkaTemplate.send(topic, booking.getId().toString(), kafkaEvent);
        log.info("Published booking event: {} to topic: {}", event.getType(), topic);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void handleOfferEvent(OfferEvent event) {
        OfferClaim claim = offerClaimRepository.findByIdWithDetails(event.getClaimId()).orElse(null);
        if (claim == null) {
            log.warn("Offer claim not found for event: {}", event.getClaimId());
            return;
        }

        KafkaOfferEvent kafkaEvent = new KafkaOfferEvent(
                claim.getId(),
                claim.getOffer().getId(),
                claim.getOffer().getTitle(),
                claim.getOffer().getSupplier().getId(),
                claim.getOffer().getSupplier().getBusinessName(),
                claim.getUser().getId(),
                claim.getUser().getName(),
                claim.getUser().getEmail(),
                claim.getClaimCode(),
                claim.getStatus().name(),
                claim.isTest(),
                LocalDateTime.now()
        );

        String topic = switch (event.getType()) {
            case CLAIMED -> KafkaConfig.OFFER_CLAIMED_TOPIC;
            case REDEEMED -> KafkaConfig.OFFER_REDEEMED_TOPIC;
        };

        kafkaTemplate.send(topic, claim.getId().toString(), kafkaEvent);
        log.info("Published offer event: {} to topic: {}", event.getType(), topic);
    }

    public void publishUserRegistered(User user) {
        KafkaUserEvent event = new KafkaUserEvent(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name(),
                LocalDateTime.now()
        );

        kafkaTemplate.send(KafkaConfig.USER_REGISTERED_TOPIC, user.getId().toString(), event);
        log.info("Published user registered event for user: {}", user.getId());
    }
}
