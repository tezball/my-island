package com.example.myislandapi.model;

import java.time.Instant;
import java.util.UUID;

/**
 * Review model - POJO without JPA annotations.
 */
public class ReviewModel {

    private UUID id;
    private UUID userId;
    private UserModel user; // Transient - loaded when needed
    private UUID campsiteId;
    private UUID bookingId;
    private int rating;
    private String comment;
    private ReviewCategories categories;
    private int helpfulCount = 0;
    private String ownerResponse;
    private Instant createdAt;
    private Instant updatedAt;

    public ReviewModel() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }

    public UUID getCampsiteId() {
        return campsiteId;
    }

    public void setCampsiteId(UUID campsiteId) {
        this.campsiteId = campsiteId;
    }

    public UUID getBookingId() {
        return bookingId;
    }

    public void setBookingId(UUID bookingId) {
        this.bookingId = bookingId;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
