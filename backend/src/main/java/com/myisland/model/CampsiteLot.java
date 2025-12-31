package com.myisland.model;

import java.util.List;

public class CampsiteLot {
    private String id;
    private String name;
    private LotType type;
    private int maxGuests;
    private String size;
    private double pricePerNight;
    private LotStatus status;
    private String image;
    private List<String> amenities;

    public enum LotType {
        tent, rv, cabin, glamping
    }

    public enum LotStatus {
        available, booked, maintenance
    }

    public CampsiteLot() {}

    public CampsiteLot(String id, String name, LotType type, int maxGuests, String size, double pricePerNight, LotStatus status, String image, List<String> amenities) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.maxGuests = maxGuests;
        this.size = size;
        this.pricePerNight = pricePerNight;
        this.status = status;
        this.image = image;
        this.amenities = amenities;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LotType getType() { return type; }
    public void setType(LotType type) { this.type = type; }
    public int getMaxGuests() { return maxGuests; }
    public void setMaxGuests(int maxGuests) { this.maxGuests = maxGuests; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(double pricePerNight) { this.pricePerNight = pricePerNight; }
    public LotStatus getStatus() { return status; }
    public void setStatus(LotStatus status) { this.status = status; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

    public static class Builder {
        private String id;
        private String name;
        private LotType type;
        private int maxGuests;
        private String size;
        private double pricePerNight;
        private LotStatus status;
        private String image;
        private List<String> amenities;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder type(LotType type) { this.type = type; return this; }
        public Builder maxGuests(int maxGuests) { this.maxGuests = maxGuests; return this; }
        public Builder size(String size) { this.size = size; return this; }
        public Builder pricePerNight(double pricePerNight) { this.pricePerNight = pricePerNight; return this; }
        public Builder status(LotStatus status) { this.status = status; return this; }
        public Builder image(String image) { this.image = image; return this; }
        public Builder amenities(List<String> amenities) { this.amenities = amenities; return this; }

        public CampsiteLot build() {
            return new CampsiteLot(id, name, type, maxGuests, size, pricePerNight, status, image, amenities);
        }
    }
}
