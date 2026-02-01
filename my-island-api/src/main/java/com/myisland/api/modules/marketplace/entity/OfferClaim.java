package com.myisland.api.modules.marketplace.entity;

import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "offer_claims")
public class OfferClaim extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_id", nullable = false)
    private Offer offer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(name = "claim_code", nullable = false, unique = true, length = 50)
    private String claimCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status = ClaimStatus.CLAIMED;

    @Column(name = "is_test", nullable = false)
    private boolean isTest = false;

    @Column(name = "claimed_at", nullable = false)
    private LocalDateTime claimedAt = LocalDateTime.now();

    @Column(name = "redeemed_at")
    private LocalDateTime redeemedAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public enum ClaimStatus {
        CLAIMED, REDEEMED, EXPIRED, CANCELLED
    }

    public OfferClaim() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Offer offer;
        private User user;
        private Booking booking;
        private String claimCode;
        private ClaimStatus status = ClaimStatus.CLAIMED;
        private boolean isTest = false;
        private LocalDateTime claimedAt = LocalDateTime.now();
        private LocalDateTime redeemedAt;
        private LocalDateTime expiresAt;

        public Builder offer(Offer offer) { this.offer = offer; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder booking(Booking booking) { this.booking = booking; return this; }
        public Builder claimCode(String claimCode) { this.claimCode = claimCode; return this; }
        public Builder status(ClaimStatus status) { this.status = status; return this; }
        public Builder isTest(boolean isTest) { this.isTest = isTest; return this; }
        public Builder claimedAt(LocalDateTime claimedAt) { this.claimedAt = claimedAt; return this; }
        public Builder redeemedAt(LocalDateTime redeemedAt) { this.redeemedAt = redeemedAt; return this; }
        public Builder expiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; return this; }

        public OfferClaim build() {
            OfferClaim claim = new OfferClaim();
            claim.offer = this.offer;
            claim.user = this.user;
            claim.booking = this.booking;
            claim.claimCode = this.claimCode;
            claim.status = this.status;
            claim.isTest = this.isTest;
            claim.claimedAt = this.claimedAt;
            claim.redeemedAt = this.redeemedAt;
            claim.expiresAt = this.expiresAt;
            return claim;
        }
    }

    public boolean isValid() {
        return status == ClaimStatus.CLAIMED && LocalDateTime.now().isBefore(expiresAt);
    }

    // Getters and Setters
    public Offer getOffer() { return offer; }
    public void setOffer(Offer offer) { this.offer = offer; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public String getClaimCode() { return claimCode; }
    public void setClaimCode(String claimCode) { this.claimCode = claimCode; }

    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }

    public boolean isTest() { return isTest; }
    public void setTest(boolean test) { isTest = test; }

    public LocalDateTime getClaimedAt() { return claimedAt; }
    public void setClaimedAt(LocalDateTime claimedAt) { this.claimedAt = claimedAt; }

    public LocalDateTime getRedeemedAt() { return redeemedAt; }
    public void setRedeemedAt(LocalDateTime redeemedAt) { this.redeemedAt = redeemedAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
