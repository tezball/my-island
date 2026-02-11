package com.myisland.api.shared.email;

public interface EmailNotificationService {
    void sendWelcomeEmail(String toEmail, String userName);
    void sendBookingCreatedToOwner(String ownerEmail, BookingEmailData bookingData);
    void sendBookingCreatedToGuest(String guestEmail, BookingEmailData bookingData);
    void sendBookingConfirmedToGuest(String guestEmail, BookingEmailData bookingData);
    void sendBookingCancelledToOwner(String ownerEmail, BookingEmailData bookingData);
    void sendBookingCancelledToGuest(String guestEmail, BookingEmailData bookingData);
    void sendOfferClaimedToSupplier(String supplierEmail, OfferClaimEmailData claimData);
    void sendVoucherToGuest(String guestEmail, OfferClaimEmailData claimData);
    void sendPasswordResetEmail(String toEmail, String userName, String token);
    void sendEmailVerificationEmail(String toEmail, String userName, String token);
    void sendWeeklySummaryToOwner(String ownerEmail, WeeklySummaryEmailData data);
    void sendPreArrivalEmailToGuest(String guestEmail, BookingEmailData bookingData, String county, String phone, String mapUrl);
}
