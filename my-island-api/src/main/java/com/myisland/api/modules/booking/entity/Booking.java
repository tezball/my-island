package com.myisland.api.modules.booking.entity;

import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id", nullable = false)
    private Lot lot;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @Column(name = "num_guests", nullable = false)
    private int numGuests = 1;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING_PAYMENT;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    // Payment fields
    @Column(name = "stripe_payment_intent_id")
    private String stripePaymentIntentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.NONE;

    @Column(name = "payment_captured_at")
    private Instant paymentCapturedAt;

    @Column(name = "refund_amount", precision = 10, scale = 2)
    private BigDecimal refundAmount;

    @Column(name = "service_fee", precision = 10, scale = 2)
    private BigDecimal serviceFee;

    @Column(name = "charge_total", precision = 10, scale = 2)
    private BigDecimal chargeTotal;

    @Column(name = "stripe_transfer_id")
    private String stripeTransferId;

    @Column(name = "review_email_sent_at")
    private Instant reviewEmailSentAt;

    // Manual booking fields
    @Column(name = "guest_name")
    private String guestName;

    @Column(name = "guest_email")
    private String guestEmail;

    @Column(name = "guest_phone")
    private String guestPhone;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_source", nullable = false)
    private BookingSource bookingSource = BookingSource.ONLINE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_owner_id")
    private Owner createdByOwner;

    public enum BookingSource {
        ONLINE, DIRECT, PHONE, WALKIN
    }

    public enum BookingStatus {
        PENDING_PAYMENT,  // Booking created, awaiting payment authorization
        PENDING,          // Payment authorized, awaiting owner confirmation
        CONFIRMED,        // Owner confirmed, payment captured
        CHECKED_IN,       // Guest has checked in
        CANCELLED,        // Booking cancelled
        COMPLETED,        // Stay completed
        PAYMENT_FAILED    // Payment authorization failed
    }

    public enum PaymentStatus {
        NONE,       // No payment initiated
        AUTHORIZED, // Payment authorized (hold placed)
        CAPTURED,   // Payment captured (charged)
        RELEASED,   // Authorization released (no charge)
        REFUNDED,   // Payment refunded
        FAILED      // Payment failed
    }

    public Booking() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private User user;
        private Lot lot;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private int numGuests = 1;
        private BigDecimal totalPrice;
        private BookingStatus status = BookingStatus.PENDING_PAYMENT;
        private String specialRequests;
        private BigDecimal serviceFee;
        private BigDecimal chargeTotal;
        private String guestName;
        private String guestEmail;
        private String guestPhone;
        private BookingSource bookingSource = BookingSource.ONLINE;
        private Owner createdByOwner;

        public Builder user(User user) { this.user = user; return this; }
        public Builder lot(Lot lot) { this.lot = lot; return this; }
        public Builder checkInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; return this; }
        public Builder checkOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; return this; }
        public Builder numGuests(int numGuests) { this.numGuests = numGuests; return this; }
        public Builder totalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; return this; }
        public Builder status(BookingStatus status) { this.status = status; return this; }
        public Builder specialRequests(String specialRequests) { this.specialRequests = specialRequests; return this; }
        public Builder serviceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; return this; }
        public Builder chargeTotal(BigDecimal chargeTotal) { this.chargeTotal = chargeTotal; return this; }
        public Builder guestName(String guestName) { this.guestName = guestName; return this; }
        public Builder guestEmail(String guestEmail) { this.guestEmail = guestEmail; return this; }
        public Builder guestPhone(String guestPhone) { this.guestPhone = guestPhone; return this; }
        public Builder bookingSource(BookingSource bookingSource) { this.bookingSource = bookingSource; return this; }
        public Builder createdByOwner(Owner createdByOwner) { this.createdByOwner = createdByOwner; return this; }

        public Booking build() {
            Booking booking = new Booking();
            booking.user = this.user;
            booking.lot = this.lot;
            booking.checkInDate = this.checkInDate;
            booking.checkOutDate = this.checkOutDate;
            booking.numGuests = this.numGuests;
            booking.totalPrice = this.totalPrice;
            booking.status = this.status;
            booking.specialRequests = this.specialRequests;
            booking.serviceFee = this.serviceFee;
            booking.chargeTotal = this.chargeTotal;
            booking.guestName = this.guestName;
            booking.guestEmail = this.guestEmail;
            booking.guestPhone = this.guestPhone;
            booking.bookingSource = this.bookingSource;
            booking.createdByOwner = this.createdByOwner;
            return booking;
        }
    }

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Lot getLot() { return lot; }
    public void setLot(Lot lot) { this.lot = lot; }

    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

    public int getNumGuests() { return numGuests; }
    public void setNumGuests(int numGuests) { this.numGuests = numGuests; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    // Payment getters and setters
    public String getStripePaymentIntentId() { return stripePaymentIntentId; }
    public void setStripePaymentIntentId(String stripePaymentIntentId) { this.stripePaymentIntentId = stripePaymentIntentId; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public Instant getPaymentCapturedAt() { return paymentCapturedAt; }
    public void setPaymentCapturedAt(Instant paymentCapturedAt) { this.paymentCapturedAt = paymentCapturedAt; }

    public BigDecimal getRefundAmount() { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }

    public BigDecimal getServiceFee() { return serviceFee; }
    public void setServiceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; }

    public BigDecimal getChargeTotal() { return chargeTotal; }
    public void setChargeTotal(BigDecimal chargeTotal) { this.chargeTotal = chargeTotal; }

    public String getStripeTransferId() { return stripeTransferId; }
    public void setStripeTransferId(String stripeTransferId) { this.stripeTransferId = stripeTransferId; }

    // Manual booking getters and setters
    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

    public String getGuestPhone() { return guestPhone; }
    public void setGuestPhone(String guestPhone) { this.guestPhone = guestPhone; }

    public BookingSource getBookingSource() { return bookingSource; }
    public void setBookingSource(BookingSource bookingSource) { this.bookingSource = bookingSource; }

    public Owner getCreatedByOwner() { return createdByOwner; }
    public void setCreatedByOwner(Owner createdByOwner) { this.createdByOwner = createdByOwner; }

    public Instant getReviewEmailSentAt() { return reviewEmailSentAt; }
    public void setReviewEmailSentAt(Instant reviewEmailSentAt) { this.reviewEmailSentAt = reviewEmailSentAt; }
}
