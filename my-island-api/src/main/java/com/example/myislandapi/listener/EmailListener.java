package com.example.myislandapi.listener;

import com.example.myislandapi.config.KafkaConfig;
import com.example.myislandapi.entity.Booking;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.event.EmailEvent;
import com.example.myislandapi.repository.BookingRepository;
import com.example.myislandapi.repository.UserRepository;
import com.example.myislandapi.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class EmailListener {

    private static final Logger log = LoggerFactory.getLogger(EmailListener.class);

    private final EmailService emailService;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public EmailListener(EmailService emailService,
                        UserRepository userRepository,
                        BookingRepository bookingRepository) {
        this.emailService = emailService;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @KafkaListener(
            topics = KafkaConfig.EMAIL_EVENTS_TOPIC,
            groupId = "email-processor"
    )
    public void handleEmailEvent(EmailEvent event) {
        log.info("Received email event: {} for user: {}", event.emailType(), event.userId());

        try {
            User user = userRepository.findById(event.userId()).orElse(null);
            if (user == null) {
                log.warn("User not found for email: {}", event.userId());
                return;
            }

            switch (event.emailType()) {
                case EmailEvent.TYPE_BOOKING_CONFIRMATION -> {
                    Booking booking = bookingRepository.findById(event.referenceId()).orElse(null);
                    if (booking != null) {
                        emailService.sendBookingConfirmation(booking);
                    }
                }
                case EmailEvent.TYPE_BOOKING_CANCELLATION -> {
                    Booking booking = bookingRepository.findById(event.referenceId()).orElse(null);
                    if (booking != null) {
                        emailService.sendBookingCancellation(booking);
                    }
                }
                case EmailEvent.TYPE_WELCOME -> emailService.sendWelcomeEmail(user);
                case EmailEvent.TYPE_CHECK_IN_REMINDER -> {
                    Booking booking = bookingRepository.findById(event.referenceId()).orElse(null);
                    if (booking != null) {
                        emailService.sendCheckInReminder(booking);
                    }
                }
                default -> log.warn("Unknown email type: {}", event.emailType());
            }
        } catch (Exception e) {
            log.error("Error processing email event: {}", e.getMessage(), e);
        }
    }
}
