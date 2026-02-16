package com.myisland.api.modules.booking.scheduler;

import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.shared.events.BookingEvent;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Auto-completes CHECKED_IN bookings that have passed their check-out date.
 * Runs daily.
 */
@Component
public class BookingAutoCompleteScheduler {

    private static final Logger log = LoggerFactory.getLogger(BookingAutoCompleteScheduler.class);

    private final BookingRepository bookingRepository;
    private final ApplicationEventPublisher eventPublisher;

    public BookingAutoCompleteScheduler(BookingRepository bookingRepository, ApplicationEventPublisher eventPublisher) {
        this.bookingRepository = bookingRepository;
        this.eventPublisher = eventPublisher;
    }

    @Scheduled(cron = "0 0 2 * * *") // daily at 2 AM
    @SchedulerLock(name = "bookingAutoComplete", lockAtLeastFor = "5m", lockAtMostFor = "10m")
    @Transactional
    public void autoCompleteExpiredStays() {
        LocalDate today = LocalDate.now();
        List<Booking> expiredStays = bookingRepository.findCheckedInBookingsPastCheckout(today);

        if (expiredStays.isEmpty()) {
            return;
        }

        log.info("Found {} CHECKED_IN bookings past checkout date to auto-complete", expiredStays.size());

        for (Booking booking : expiredStays) {
            booking.setStatus(Booking.BookingStatus.COMPLETED);
            bookingRepository.save(booking);
            eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.CHECKED_OUT));
            log.debug("Auto-completed booking {} (checkout was {})", booking.getId(), booking.getCheckOutDate());
        }
    }
}
