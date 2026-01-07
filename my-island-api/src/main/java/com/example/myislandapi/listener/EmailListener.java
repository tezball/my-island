package com.example.myislandapi.listener;

import com.example.myislandapi.config.KafkaConfig;
import com.example.myislandapi.event.EmailEvent;
import com.example.myislandapi.model.BookingModel;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.LotModel;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.repository.jdbc.JdbcBookingRepository;
import com.example.myislandapi.repository.jdbc.JdbcCampsiteRepository;
import com.example.myislandapi.repository.jdbc.JdbcLotRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
import com.example.myislandapi.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class EmailListener {

    private static final Logger log = LoggerFactory.getLogger(EmailListener.class);

    private final EmailService emailService;
    private final JdbcUserRepository userRepository;
    private final JdbcBookingRepository bookingRepository;
    private final JdbcLotRepository lotRepository;
    private final JdbcCampsiteRepository campsiteRepository;

    public EmailListener(EmailService emailService,
                        JdbcUserRepository userRepository,
                        JdbcBookingRepository bookingRepository,
                        JdbcLotRepository lotRepository,
                        JdbcCampsiteRepository campsiteRepository) {
        this.emailService = emailService;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.lotRepository = lotRepository;
        this.campsiteRepository = campsiteRepository;
    }

    @KafkaListener(
            topics = KafkaConfig.EMAIL_EVENTS_TOPIC,
            groupId = "email-processor"
    )
    public void handleEmailEvent(EmailEvent event) {
        log.info("Received email event: {} for user: {}", event.emailType(), event.userId());

        try {
            UserModel user = userRepository.findById(event.userId()).orElse(null);
            if (user == null) {
                log.warn("User not found for email: {}", event.userId());
                return;
            }

            switch (event.emailType()) {
                case EmailEvent.TYPE_BOOKING_CONFIRMATION -> {
                    BookingModel booking = loadBookingWithRelations(event.referenceId());
                    if (booking != null) {
                        emailService.sendBookingConfirmation(booking);
                    }
                }
                case EmailEvent.TYPE_BOOKING_CANCELLATION -> {
                    BookingModel booking = loadBookingWithRelations(event.referenceId());
                    if (booking != null) {
                        emailService.sendBookingCancellation(booking);
                    }
                }
                case EmailEvent.TYPE_WELCOME -> emailService.sendWelcomeEmail(user);
                case EmailEvent.TYPE_CHECK_IN_REMINDER -> {
                    BookingModel booking = loadBookingWithRelations(event.referenceId());
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

    private BookingModel loadBookingWithRelations(java.util.UUID bookingId) {
        BookingModel booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) return null;

        // Load user
        userRepository.findById(booking.getUserId()).ifPresent(booking::setUser);

        // Load lot and campsite
        lotRepository.findById(booking.getLotId()).ifPresent(lot -> {
            booking.setLot(lot);
            campsiteRepository.findById(lot.getCampsiteId()).ifPresent(lot::setCampsite);
        });

        return booking;
    }
}
