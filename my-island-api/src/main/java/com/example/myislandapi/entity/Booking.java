package com.example.myislandapi.entity;

import com.example.myislandapi.enums.BookingStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id", nullable = false)
    private Lot lot;

    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn;

    @Column(name = "check_out", nullable = false)
    private LocalDate checkOut;

    @Column(nullable = false)
    private int guests;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "lot_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal lotPrice;

    @Column(name = "extras_price", precision = 10, scale = 2)
    private BigDecimal extrasPrice = BigDecimal.ZERO;

    @Column(name = "service_fee", precision = 10, scale = 2)
    private BigDecimal serviceFee = BigDecimal.ZERO;

    @Column(name = "total_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingExtra> bookingExtras = new ArrayList<>();

    @Column(name = "special_requests", length = 1000)
    private String specialRequests;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    public Booking() {}

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Lot getLot() {
        return lot;
    }

    public void setLot(Lot lot) {
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

    public List<BookingExtra> getBookingExtras() {
        return bookingExtras;
    }

    public void setBookingExtras(List<BookingExtra> bookingExtras) {
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

    public long getNights() {
        return java.time.temporal.ChronoUnit.DAYS.between(checkIn, checkOut);
    }

    public void addExtra(BookingExtra extra) {
        bookingExtras.add(extra);
        extra.setBooking(this);
    }

    public void removeExtra(BookingExtra extra) {
        bookingExtras.remove(extra);
        extra.setBooking(null);
    }
}
