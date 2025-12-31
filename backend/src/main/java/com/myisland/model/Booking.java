package com.myisland.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Booking {
    private String id;
    private String reference;
    private String campsiteId;
    private Campsite campsite;
    private String lotId;
    private CampsiteLot lot;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private int nights;
    private Guests guests;
    private List<Extra> extras = new ArrayList<>();
    private BookingStatus status;
    private double totalPrice;
    private LocalDateTime createdAt;
    private String userId;

    public enum BookingStatus {
        confirmed, completed, cancelled
    }

    public Booking() {}

    public Booking(String id, String reference, String campsiteId, Campsite campsite, String lotId,
                   CampsiteLot lot, LocalDate checkIn, LocalDate checkOut, int nights, Guests guests,
                   List<Extra> extras, BookingStatus status, double totalPrice, LocalDateTime createdAt, String userId) {
        this.id = id;
        this.reference = reference;
        this.campsiteId = campsiteId;
        this.campsite = campsite;
        this.lotId = lotId;
        this.lot = lot;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.nights = nights;
        this.guests = guests;
        this.extras = extras != null ? extras : new ArrayList<>();
        this.status = status;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt;
        this.userId = userId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getCampsiteId() { return campsiteId; }
    public void setCampsiteId(String campsiteId) { this.campsiteId = campsiteId; }
    public Campsite getCampsite() { return campsite; }
    public void setCampsite(Campsite campsite) { this.campsite = campsite; }
    public String getLotId() { return lotId; }
    public void setLotId(String lotId) { this.lotId = lotId; }
    public CampsiteLot getLot() { return lot; }
    public void setLot(CampsiteLot lot) { this.lot = lot; }
    public LocalDate getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }
    public LocalDate getCheckOut() { return checkOut; }
    public void setCheckOut(LocalDate checkOut) { this.checkOut = checkOut; }
    public int getNights() { return nights; }
    public void setNights(int nights) { this.nights = nights; }
    public Guests getGuests() { return guests; }
    public void setGuests(Guests guests) { this.guests = guests; }
    public List<Extra> getExtras() { return extras; }
    public void setExtras(List<Extra> extras) { this.extras = extras; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public static class Builder {
        private String id;
        private String reference;
        private String campsiteId;
        private Campsite campsite;
        private String lotId;
        private CampsiteLot lot;
        private LocalDate checkIn;
        private LocalDate checkOut;
        private int nights;
        private Guests guests;
        private List<Extra> extras = new ArrayList<>();
        private BookingStatus status;
        private double totalPrice;
        private LocalDateTime createdAt;
        private String userId;

        public Builder id(String id) { this.id = id; return this; }
        public Builder reference(String reference) { this.reference = reference; return this; }
        public Builder campsiteId(String campsiteId) { this.campsiteId = campsiteId; return this; }
        public Builder campsite(Campsite campsite) { this.campsite = campsite; return this; }
        public Builder lotId(String lotId) { this.lotId = lotId; return this; }
        public Builder lot(CampsiteLot lot) { this.lot = lot; return this; }
        public Builder checkIn(LocalDate checkIn) { this.checkIn = checkIn; return this; }
        public Builder checkOut(LocalDate checkOut) { this.checkOut = checkOut; return this; }
        public Builder nights(int nights) { this.nights = nights; return this; }
        public Builder guests(Guests guests) { this.guests = guests; return this; }
        public Builder extras(List<Extra> extras) { this.extras = extras; return this; }
        public Builder status(BookingStatus status) { this.status = status; return this; }
        public Builder totalPrice(double totalPrice) { this.totalPrice = totalPrice; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }

        public Booking build() {
            return new Booking(id, reference, campsiteId, campsite, lotId, lot, checkIn, checkOut,
                    nights, guests, extras, status, totalPrice, createdAt, userId);
        }
    }
}
