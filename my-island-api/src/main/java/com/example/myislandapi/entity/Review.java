package com.example.myislandapi.entity;

import com.example.myislandapi.entity.ReviewCategories;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "reviews")
public class Review extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campsite_id", nullable = false)
    private Campsite campsite;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Min(1) @Max(5)
    @Column(nullable = false)
    private int rating;

    @NotBlank
    @Column(length = 2000, nullable = false)
    private String comment;

    @Embedded
    private ReviewCategories categories;

    @Column(name = "helpful_count")
    private int helpfulCount = 0;

    @Column(name = "owner_response", length = 1000)
    private String ownerResponse;

    public Review() {}

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Campsite getCampsite() {
        return campsite;
    }

    public void setCampsite(Campsite campsite) {
        this.campsite = campsite;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ReviewCategories getCategories() {
        return categories;
    }

    public void setCategories(ReviewCategories categories) {
        this.categories = categories;
    }

    public int getHelpfulCount() {
        return helpfulCount;
    }

    public void setHelpfulCount(int helpfulCount) {
        this.helpfulCount = helpfulCount;
    }

    public String getOwnerResponse() {
        return ownerResponse;
    }

    public void setOwnerResponse(String ownerResponse) {
        this.ownerResponse = ownerResponse;
    }

    public void incrementHelpfulCount() {
        this.helpfulCount++;
    }
}
