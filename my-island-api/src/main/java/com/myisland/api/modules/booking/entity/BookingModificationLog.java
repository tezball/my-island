package com.myisland.api.modules.booking.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking_modification_log")
public class BookingModificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "modified_by_user_id", nullable = false)
    private Long modifiedByUserId;

    @Column(name = "modification_type", length = 30, nullable = false)
    private String modificationType;

    @Column(name = "previous_lot_id")
    private Long previousLotId;

    @Column(name = "previous_check_in_date")
    private LocalDate previousCheckInDate;

    @Column(name = "previous_check_out_date")
    private LocalDate previousCheckOutDate;

    @Column(name = "previous_total_price", precision = 10, scale = 2)
    private BigDecimal previousTotalPrice;

    @Column(name = "new_lot_id")
    private Long newLotId;

    @Column(name = "new_check_in_date")
    private LocalDate newCheckInDate;

    @Column(name = "new_check_out_date")
    private LocalDate newCheckOutDate;

    @Column(name = "new_total_price", precision = 10, scale = 2)
    private BigDecimal newTotalPrice;

    @Column(name = "price_adjustment", precision = 10, scale = 2)
    private BigDecimal priceAdjustment;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public BookingModificationLog() {}

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public Long getModifiedByUserId() { return modifiedByUserId; }
    public void setModifiedByUserId(Long modifiedByUserId) { this.modifiedByUserId = modifiedByUserId; }

    public String getModificationType() { return modificationType; }
    public void setModificationType(String modificationType) { this.modificationType = modificationType; }

    public Long getPreviousLotId() { return previousLotId; }
    public void setPreviousLotId(Long previousLotId) { this.previousLotId = previousLotId; }

    public LocalDate getPreviousCheckInDate() { return previousCheckInDate; }
    public void setPreviousCheckInDate(LocalDate previousCheckInDate) { this.previousCheckInDate = previousCheckInDate; }

    public LocalDate getPreviousCheckOutDate() { return previousCheckOutDate; }
    public void setPreviousCheckOutDate(LocalDate previousCheckOutDate) { this.previousCheckOutDate = previousCheckOutDate; }

    public BigDecimal getPreviousTotalPrice() { return previousTotalPrice; }
    public void setPreviousTotalPrice(BigDecimal previousTotalPrice) { this.previousTotalPrice = previousTotalPrice; }

    public Long getNewLotId() { return newLotId; }
    public void setNewLotId(Long newLotId) { this.newLotId = newLotId; }

    public LocalDate getNewCheckInDate() { return newCheckInDate; }
    public void setNewCheckInDate(LocalDate newCheckInDate) { this.newCheckInDate = newCheckInDate; }

    public LocalDate getNewCheckOutDate() { return newCheckOutDate; }
    public void setNewCheckOutDate(LocalDate newCheckOutDate) { this.newCheckOutDate = newCheckOutDate; }

    public BigDecimal getNewTotalPrice() { return newTotalPrice; }
    public void setNewTotalPrice(BigDecimal newTotalPrice) { this.newTotalPrice = newTotalPrice; }

    public BigDecimal getPriceAdjustment() { return priceAdjustment; }
    public void setPriceAdjustment(BigDecimal priceAdjustment) { this.priceAdjustment = priceAdjustment; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final BookingModificationLog log = new BookingModificationLog();

        public Builder booking(Booking booking) { log.booking = booking; return this; }
        public Builder modifiedByUserId(Long modifiedByUserId) { log.modifiedByUserId = modifiedByUserId; return this; }
        public Builder modificationType(String modificationType) { log.modificationType = modificationType; return this; }
        public Builder previousLotId(Long previousLotId) { log.previousLotId = previousLotId; return this; }
        public Builder previousCheckInDate(LocalDate previousCheckInDate) { log.previousCheckInDate = previousCheckInDate; return this; }
        public Builder previousCheckOutDate(LocalDate previousCheckOutDate) { log.previousCheckOutDate = previousCheckOutDate; return this; }
        public Builder previousTotalPrice(BigDecimal previousTotalPrice) { log.previousTotalPrice = previousTotalPrice; return this; }
        public Builder newLotId(Long newLotId) { log.newLotId = newLotId; return this; }
        public Builder newCheckInDate(LocalDate newCheckInDate) { log.newCheckInDate = newCheckInDate; return this; }
        public Builder newCheckOutDate(LocalDate newCheckOutDate) { log.newCheckOutDate = newCheckOutDate; return this; }
        public Builder newTotalPrice(BigDecimal newTotalPrice) { log.newTotalPrice = newTotalPrice; return this; }
        public Builder priceAdjustment(BigDecimal priceAdjustment) { log.priceAdjustment = priceAdjustment; return this; }
        public Builder reason(String reason) { log.reason = reason; return this; }

        public BookingModificationLog build() {
            return log;
        }
    }
}
