package com.myisland.api.modules.booking.scheduler;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.shared.email.BookingEmailData;
import com.myisland.api.shared.email.EmailNotificationService;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Component
public class PostStayReviewEmailScheduler {

    private static final Logger log = LoggerFactory.getLogger(PostStayReviewEmailScheduler.class);

    private final BookingRepository bookingRepository;
    private final EmailNotificationService emailService;

    @Value("${myisland.frontend-url}")
    private String frontendUrl;

    public PostStayReviewEmailScheduler(BookingRepository bookingRepository,
                                         EmailNotificationService emailService) {
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 10 * * *") // Daily at 10 AM
    @SchedulerLock(name = "postStayReviewEmail", lockAtLeastFor = "5m", lockAtMostFor = "30m")
    @Transactional
    public void sendPostStayReviewEmails() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        List<Booking> eligibleBookings = bookingRepository.findCompletedBookingsEligibleForReviewEmail(yesterday);

        if (eligibleBookings.isEmpty()) {
            return;
        }

        log.info("Sending post-stay review emails for {} bookings checked out on {}", eligibleBookings.size(), yesterday);

        for (Booking booking : eligibleBookings) {
            try {
                Owner owner = booking.getLot().getOwner();

                BookingEmailData emailData = new BookingEmailData(
                        booking.getId(),
                        booking.getUser().getName(),
                        booking.getUser().getEmail(),
                        booking.getLot().getName(),
                        owner.getPropertyName(),
                        booking.getCheckInDate(),
                        booking.getCheckOutDate(),
                        booking.getNumGuests(),
                        booking.getTotalPrice()
                );

                String reviewUrl = frontendUrl + "/campsite/" + owner.getId() + "#reviews";

                emailService.sendReviewRequestToGuest(booking.getUser().getEmail(), emailData, reviewUrl);

                booking.setReviewEmailSentAt(Instant.now());
                bookingRepository.save(booking);

                log.debug("Sent review request email for booking #{} to {}", booking.getId(), booking.getUser().getEmail());
            } catch (Exception e) {
                log.error("Failed to send review request email for booking #{}: {}", booking.getId(), e.getMessage());
            }
        }
    }
}
