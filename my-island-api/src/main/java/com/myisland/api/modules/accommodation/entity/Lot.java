package com.myisland.api.modules.accommodation.entity;

import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "lots")
public class Lot extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "lot_type", nullable = false)
    private LotType lotType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "price_per_night", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Column(name = "max_guests", nullable = false)
    private int maxGuests = 2;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @ManyToMany
    @JoinTable(
            name = "lot_amenities",
            joinColumns = @JoinColumn(name = "lot_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private Set<Amenity> amenities = new HashSet<>();

    public enum LotType {
        TENT, TOURING, GLAMPING, CABIN, MOBILE_HOME
    }

    public Lot() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Owner owner;
        private String name;
        private LotType lotType;
        private String description;
        private BigDecimal pricePerNight;
        private int maxGuests = 2;
        private boolean isActive = true;
        private String imageUrl;
        private Set<Amenity> amenities = new HashSet<>();

        public Builder owner(Owner owner) { this.owner = owner; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder lotType(LotType lotType) { this.lotType = lotType; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder pricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; return this; }
        public Builder maxGuests(int maxGuests) { this.maxGuests = maxGuests; return this; }
        public Builder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder amenities(Set<Amenity> amenities) { this.amenities = amenities; return this; }

        public Lot build() {
            Lot lot = new Lot();
            lot.owner = this.owner;
            lot.name = this.name;
            lot.lotType = this.lotType;
            lot.description = this.description;
            lot.pricePerNight = this.pricePerNight;
            lot.maxGuests = this.maxGuests;
            lot.isActive = this.isActive;
            lot.imageUrl = this.imageUrl;
            lot.amenities = this.amenities;
            return lot;
        }
    }

    // Getters and Setters
    public Owner getOwner() { return owner; }
    public void setOwner(Owner owner) { this.owner = owner; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LotType getLotType() { return lotType; }
    public void setLotType(LotType lotType) { this.lotType = lotType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

    public int getMaxGuests() { return maxGuests; }
    public void setMaxGuests(int maxGuests) { this.maxGuests = maxGuests; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Set<Amenity> getAmenities() { return amenities; }
    public void setAmenities(Set<Amenity> amenities) { this.amenities = amenities; }
}
