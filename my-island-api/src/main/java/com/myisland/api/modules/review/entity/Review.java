package com.myisland.api.modules.review.entity;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal rating;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(name = "owner_response", columnDefinition = "TEXT")
    private String ownerResponse;

    @Column(name = "owner_response_at")
    private LocalDateTime ownerResponseAt;

    @Column(name = "is_flagged", nullable = false)
    private boolean isFlagged = false;

    public Review() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private User user;
        private Owner owner;
        private Booking booking;
        private BigDecimal rating;
        private String comment;

        public Builder user(User user) { this.user = user; return this; }
        public Builder owner(Owner owner) { this.owner = owner; return this; }
        public Builder booking(Booking booking) { this.booking = booking; return this; }
        public Builder rating(BigDecimal rating) { this.rating = rating; return this; }
        public Builder comment(String comment) { this.comment = comment; return this; }

        public Review build() {
            Review review = new Review();
            review.user = this.user;
            review.owner = this.owner;
            review.booking = this.booking;
            review.rating = this.rating;
            review.comment = this.comment;
            return review;
        }
    }

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Owner getOwner() { return owner; }
    public void setOwner(Owner owner) { this.owner = owner; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getOwnerResponse() { return ownerResponse; }
    public void setOwnerResponse(String ownerResponse) { this.ownerResponse = ownerResponse; }

    public LocalDateTime getOwnerResponseAt() { return ownerResponseAt; }
    public void setOwnerResponseAt(LocalDateTime ownerResponseAt) { this.ownerResponseAt = ownerResponseAt; }

    public boolean isFlagged() { return isFlagged; }
    public void setFlagged(boolean flagged) { isFlagged = flagged; }
}
