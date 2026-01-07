package com.example.myislandapi.model;

import java.time.Instant;
import java.util.UUID;

/**
 * Favorite model - POJO without JPA annotations.
 */
public class FavoriteModel {

    private UUID id;
    private UUID userId;
    private UUID campsiteId;
    private CampsiteModel campsite; // Transient - loaded when needed
    private Instant createdAt;
    private Instant updatedAt;

    public FavoriteModel() {
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

    public UUID getCampsiteId() {
        return campsiteId;
    }

    public void setCampsiteId(UUID campsiteId) {
        this.campsiteId = campsiteId;
    }

    public CampsiteModel getCampsite() {
        return campsite;
    }

    public void setCampsite(CampsiteModel campsite) {
        this.campsite = campsite;
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
