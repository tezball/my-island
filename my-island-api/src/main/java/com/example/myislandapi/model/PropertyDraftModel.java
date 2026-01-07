package com.example.myislandapi.model;

import com.example.myislandapi.enums.PropertyType;

import java.time.Instant;
import java.util.UUID;

/**
 * PropertyDraft model - POJO without JPA annotations.
 */
public class PropertyDraftModel {

    private UUID id;
    private UUID ownerId;
    private PropertyType propertyType;
    private String data; // JSON string
    private Instant createdAt;
    private Instant updatedAt;

    public PropertyDraftModel() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public PropertyType getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(PropertyType propertyType) {
        this.propertyType = propertyType;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
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
