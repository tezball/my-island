package com.myisland.api.modules.accommodation.scheduler;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.shared.email.EmailNotificationService;
import com.myisland.api.shared.email.WeeklySummaryEmailData;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class WeeklySummaryScheduler {

    private static final Logger log = LoggerFactory.getLogger(WeeklySummaryScheduler.class);

    private final OwnerRepository ownerRepository;
    private final BookingRepository bookingRepository;
    private final EmailNotificationService emailService;

    public WeeklySummaryScheduler(OwnerRepository ownerRepository,
                                  BookingRepository bookingRepository,
                                  EmailNotificationService emailService) {
        this.ownerRepository = ownerRepository;
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 8 * * MON")
    @SchedulerLock(name = "sendWeeklySummaryReports", lockAtLeastFor = "30m")
    public void sendWeeklySummaries() {
        List<Owner> owners = ownerRepository.findByWeeklySummaryReportsTrue();
        log.info("Sending weekly summaries to {} owners", owners.size());

        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(7);
        LocalDate weekEnd = today.minusDays(1);
        LocalDateTime periodStart = weekStart.atStartOfDay();
        LocalDateTime periodEnd = today.atStartOfDay();

        for (Owner owner : owners) {
            try {
                long newBookings = bookingRepository.countNewBookingsByOwnerIdBetween(
                        owner.getId(), periodStart, periodEnd);
                BigDecimal revenue = bookingRepository.sumRevenueByOwnerIdBetween(
                        owner.getId(), periodStart, periodEnd);

                // Upcoming arrivals and departures for the next 7 days
                long upcomingArrivals = 0;
                long upcomingDepartures = 0;
                for (int i = 0; i < 7; i++) {
                    LocalDate date = today.plusDays(i);
                    upcomingArrivals += bookingRepository.findTodayArrivals(owner.getId(), date).size();
                    upcomingDepartures += bookingRepository.findTodayDepartures(owner.getId(), date).size();
                }

                WeeklySummaryEmailData data = new WeeklySummaryEmailData(
                        owner.getUser().getName(),
                        owner.getPropertyName(),
                        newBookings,
                        revenue,
                        upcomingArrivals,
                        upcomingDepartures,
                        weekStart,
                        weekEnd
                );

                emailService.sendWeeklySummaryToOwner(owner.getUser().getEmail(), data);
                log.debug("Sent weekly summary to owner {}: {} new bookings, {} revenue",
                        owner.getId(), newBookings, revenue);
            } catch (Exception e) {
                log.error("Failed to send weekly summary to owner {}: {}", owner.getId(), e.getMessage());
            }
        }
    }
}
