package com.myisland.api.modules.discovery.entity;

import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "points_of_interest")
public class PointOfInterest extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PoiCategory category;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(length = 100)
    private String county;

    @Column(length = 100)
    private String town;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    public enum PoiCategory {
        TRAIL, LANDMARK, BEACH, WATERFALL, CASTLE, MOUNTAIN, LAKE, ISLAND, HERITAGE, VIEWPOINT
    }

    public enum Difficulty {
        EASY, MODERATE, DIFFICULT, STRENUOUS
    }

    public PointOfInterest() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String name;
        private String description;
        private PoiCategory category;
        private double latitude;
        private double longitude;
        private String county;
        private String town;
        private Difficulty difficulty;
        private Double distanceKm;
        private String imageUrl;
        private String websiteUrl;

        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(PoiCategory category) { this.category = category; return this; }
        public Builder latitude(double latitude) { this.latitude = latitude; return this; }
        public Builder longitude(double longitude) { this.longitude = longitude; return this; }
        public Builder county(String county) { this.county = county; return this; }
        public Builder town(String town) { this.town = town; return this; }
        public Builder difficulty(Difficulty difficulty) { this.difficulty = difficulty; return this; }
        public Builder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder websiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; return this; }

        public PointOfInterest build() {
            PointOfInterest poi = new PointOfInterest();
            poi.name = this.name;
            poi.description = this.description;
            poi.category = this.category;
            poi.latitude = this.latitude;
            poi.longitude = this.longitude;
            poi.county = this.county;
            poi.town = this.town;
            poi.difficulty = this.difficulty;
            poi.distanceKm = this.distanceKm;
            poi.imageUrl = this.imageUrl;
            poi.websiteUrl = this.websiteUrl;
            return poi;
        }
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public PoiCategory getCategory() { return category; }
    public void setCategory(PoiCategory category) { this.category = category; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getCounty() { return county; }
    public void setCounty(String county) { this.county = county; }

    public String getTown() { return town; }
    public void setTown(String town) { this.town = town; }

    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }
}
