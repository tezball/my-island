package com.example.myislandapi.model;

import com.example.myislandapi.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Booking model - POJO without JPA annotations.
 */
public class BookingModel {

    private UUID id;
    private UUID userId;
    private UserModel user; // Transient - loaded when needed
    private UUID lotId;
    private LotModel lot; // Transient - loaded when needed
    private LocalDate checkIn;
    private LocalDate checkOut;
    private int guests;
    private BookingStatus status = BookingStatus.PENDING;
    private BigDecimal lotPrice;
    private BigDecimal extrasPrice = BigDecimal.ZERO;
    private BigDecimal serviceFee = BigDecimal.ZERO;
    private BigDecimal totalPrice;
    private List<BookingExtraModel> bookingExtras = new ArrayList<>();
    private String specialRequests;
    private String cancellationReason;
    private Instant createdAt;
    private Instant updatedAt;

    public BookingModel() {
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

    public UUID getLotId() {
        return lotId;
    }

    public void setLotId(UUID lotId) {
        this.lotId = lotId;
    }

    public LotModel getLot() {
        return lot;
    }

    public void setLot(LotModel lot) {
        this.lot = lot;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }

    public int getGuests() {
        return guests;
    }

    public void setGuests(int guests) {
        this.guests = guests;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public BigDecimal getLotPrice() {
        return lotPrice;
    }

    public void setLotPrice(BigDecimal lotPrice) {
        this.lotPrice = lotPrice;
    }

    public BigDecimal getExtrasPrice() {
        return extrasPrice;
    }

    public void setExtrasPrice(BigDecimal extrasPrice) {
        this.extrasPrice = extrasPrice;
    }

    public BigDecimal getServiceFee() {
        return serviceFee;
    }

    public void setServiceFee(BigDecimal serviceFee) {
        this.serviceFee = serviceFee;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<BookingExtraModel> getBookingExtras() {
        return bookingExtras;
    }

    public void setBookingExtras(List<BookingExtraModel> bookingExtras) {
        this.bookingExtras = bookingExtras;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
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

    public long getNights() {
        return ChronoUnit.DAYS.between(checkIn, checkOut);
    }
}
