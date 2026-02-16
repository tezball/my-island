package com.myisland.api.modules.review.entity;

import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.marketplace.entity.OfferClaim;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.review.entity.Review;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "supplier_reviews")
public class SupplierReview extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_claim_id", nullable = false, unique = true)
    private OfferClaim offerClaim;

    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal rating;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(name = "supplier_response", columnDefinition = "TEXT")
    private String supplierResponse;

    @Column(name = "supplier_response_at")
    private LocalDateTime supplierResponseAt;

    @Column(name = "is_flagged", nullable = false)
    private boolean isFlagged = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "moderation_status", nullable = false)
    private Review.ModerationStatus moderationStatus = Review.ModerationStatus.APPROVED;

    @Column(name = "moderation_reason", columnDefinition = "TEXT")
    private String moderationReason;

    @Column(name = "moderated_at")
    private LocalDateTime moderatedAt;

    public SupplierReview() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private User user;
        private Supplier supplier;
        private OfferClaim offerClaim;
        private BigDecimal rating;
        private String comment;

        public Builder user(User user) { this.user = user; return this; }
        public Builder supplier(Supplier supplier) { this.supplier = supplier; return this; }
        public Builder offerClaim(OfferClaim offerClaim) { this.offerClaim = offerClaim; return this; }
        public Builder rating(BigDecimal rating) { this.rating = rating; return this; }
        public Builder comment(String comment) { this.comment = comment; return this; }

        public SupplierReview build() {
            SupplierReview review = new SupplierReview();
            review.user = this.user;
            review.supplier = this.supplier;
            review.offerClaim = this.offerClaim;
            review.rating = this.rating;
            review.comment = this.comment;
            return review;
        }
    }

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public OfferClaim getOfferClaim() { return offerClaim; }
    public void setOfferClaim(OfferClaim offerClaim) { this.offerClaim = offerClaim; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getSupplierResponse() { return supplierResponse; }
    public void setSupplierResponse(String supplierResponse) { this.supplierResponse = supplierResponse; }

    public LocalDateTime getSupplierResponseAt() { return supplierResponseAt; }
    public void setSupplierResponseAt(LocalDateTime supplierResponseAt) { this.supplierResponseAt = supplierResponseAt; }

    public boolean isFlagged() { return isFlagged; }
    public void setFlagged(boolean flagged) { isFlagged = flagged; }

    public Review.ModerationStatus getModerationStatus() { return moderationStatus; }
    public void setModerationStatus(Review.ModerationStatus moderationStatus) { this.moderationStatus = moderationStatus; }

    public String getModerationReason() { return moderationReason; }
    public void setModerationReason(String moderationReason) { this.moderationReason = moderationReason; }

    public LocalDateTime getModeratedAt() { return moderatedAt; }
    public void setModeratedAt(LocalDateTime moderatedAt) { this.moderatedAt = moderatedAt; }
}
