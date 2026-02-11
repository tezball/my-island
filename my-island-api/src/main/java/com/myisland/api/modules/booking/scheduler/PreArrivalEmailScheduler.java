package com.myisland.api.modules.booking.scheduler;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.shared.email.BookingEmailData;
import com.myisland.api.shared.email.EmailNotificationService;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class PreArrivalEmailScheduler {

    private static final Logger log = LoggerFactory.getLogger(PreArrivalEmailScheduler.class);

    private final BookingRepository bookingRepository;
    private final EmailNotificationService emailService;

    public PreArrivalEmailScheduler(BookingRepository bookingRepository,
                                     EmailNotificationService emailService) {
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 9 * * *") // Daily at 9 AM
    @SchedulerLock(name = "sendPreArrivalEmails", lockAtLeastFor = "30m", lockAtMostFor = "1h")
    public void sendPreArrivalEmails() {
        LocalDate arrivalDate = LocalDate.now().plusDays(2);
        List<Booking> upcomingBookings = bookingRepository.findConfirmedArrivalsForDate(arrivalDate);

        log.info("Sending pre-arrival emails for {} bookings arriving on {}", upcomingBookings.size(), arrivalDate);

        for (Booking booking : upcomingBookings) {
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

                String county = owner.getCounty() != null ? owner.getCounty() : "";
                String phone = owner.getPhone() != null ? owner.getPhone() : "";
                String mapUrl = "";
                if (owner.getLatitude() != null && owner.getLongitude() != null) {
                    mapUrl = "https://www.google.com/maps?q=" + owner.getLatitude() + "," + owner.getLongitude();
                }

                emailService.sendPreArrivalEmailToGuest(
                        booking.getUser().getEmail(), emailData, county, phone, mapUrl);

                log.info("Sent pre-arrival email for booking #{} to {}", booking.getId(), booking.getUser().getEmail());
            } catch (Exception e) {
                log.error("Failed to send pre-arrival email for booking #{}: {}", booking.getId(), e.getMessage());
            }
        }
    }
}
