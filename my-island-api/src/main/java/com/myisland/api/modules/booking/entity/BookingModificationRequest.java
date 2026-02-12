package com.myisland.api.modules.booking.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking_modification_requests")
public class BookingModificationRequest {

    public enum Status {
        PENDING, APPROVED, DECLINED, CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "requested_by_user_id", nullable = false)
    private Long requestedByUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    @Column(name = "requested_lot_id")
    private Long requestedLotId;

    @Column(name = "requested_check_in_date")
    private LocalDate requestedCheckInDate;

    @Column(name = "requested_check_out_date")
    private LocalDate requestedCheckOutDate;

    @Column(name = "requested_wants_power")
    private Boolean requestedWantsPower;

    @Column(name = "estimated_new_price", precision = 10, scale = 2)
    private BigDecimal estimatedNewPrice;

    @Column(name = "price_difference", precision = 10, scale = 2)
    private BigDecimal priceDifference;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "resolved_by_user_id")
    private Long resolvedByUserId;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "decline_reason", columnDefinition = "TEXT")
    private String declineReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public BookingModificationRequest() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public Long getRequestedByUserId() { return requestedByUserId; }
    public void setRequestedByUserId(Long requestedByUserId) { this.requestedByUserId = requestedByUserId; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; this.updatedAt = LocalDateTime.now(); }

    public Long getRequestedLotId() { return requestedLotId; }
    public void setRequestedLotId(Long requestedLotId) { this.requestedLotId = requestedLotId; }

    public LocalDate getRequestedCheckInDate() { return requestedCheckInDate; }
    public void setRequestedCheckInDate(LocalDate requestedCheckInDate) { this.requestedCheckInDate = requestedCheckInDate; }

    public LocalDate getRequestedCheckOutDate() { return requestedCheckOutDate; }
    public void setRequestedCheckOutDate(LocalDate requestedCheckOutDate) { this.requestedCheckOutDate = requestedCheckOutDate; }

    public Boolean getRequestedWantsPower() { return requestedWantsPower; }
    public void setRequestedWantsPower(Boolean requestedWantsPower) { this.requestedWantsPower = requestedWantsPower; }

    public BigDecimal getEstimatedNewPrice() { return estimatedNewPrice; }
    public void setEstimatedNewPrice(BigDecimal estimatedNewPrice) { this.estimatedNewPrice = estimatedNewPrice; }

    public BigDecimal getPriceDifference() { return priceDifference; }
    public void setPriceDifference(BigDecimal priceDifference) { this.priceDifference = priceDifference; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Long getResolvedByUserId() { return resolvedByUserId; }
    public void setResolvedByUserId(Long resolvedByUserId) { this.resolvedByUserId = resolvedByUserId; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public String getDeclineReason() { return declineReason; }
    public void setDeclineReason(String declineReason) { this.declineReason = declineReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
