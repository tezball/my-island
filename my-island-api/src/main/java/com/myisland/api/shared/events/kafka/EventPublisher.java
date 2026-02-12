package com.myisland.api.shared.events.kafka;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.marketplace.entity.OfferClaim;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.OfferClaimRepository;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.shared.email.BookingEmailData;
import com.myisland.api.shared.email.EmailNotificationService;
import com.myisland.api.shared.email.OfferClaimEmailData;
import com.myisland.api.shared.events.BookingEvent;
import com.myisland.api.shared.events.OfferEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.Optional;

@Component
public class EventPublisher {

    private static final Logger log = LoggerFactory.getLogger(EventPublisher.class);

    private final BookingRepository bookingRepository;
    private final OfferClaimRepository offerClaimRepository;
    private final EmailNotificationService emailService;
    private final OwnerRepository ownerRepository;
    private final SupplierRepository supplierRepository;

    public EventPublisher(BookingRepository bookingRepository,
                          OfferClaimRepository offerClaimRepository,
                          EmailNotificationService emailService,
                          OwnerRepository ownerRepository,
                          SupplierRepository supplierRepository) {
        this.bookingRepository = bookingRepository;
        this.offerClaimRepository = offerClaimRepository;
        this.emailService = emailService;
        this.ownerRepository = ownerRepository;
        this.supplierRepository = supplierRepository;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void handleBookingEvent(BookingEvent event) {
        Booking booking = bookingRepository.findByIdWithDetails(event.getBookingId()).orElse(null);
        if (booking == null) {
            log.warn("Booking not found for event: {}", event.getBookingId());
            return;
        }

        BookingEmailData bookingData = createBookingEmailData(booking);
        String guestEmail = booking.getUser() != null ? booking.getUser().getEmail() : booking.getGuestEmail();

        switch (event.getType()) {
            case CREATED -> {
                sendOwnerBookingEmail(booking, bookingData, "created",
                        (email, data) -> emailService.sendBookingCreatedToOwner(email, data));
                emailService.sendBookingCreatedToGuest(guestEmail, bookingData);
                log.info("Sent booking created emails for booking: {}", booking.getId());
            }
            case CONFIRMED -> {
                emailService.sendBookingConfirmedToGuest(guestEmail, bookingData);
                log.info("Sent booking confirmed email for booking: {}", booking.getId());
            }
            case CANCELLED -> {
                sendOwnerBookingEmail(booking, bookingData, "cancelled",
                        (email, data) -> emailService.sendBookingCancelledToOwner(email, data));
                emailService.sendBookingCancelledToGuest(guestEmail, bookingData);
                log.info("Sent booking cancelled emails for booking: {}", booking.getId());
            }
            default -> {
                emailService.sendBookingConfirmedToGuest(guestEmail, bookingData);
                log.info("Sent booking confirmed email for event type {} on booking: {}", event.getType(), booking.getId());
            }
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void handleOfferEvent(OfferEvent event) {
        OfferClaim claim = offerClaimRepository.findByIdWithDetails(event.getClaimId()).orElse(null);
        if (claim == null) {
            log.warn("Offer claim not found for event: {}", event.getClaimId());
            return;
        }

        switch (event.getType()) {
            case CLAIMED -> {
                if (claim.isTest()) {
                    log.debug("Ignoring test claim event: claimId={}", claim.getId());
                    return;
                }

                OfferClaimEmailData claimData = createClaimEmailData(claim);

                Optional<Supplier> supplierOpt = supplierRepository.findById(claim.getOffer().getSupplier().getId());
                supplierOpt.ifPresent(supplier -> {
                    String supplierEmail = supplier.getUser().getEmail();
                    emailService.sendOfferClaimedToSupplier(supplierEmail, claimData);
                    log.info("Sent claim notification to supplier: {}", supplierEmail);
                });

                emailService.sendVoucherToGuest(claim.getUser().getEmail(), claimData);
                log.info("Sent voucher to guest: {}", claim.getUser().getEmail());
            }
            case REDEEMED -> {
                if (claim.isTest()) {
                    log.debug("Ignoring test redemption event: claimId={}", claim.getId());
                    return;
                }
                log.info("Offer redeemed: claimId={}, offer={}, supplier={}",
                        claim.getId(), claim.getOffer().getTitle(), claim.getOffer().getSupplier().getBusinessName());
            }
        }
    }

    private void sendOwnerBookingEmail(Booking booking, BookingEmailData bookingData,
                                       String eventType, OwnerEmailSender sender) {
        Optional<Owner> ownerOpt = ownerRepository.findById(booking.getLot().getOwner().getId());
        ownerOpt.ifPresent(owner -> {
            if (owner.isEmailNotificationsBookings()) {
                String ownerEmail = owner.getUser().getEmail();
                sender.send(ownerEmail, bookingData);
                log.info("Sent booking {} notification to owner: {}", eventType, ownerEmail);
            } else {
                log.info("Skipping booking {} email for owner {} (notifications disabled)",
                        eventType, owner.getId());
            }
        });
    }

    private BookingEmailData createBookingEmailData(Booking booking) {
        return new BookingEmailData(
                booking.getId(),
                booking.getUser() != null ? booking.getUser().getName() : booking.getGuestName(),
                booking.getUser() != null ? booking.getUser().getEmail() : booking.getGuestEmail(),
                booking.getLot().getName(),
                booking.getLot().getOwner().getPropertyName(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getNumGuests(),
                booking.getTotalPrice()
        );
    }

    private OfferClaimEmailData createClaimEmailData(OfferClaim claim) {
        return new OfferClaimEmailData(
                claim.getId(),
                claim.getOffer().getTitle(),
                claim.getOffer().getSupplier().getBusinessName(),
                claim.getUser().getName(),
                claim.getUser().getEmail(),
                claim.getClaimCode()
        );
    }

    @FunctionalInterface
    private interface OwnerEmailSender {
        void send(String email, BookingEmailData data);
    }
}
