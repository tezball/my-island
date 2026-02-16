package com.myisland.api.modules.booking.scheduler;

import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.booking.service.BookingPaymentService;
import com.stripe.exception.StripeException;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Cancels stale PENDING_PAYMENT bookings that have not been paid within 30 minutes.
 * Releases any Stripe authorization holds.
 */
@Component
public class BookingCleanupScheduler {

    private static final Logger log = LoggerFactory.getLogger(BookingCleanupScheduler.class);
    private static final int STALE_MINUTES = 30;

    private final BookingRepository bookingRepository;
    private final BookingPaymentService bookingPaymentService;

    public BookingCleanupScheduler(BookingRepository bookingRepository, BookingPaymentService bookingPaymentService) {
        this.bookingRepository = bookingRepository;
        this.bookingPaymentService = bookingPaymentService;
    }

    @Scheduled(fixedRate = 3600000) // every hour
    @SchedulerLock(name = "bookingCleanup", lockAtLeastFor = "5m", lockAtMostFor = "10m")
    @Transactional
    public void cancelStalePendingPayments() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(STALE_MINUTES);
        List<Booking> staleBookings = bookingRepository.findStalePendingPaymentBookings(cutoff);

        if (staleBookings.isEmpty()) {
            return;
        }

        log.info("Found {} stale PENDING_PAYMENT bookings to cancel", staleBookings.size());

        for (Booking booking : staleBookings) {
            try {
                // Release any Stripe authorization hold
                if (booking.getPaymentStatus() == Booking.PaymentStatus.AUTHORIZED) {
                    bookingPaymentService.releaseAuthorization(booking.getId());
                }

                booking.setStatus(Booking.BookingStatus.CANCELLED);
                bookingRepository.save(booking);
                log.debug("Auto-cancelled stale PENDING_PAYMENT booking {}", booking.getId());
            } catch (StripeException e) {
                log.error("Failed to release authorization for stale booking {}: {}", booking.getId(), e.getMessage());
                // Still cancel the booking even if Stripe release fails
                booking.setStatus(Booking.BookingStatus.CANCELLED);
                bookingRepository.save(booking);
            }
        }
    }
}
