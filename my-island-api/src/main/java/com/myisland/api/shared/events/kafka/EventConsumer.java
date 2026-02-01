package com.myisland.api.shared.events.kafka;

import com.myisland.api.config.KafkaConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class EventConsumer {

    private static final Logger log = LoggerFactory.getLogger(EventConsumer.class);

    @KafkaListener(
            topics = KafkaConfig.BOOKING_CREATED_TOPIC,
            groupId = "myisland-notifications"
    )
    public void handleBookingCreated(KafkaBookingEvent event) {
        log.info("Received booking created event: bookingId={}, user={}, lot={}",
                event.bookingId(), event.userName(), event.lotName());
        // TODO: Send notification email to owner about new booking
        // TODO: Send confirmation email to guest
    }

    @KafkaListener(
            topics = KafkaConfig.BOOKING_CONFIRMED_TOPIC,
            groupId = "myisland-notifications"
    )
    public void handleBookingConfirmed(KafkaBookingEvent event) {
        log.info("Received booking confirmed event: bookingId={}, user={}, lot={}",
                event.bookingId(), event.userName(), event.lotName());
        // TODO: Send confirmation email to guest with booking details
    }

    @KafkaListener(
            topics = KafkaConfig.BOOKING_CANCELLED_TOPIC,
            groupId = "myisland-notifications"
    )
    public void handleBookingCancelled(KafkaBookingEvent event) {
        log.info("Received booking cancelled event: bookingId={}, user={}, lot={}",
                event.bookingId(), event.userName(), event.lotName());
        // TODO: Send cancellation notification to owner
        // TODO: Send cancellation confirmation to guest
    }

    @KafkaListener(
            topics = KafkaConfig.OFFER_CLAIMED_TOPIC,
            groupId = "myisland-notifications"
    )
    public void handleOfferClaimed(KafkaOfferEvent event) {
        if (event.isTest()) {
            log.debug("Ignoring test claim event: claimId={}", event.claimId());
            return;
        }
        log.info("Received offer claimed event: claimId={}, offer={}, supplier={}",
                event.claimId(), event.offerTitle(), event.supplierName());
        // TODO: Send notification to supplier about new claim
        // TODO: Send voucher email to guest
    }

    @KafkaListener(
            topics = KafkaConfig.OFFER_REDEEMED_TOPIC,
            groupId = "myisland-analytics"
    )
    public void handleOfferRedeemed(KafkaOfferEvent event) {
        if (event.isTest()) {
            log.debug("Ignoring test redemption event: claimId={}", event.claimId());
            return;
        }
        log.info("Received offer redeemed event: claimId={}, offer={}, supplier={}",
                event.claimId(), event.offerTitle(), event.supplierName());
        // TODO: Track redemption analytics
        // TODO: Update supplier metrics
    }

    @KafkaListener(
            topics = KafkaConfig.USER_REGISTERED_TOPIC,
            groupId = "myisland-notifications"
    )
    public void handleUserRegistered(KafkaUserEvent event) {
        log.info("Received user registered event: userId={}, email={}",
                event.userId(), event.email());
        // TODO: Send welcome email to new user
    }
}
