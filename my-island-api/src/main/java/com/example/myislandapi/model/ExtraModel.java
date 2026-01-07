package com.example.myislandapi.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Extra model - POJO without JPA annotations.
 */
public class ExtraModel {

    private UUID id;
    private UUID campsiteId;
    private String name;
    private String description;
    private BigDecimal price;
    private boolean perNight = false;
    private String imageUrl;
    private boolean available = true;
    private Instant createdAt;
    private Instant updatedAt;

    public ExtraModel() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getCampsiteId() {
        return campsiteId;
    }

    public void setCampsiteId(UUID campsiteId) {
        this.campsiteId = campsiteId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public boolean isPerNight() {
        return perNight;
    }

    public void setPerNight(boolean perNight) {
        this.perNight = perNight;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
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
