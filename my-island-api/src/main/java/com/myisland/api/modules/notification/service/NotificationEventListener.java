package com.myisland.api.modules.notification.service;

import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.marketplace.entity.OfferClaim;
import com.myisland.api.modules.marketplace.repository.OfferClaimRepository;
import com.myisland.api.modules.notification.entity.Notification.NotificationType;
import com.myisland.api.shared.events.BookingEvent;
import com.myisland.api.shared.events.OfferEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class NotificationEventListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventListener.class);

    private final NotificationService notificationService;
    private final BookingRepository bookingRepository;
    private final OfferClaimRepository offerClaimRepository;

    public NotificationEventListener(NotificationService notificationService,
                                      BookingRepository bookingRepository,
                                      OfferClaimRepository offerClaimRepository) {
        this.notificationService = notificationService;
        this.bookingRepository = bookingRepository;
        this.offerClaimRepository = offerClaimRepository;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void handleBookingEvent(BookingEvent event) {
        Booking booking = bookingRepository.findByIdWithDetails(event.getBookingId()).orElse(null);
        if (booking == null) {
            log.warn("Booking not found for notification: {}", event.getBookingId());
            return;
        }

        User owner = booking.getLot().getOwner().getUser();
        User guest = booking.getUser();
        String guestName = guest != null ? guest.getName() : booking.getGuestName();
        String lotName = booking.getLot().getName();

        switch (event.getType()) {
            case CREATED -> {
                // Notify owner: new booking received
                notificationService.createNotification(
                        owner,
                        NotificationType.BOOKING_CREATED,
                        "New Booking",
                        guestName + " booked " + lotName + " (" + booking.getCheckInDate() + " - " + booking.getCheckOutDate() + ")",
                        "/owner/bookings"
                );
                // Notify guest: booking submitted
                if (guest != null) {
                    notificationService.createNotification(
                            guest,
                            NotificationType.BOOKING_CREATED,
                            "Booking Submitted",
                            "Your booking for " + lotName + " has been submitted and is awaiting confirmation.",
                            "/trips"
                    );
                }
            }
            case CONFIRMED -> {
                // Notify guest: booking confirmed
                if (guest != null) {
                    notificationService.createNotification(
                            guest,
                            NotificationType.BOOKING_CONFIRMED,
                            "Booking Confirmed",
                            "Your booking for " + lotName + " has been confirmed! Check in on " + booking.getCheckInDate() + ".",
                            "/trips"
                    );
                }
            }
            case CANCELLED -> {
                // Notify owner if guest cancelled
                if (guest != null) {
                    notificationService.createNotification(
                            owner,
                            NotificationType.BOOKING_CANCELLED,
                            "Booking Cancelled",
                            guestName + " cancelled their booking for " + lotName + ".",
                            "/owner/bookings"
                    );
                }
                // Notify guest
                if (guest != null) {
                    notificationService.createNotification(
                            guest,
                            NotificationType.BOOKING_CANCELLED,
                            "Booking Cancelled",
                            "Your booking for " + lotName + " has been cancelled.",
                            "/trips"
                    );
                }
            }
            case CHECKED_IN -> {
                if (guest != null) {
                    notificationService.createNotification(
                            guest,
                            NotificationType.BOOKING_CHECKED_IN,
                            "Checked In",
                            "Welcome! You've been checked in to " + lotName + ". Enjoy your stay!",
                            "/trips"
                    );
                }
            }
            case CHECKED_OUT -> {
                if (guest != null) {
                    notificationService.createNotification(
                            guest,
                            NotificationType.BOOKING_CHECKED_OUT,
                            "Stay Complete",
                            "Thanks for staying at " + lotName + "! We hope you had a great time.",
                            "/trips"
                    );
                }
            }
            default -> log.debug("Unhandled booking event type for notifications: {}", event.getType());
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void handleOfferEvent(OfferEvent event) {
        OfferClaim claim = offerClaimRepository.findByIdWithDetails(event.getClaimId()).orElse(null);
        if (claim == null || claim.isTest()) {
            return;
        }

        User supplier = claim.getOffer().getSupplier().getUser();
        User guest = claim.getUser();
        String offerTitle = claim.getOffer().getTitle();

        switch (event.getType()) {
            case CLAIMED -> {
                // Notify supplier
                notificationService.createNotification(
                        supplier,
                        NotificationType.OFFER_CLAIMED,
                        "New Voucher Claim",
                        guest.getName() + " claimed your offer \"" + offerTitle + "\".",
                        "/supplier/claims"
                );
                // Notify guest
                notificationService.createNotification(
                        guest,
                        NotificationType.OFFER_CLAIMED,
                        "Voucher Claimed",
                        "You claimed \"" + offerTitle + "\". Show your voucher code to redeem.",
                        "/vouchers"
                );
            }
            case REDEEMED -> {
                notificationService.createNotification(
                        guest,
                        NotificationType.OFFER_REDEEMED,
                        "Voucher Redeemed",
                        "Your voucher for \"" + offerTitle + "\" has been redeemed.",
                        "/vouchers"
                );
            }
        }
    }
}
