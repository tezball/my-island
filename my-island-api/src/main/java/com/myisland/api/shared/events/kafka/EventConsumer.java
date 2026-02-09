package com.myisland.api.shared.events.kafka;

import com.myisland.api.config.KafkaConfig;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.shared.email.BookingEmailData;
import com.myisland.api.shared.email.EmailNotificationService;
import com.myisland.api.shared.email.OfferClaimEmailData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class EventConsumer {

    private static final Logger log = LoggerFactory.getLogger(EventConsumer.class);

    private final EmailNotificationService emailService;
    private final OwnerRepository ownerRepository;
    private final SupplierRepository supplierRepository;

    public EventConsumer(
            EmailNotificationService emailService,
            OwnerRepository ownerRepository,
            SupplierRepository supplierRepository) {
        this.emailService = emailService;
        this.ownerRepository = ownerRepository;
        this.supplierRepository = supplierRepository;
    }

    @KafkaListener(
            topics = KafkaConfig.BOOKING_CREATED_TOPIC,
            groupId = "myisland-notifications"
    )
    public void handleBookingCreated(KafkaBookingEvent event) {
        log.info("Received booking created event: bookingId={}, user={}, lot={}",
                event.bookingId(), event.userName(), event.lotName());

        BookingEmailData bookingData = createBookingEmailData(event);

        // Send notification email to owner (if they have email notifications enabled)
        Optional<Owner> ownerOpt = ownerRepository.findById(event.ownerId());
        ownerOpt.ifPresent(owner -> {
            if (owner.isEmailNotificationsBookings()) {
                String ownerEmail = owner.getUser().getEmail();
                emailService.sendBookingCreatedToOwner(ownerEmail, bookingData);
                log.info("Sent booking notification to owner: {}", ownerEmail);
            } else {
                log.info("Skipping booking created email for owner {} (notifications disabled)", owner.getId());
            }
        });

        // Send confirmation email to guest
        emailService.sendBookingCreatedToGuest(event.userEmail(), bookingData);
        log.info("Sent booking confirmation to guest: {}", event.userEmail());
    }

    @KafkaListener(
            topics = KafkaConfig.BOOKING_CONFIRMED_TOPIC,
            groupId = "myisland-notifications"
    )
    public void handleBookingConfirmed(KafkaBookingEvent event) {
        log.info("Received booking confirmed event: bookingId={}, user={}, lot={}",
                event.bookingId(), event.userName(), event.lotName());

        BookingEmailData bookingData = createBookingEmailData(event);

        // Send confirmation email to guest with booking details
        emailService.sendBookingConfirmedToGuest(event.userEmail(), bookingData);
        log.info("Sent booking confirmed email to guest: {}", event.userEmail());
    }

    @KafkaListener(
            topics = KafkaConfig.BOOKING_CANCELLED_TOPIC,
            groupId = "myisland-notifications"
    )
    public void handleBookingCancelled(KafkaBookingEvent event) {
        log.info("Received booking cancelled event: bookingId={}, user={}, lot={}",
                event.bookingId(), event.userName(), event.lotName());

        BookingEmailData bookingData = createBookingEmailData(event);

        // Send cancellation notification to owner (if they have email notifications enabled)
        Optional<Owner> ownerOpt = ownerRepository.findById(event.ownerId());
        ownerOpt.ifPresent(owner -> {
            if (owner.isEmailNotificationsBookings()) {
                String ownerEmail = owner.getUser().getEmail();
                emailService.sendBookingCancelledToOwner(ownerEmail, bookingData);
                log.info("Sent cancellation notification to owner: {}", ownerEmail);
            } else {
                log.info("Skipping booking cancelled email for owner {} (notifications disabled)", owner.getId());
            }
        });

        // Send cancellation confirmation to guest
        emailService.sendBookingCancelledToGuest(event.userEmail(), bookingData);
        log.info("Sent cancellation confirmation to guest: {}", event.userEmail());
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

        OfferClaimEmailData claimData = createClaimEmailData(event);

        // Send notification to supplier about new claim
        Optional<Supplier> supplierOpt = supplierRepository.findById(event.supplierId());
        supplierOpt.ifPresent(supplier -> {
            String supplierEmail = supplier.getUser().getEmail();
            emailService.sendOfferClaimedToSupplier(supplierEmail, claimData);
            log.info("Sent claim notification to supplier: {}", supplierEmail);
        });

        // Send voucher email to guest
        emailService.sendVoucherToGuest(event.userEmail(), claimData);
        log.info("Sent voucher to guest: {}", event.userEmail());
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
        // Analytics tracking - no email needed for redemption
    }

    @KafkaListener(
            topics = KafkaConfig.USER_REGISTERED_TOPIC,
            groupId = "myisland-notifications"
    )
    public void handleUserRegistered(KafkaUserEvent event) {
        log.info("Received user registered event: userId={}, email={}",
                event.userId(), event.email());

        // Send welcome email to new user
        emailService.sendWelcomeEmail(event.email(), event.name());
        log.info("Sent welcome email to: {}", event.email());
    }

    private BookingEmailData createBookingEmailData(KafkaBookingEvent event) {
        return new BookingEmailData(
                event.bookingId(),
                event.userName(),
                event.userEmail(),
                event.lotName(),
                event.ownerPropertyName(),
                event.checkInDate(),
                event.checkOutDate(),
                event.numGuests(),
                event.totalPrice()
        );
    }

    private OfferClaimEmailData createClaimEmailData(KafkaOfferEvent event) {
        return new OfferClaimEmailData(
                event.claimId(),
                event.offerTitle(),
                event.supplierName(),
                event.userName(),
                event.userEmail(),
                event.claimCode()
        );
    }
}
