package com.example.myislandapi.service;

import com.example.myislandapi.model.BookingModel;
import com.example.myislandapi.model.UserModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("MMMM d, yyyy");

    private final SesClient sesClient;

    @Value("${aws.ses.from-email}")
    private String fromEmail;

    public EmailService(SesClient sesClient) {
        this.sesClient = sesClient;
    }

    @Async
    public void sendBookingConfirmation(BookingModel booking) {
        UserModel user = booking.getUser();
        String campsiteName = booking.getLot().getCampsite().getName();
        String lotName = booking.getLot().getName();

        String subject = "Booking Confirmation - " + campsiteName;
        String body = String.format("""
            Hello %s,

            Your booking has been confirmed!

            Booking Details:
            - Campsite: %s
            - Lot: %s
            - Check-in: %s
            - Check-out: %s
            - Total: %.2f

            Reference: %s

            We look forward to welcoming you!

            Best regards,
            My Island Team
            """,
                user.getName(),
                campsiteName,
                lotName,
                booking.getCheckIn().format(DATE_FORMAT),
                booking.getCheckOut().format(DATE_FORMAT),
                booking.getTotalPrice(),
                booking.getId().toString().substring(0, 8).toUpperCase()
        );

        sendEmail(user.getEmail(), subject, body);
    }

    @Async
    public void sendBookingCancellation(BookingModel booking) {
        UserModel user = booking.getUser();
        String campsiteName = booking.getLot().getCampsite().getName();

        String subject = "Booking Cancelled - " + campsiteName;
        String body = String.format("""
            Hello %s,

            Your booking has been cancelled.

            Cancelled Booking Details:
            - Campsite: %s
            - Check-in: %s
            - Check-out: %s

            Reference: %s

            If you have any questions, please contact our support team.

            Best regards,
            My Island Team
            """,
                user.getName(),
                campsiteName,
                booking.getCheckIn().format(DATE_FORMAT),
                booking.getCheckOut().format(DATE_FORMAT),
                booking.getId().toString().substring(0, 8).toUpperCase()
        );

        sendEmail(user.getEmail(), subject, body);
    }

    @Async
    public void sendPasswordResetEmail(UserModel user, String resetToken) {
        String subject = "Password Reset Request";
        String resetLink = "https://myisland.local/reset-password?token=" + resetToken;

        String body = String.format("""
            Hello %s,

            We received a request to reset your password.

            Click the link below to reset your password:
            %s

            This link will expire in 1 hour.

            If you didn't request this, please ignore this email.

            Best regards,
            My Island Team
            """,
                user.getName(),
                resetLink
        );

        sendEmail(user.getEmail(), subject, body);
    }

    @Async
    public void sendWelcomeEmail(UserModel user) {
        String subject = "Welcome to My Island!";
        String body = String.format("""
            Hello %s,

            Welcome to My Island - your gateway to amazing camping experiences in Ireland!

            With your new account, you can:
            - Browse beautiful campsites across Ireland
            - Book your perfect camping spot
            - Save your favorite locations
            - Get exclusive offers and discounts

            Start exploring now and find your next adventure!

            Best regards,
            My Island Team
            """,
                user.getName()
        );

        sendEmail(user.getEmail(), subject, body);
    }

    @Async
    public void sendCheckInReminder(BookingModel booking) {
        UserModel user = booking.getUser();
        String campsiteName = booking.getLot().getCampsite().getName();

        String subject = "Reminder: Your check-in is tomorrow - " + campsiteName;
        String body = String.format("""
            Hello %s,

            This is a friendly reminder that your check-in is tomorrow!

            Booking Details:
            - Campsite: %s
            - Lot: %s
            - Check-in: %s (from 2:00 PM)

            We look forward to seeing you!

            Best regards,
            My Island Team
            """,
                user.getName(),
                campsiteName,
                booking.getLot().getName(),
                booking.getCheckIn().format(DATE_FORMAT)
        );

        sendEmail(user.getEmail(), subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SendEmailRequest request = SendEmailRequest.builder()
                    .source(fromEmail)
                    .destination(Destination.builder().toAddresses(to).build())
                    .message(Message.builder()
                            .subject(Content.builder().data(subject).build())
                            .body(Body.builder()
                                    .text(Content.builder().data(body).build())
                                    .build())
                            .build())
                    .build();

            sesClient.sendEmail(request);
            log.info("Email sent successfully to: {}, subject: {}", to, subject);
        } catch (SesException e) {
            log.error("Failed to send email to: {}, error: {}", to, e.getMessage());
        }
    }
}
