package com.myisland.model;

import java.util.ArrayList;
import java.util.List;

public class Campsite {
    private String id;
    private String name;
    private String location;
    private Coordinates coordinates;
    private double pricePerNight;
    private double rating;
    private int reviewCount;
    private String description;
    private String imageUrl;
    private List<String> images = new ArrayList<>();
    private List<Facility> facilities = new ArrayList<>();
    private List<CampsiteLot> lots = new ArrayList<>();
    private List<LocalSupplier> suppliers = new ArrayList<>();
    private boolean isSuperhost;
    private CampsiteLot.LotType type;

    public Campsite() {}

    public Campsite(String id, String name, String location, Coordinates coordinates, double pricePerNight,
                   double rating, int reviewCount, String description, String imageUrl, List<String> images,
                   List<Facility> facilities, List<CampsiteLot> lots, List<LocalSupplier> suppliers,
                   boolean isSuperhost, CampsiteLot.LotType type) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.coordinates = coordinates;
        this.pricePerNight = pricePerNight;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.description = description;
        this.imageUrl = imageUrl;
        this.images = images != null ? images : new ArrayList<>();
        this.facilities = facilities != null ? facilities : new ArrayList<>();
        this.lots = lots != null ? lots : new ArrayList<>();
        this.suppliers = suppliers != null ? suppliers : new ArrayList<>();
        this.isSuperhost = isSuperhost;
        this.type = type;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Coordinates getCoordinates() { return coordinates; }
    public void setCoordinates(Coordinates coordinates) { this.coordinates = coordinates; }
    public double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(double pricePerNight) { this.pricePerNight = pricePerNight; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public List<Facility> getFacilities() { return facilities; }
    public void setFacilities(List<Facility> facilities) { this.facilities = facilities; }
    public List<CampsiteLot> getLots() { return lots; }
    public void setLots(List<CampsiteLot> lots) { this.lots = lots; }
    public List<LocalSupplier> getSuppliers() { return suppliers; }
    public void setSuppliers(List<LocalSupplier> suppliers) { this.suppliers = suppliers; }
    public boolean isSuperhost() { return isSuperhost; }
    public void setSuperhost(boolean superhost) { isSuperhost = superhost; }
    public CampsiteLot.LotType getType() { return type; }
    public void setType(CampsiteLot.LotType type) { this.type = type; }

    public static class Builder {
        private String id;
        private String name;
        private String location;
        private Coordinates coordinates;
        private double pricePerNight;
        private double rating;
        private int reviewCount;
        private String description;
        private String imageUrl;
        private List<String> images = new ArrayList<>();
        private List<Facility> facilities = new ArrayList<>();
        private List<CampsiteLot> lots = new ArrayList<>();
        private List<LocalSupplier> suppliers = new ArrayList<>();
        private boolean isSuperhost;
        private CampsiteLot.LotType type;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder coordinates(Coordinates coordinates) { this.coordinates = coordinates; return this; }
        public Builder pricePerNight(double pricePerNight) { this.pricePerNight = pricePerNight; return this; }
        public Builder rating(double rating) { this.rating = rating; return this; }
        public Builder reviewCount(int reviewCount) { this.reviewCount = reviewCount; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder images(List<String> images) { this.images = images; return this; }
        public Builder facilities(List<Facility> facilities) { this.facilities = facilities; return this; }
        public Builder lots(List<CampsiteLot> lots) { this.lots = lots; return this; }
        public Builder suppliers(List<LocalSupplier> suppliers) { this.suppliers = suppliers; return this; }
        public Builder isSuperhost(boolean isSuperhost) { this.isSuperhost = isSuperhost; return this; }
        public Builder type(CampsiteLot.LotType type) { this.type = type; return this; }

        public Campsite build() {
            return new Campsite(id, name, location, coordinates, pricePerNight, rating, reviewCount,
                    description, imageUrl, images, facilities, lots, suppliers, isSuperhost, type);
        }
    }
}
