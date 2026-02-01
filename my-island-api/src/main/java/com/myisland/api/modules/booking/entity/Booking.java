package com.myisland.api.modules.booking.entity;

import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id", nullable = false)
    private Lot lot;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @Column(name = "num_guests", nullable = false)
    private int numGuests = 1;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    public enum BookingStatus {
        PENDING, CONFIRMED, CANCELLED, COMPLETED
    }

    public Booking() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private User user;
        private Lot lot;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private int numGuests = 1;
        private BigDecimal totalPrice;
        private BookingStatus status = BookingStatus.PENDING;
        private String specialRequests;

        public Builder user(User user) { this.user = user; return this; }
        public Builder lot(Lot lot) { this.lot = lot; return this; }
        public Builder checkInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; return this; }
        public Builder checkOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; return this; }
        public Builder numGuests(int numGuests) { this.numGuests = numGuests; return this; }
        public Builder totalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; return this; }
        public Builder status(BookingStatus status) { this.status = status; return this; }
        public Builder specialRequests(String specialRequests) { this.specialRequests = specialRequests; return this; }

        public Booking build() {
            Booking booking = new Booking();
            booking.user = this.user;
            booking.lot = this.lot;
            booking.checkInDate = this.checkInDate;
            booking.checkOutDate = this.checkOutDate;
            booking.numGuests = this.numGuests;
            booking.totalPrice = this.totalPrice;
            booking.status = this.status;
            booking.specialRequests = this.specialRequests;
            return booking;
        }
    }

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Lot getLot() { return lot; }
    public void setLot(Lot lot) { this.lot = lot; }

    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

    public int getNumGuests() { return numGuests; }
    public void setNumGuests(int numGuests) { this.numGuests = numGuests; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
}
