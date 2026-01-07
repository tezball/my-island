package com.example.myislandapi.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * BookingExtra model - POJO without JPA annotations.
 */
public class BookingExtraModel {

    private UUID id;
    private UUID bookingId;
    private UUID extraId;
    private ExtraModel extra; // Transient - loaded when needed
    private int quantity = 1;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private Instant createdAt;
    private Instant updatedAt;

    public BookingExtraModel() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getBookingId() {
        return bookingId;
    }

    public void setBookingId(UUID bookingId) {
        this.bookingId = bookingId;
    }

    public UUID getExtraId() {
        return extraId;
    }

    public void setExtraId(UUID extraId) {
        this.extraId = extraId;
    }

    public ExtraModel getExtra() {
        return extra;
    }

    public void setExtra(ExtraModel extra) {
        this.extra = extra;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
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

    public void calculateTotalPrice(long nights, boolean perNight) {
        if (perNight) {
            this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity * nights));
        } else {
            this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }
}
