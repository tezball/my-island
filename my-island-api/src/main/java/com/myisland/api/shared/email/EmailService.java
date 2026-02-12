package com.myisland.api.shared.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

@Service
public class EmailService implements EmailNotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final EmailSender emailSender;
    private final EmailTemplateRenderer templateRenderer;

    @Value("${myisland.frontend-url}")
    private String frontendUrl;

    public EmailService(EmailSender emailSender, EmailTemplateRenderer templateRenderer) {
        this.emailSender = emailSender;
        this.templateRenderer = templateRenderer;
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        Context context = new Context();
        context.setVariable("userName", userName);

        sendEmail(toEmail, "Welcome to My Island!", "welcome", context);
    }

    @Async
    public void sendBookingCreatedToOwner(String ownerEmail, BookingEmailData bookingData) {
        Context context = createBookingContext(bookingData);

        sendEmail(ownerEmail, "New Booking Request - " + bookingData.lotName(), "booking-created-owner", context);
    }

    @Async
    public void sendBookingCreatedToGuest(String guestEmail, BookingEmailData bookingData) {
        Context context = createBookingContext(bookingData);

        sendEmail(guestEmail, "Booking Request Received - " + bookingData.propertyName(), "booking-created-guest", context);
    }

    @Async
    public void sendBookingConfirmedToGuest(String guestEmail, BookingEmailData bookingData) {
        Context context = createBookingContext(bookingData);

        sendEmail(guestEmail, "Booking Confirmed - " + bookingData.propertyName(), "booking-confirmed", context);
    }

    @Async
    public void sendBookingCancelledToOwner(String ownerEmail, BookingEmailData bookingData) {
        Context context = createBookingContext(bookingData);

        sendEmail(ownerEmail, "Booking Cancelled - " + bookingData.lotName(), "booking-cancelled-owner", context);
    }

    @Async
    public void sendBookingCancelledToGuest(String guestEmail, BookingEmailData bookingData) {
        Context context = createBookingContext(bookingData);

        sendEmail(guestEmail, "Booking Cancelled - " + bookingData.propertyName(), "booking-cancelled-guest", context);
    }

    @Async
    public void sendOfferClaimedToSupplier(String supplierEmail, OfferClaimEmailData claimData) {
        Context context = createClaimContext(claimData);

        sendEmail(supplierEmail, "New Offer Claim - " + claimData.offerTitle(), "offer-claimed-supplier", context);
    }

    @Async
    public void sendVoucherToGuest(String guestEmail, OfferClaimEmailData claimData) {
        Context context = createClaimContext(claimData);

        sendEmail(guestEmail, "Your Voucher - " + claimData.offerTitle(), "voucher", context);
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String userName, String token) {
        Context context = new Context();
        context.setVariable("userName", userName);
        context.setVariable("resetLink", frontendUrl + "/reset-password?token=" + token);

        sendEmail(toEmail, "Reset Your Password - My Island", "password-reset", context);
    }

    @Async
    public void sendEmailVerificationEmail(String toEmail, String userName, String token) {
        Context context = new Context();
        context.setVariable("userName", userName);
        context.setVariable("verifyLink", frontendUrl + "/verify-email?token=" + token);

        sendEmail(toEmail, "Verify Your Email - My Island", "email-verification", context);
    }

    @Async
    public void sendWeeklySummaryToOwner(String ownerEmail, WeeklySummaryEmailData data) {
        Context context = new Context();
        context.setVariable("ownerName", data.ownerName());
        context.setVariable("propertyName", data.propertyName());
        context.setVariable("newBookingsCount", data.newBookingsCount());
        context.setVariable("totalRevenue", data.totalRevenue());
        context.setVariable("upcomingArrivals", data.upcomingArrivals());
        context.setVariable("upcomingDepartures", data.upcomingDepartures());
        context.setVariable("weekStart", data.weekStart());
        context.setVariable("weekEnd", data.weekEnd());
        context.setVariable("dashboardUrl", frontendUrl + "/owner/dashboard");

        sendEmail(ownerEmail, "Your Weekly Summary - " + data.propertyName(), "weekly-summary", context);
    }

    @Async
    public void sendPreArrivalEmailToGuest(String guestEmail, BookingEmailData bookingData, String county, String phone, String mapUrl) {
        Context context = createBookingContext(bookingData);
        context.setVariable("county", county);
        context.setVariable("phone", phone);
        context.setVariable("mapUrl", mapUrl);
        context.setVariable("tripsUrl", frontendUrl + "/trips");
        context.setVariable("marketplaceUrl", frontendUrl + "/marketplace");

        sendEmail(guestEmail, "Your Trip is Coming Up! - " + bookingData.propertyName(), "pre-arrival", context);
    }

    @Async
    public void sendReviewRequestToGuest(String guestEmail, BookingEmailData bookingData, String reviewUrl) {
        Context context = createBookingContext(bookingData);
        context.setVariable("reviewUrl", reviewUrl);

        sendEmail(guestEmail, "How was your stay at " + bookingData.propertyName() + "?", "post-stay-review", context);
    }

    private Context createBookingContext(BookingEmailData bookingData) {
        Context context = new Context();
        context.setVariable("bookingId", bookingData.bookingId());
        context.setVariable("guestName", bookingData.guestName());
        context.setVariable("guestEmail", bookingData.guestEmail());
        context.setVariable("lotName", bookingData.lotName());
        context.setVariable("propertyName", bookingData.propertyName());
        context.setVariable("checkInDate", bookingData.checkInDate());
        context.setVariable("checkOutDate", bookingData.checkOutDate());
        context.setVariable("numGuests", bookingData.numGuests());
        context.setVariable("totalPrice", bookingData.totalPrice());
        return context;
    }

    private Context createClaimContext(OfferClaimEmailData claimData) {
        Context context = new Context();
        context.setVariable("claimId", claimData.claimId());
        context.setVariable("offerTitle", claimData.offerTitle());
        context.setVariable("supplierName", claimData.supplierName());
        context.setVariable("guestName", claimData.guestName());
        context.setVariable("guestEmail", claimData.guestEmail());
        context.setVariable("claimCode", claimData.claimCode());
        return context;
    }

    private void sendEmail(String toEmail, String subject, String templateName, Context context) {
        try {
            String htmlContent = templateRenderer.render(templateName, context);
            emailSender.send(toEmail, subject, htmlContent);
        } catch (Exception e) {
            log.error("Unexpected error sending email: to={}, subject={}, error={}", toEmail, subject, e.getMessage());
        }
    }
}
