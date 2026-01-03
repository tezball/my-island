package com.example.myislandapi.fixture;

import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.Location;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.enums.Facility;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Fixtures for creating Campsite entities in tests.
 */
public class CampsiteFixtures {

    public static Campsite createCampsite(User owner) {
        return builder()
                .owner(owner)
                .build();
    }

    public static Campsite createCampsite(User owner, String name) {
        return builder()
                .owner(owner)
                .name(name)
                .build();
    }

    public static CampsiteBuilder builder() {
        return new CampsiteBuilder();
    }

    public static class CampsiteBuilder {
        private String name = "Test Campsite";
        private String description = "A beautiful campsite for testing";
        private User owner;
        private boolean active = true;
        private boolean featured = false;
        private BigDecimal pricePerNight = new BigDecimal("50.00");
        private String address = "123 Test Road";
        private String county = "Dublin";
        private Double lat = 53.3498;
        private Double lng = -6.2603;
        private Set<Facility> facilities = new HashSet<>(Set.of(Facility.WIFI, Facility.SHOWER));
        private List<String> images = new ArrayList<>(List.of("https://example.com/test.jpg"));

        public CampsiteBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CampsiteBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CampsiteBuilder owner(User owner) {
            this.owner = owner;
            return this;
        }

        public CampsiteBuilder active(boolean active) {
            this.active = active;
            return this;
        }

        public CampsiteBuilder featured(boolean featured) {
            this.featured = featured;
            return this;
        }

        public CampsiteBuilder pricePerNight(BigDecimal pricePerNight) {
            this.pricePerNight = pricePerNight;
            return this;
        }

        public CampsiteBuilder location(String address, String county, Double lat, Double lng) {
            this.address = address;
            this.county = county;
            this.lat = lat;
            this.lng = lng;
            return this;
        }

        public CampsiteBuilder county(String county) {
            this.county = county;
            return this;
        }

        public CampsiteBuilder facilities(Set<Facility> facilities) {
            this.facilities = facilities;
            return this;
        }

        public CampsiteBuilder addFacility(Facility facility) {
            this.facilities.add(facility);
            return this;
        }

        public CampsiteBuilder images(List<String> images) {
            this.images = images;
            return this;
        }

        public Campsite build() {
            Campsite campsite = new Campsite();
            campsite.setName(name);
            campsite.setDescription(description);
            campsite.setOwner(owner);
            campsite.setActive(active);
            campsite.setFeatured(featured);
            campsite.setPricePerNight(pricePerNight);
            campsite.setLocation(new Location(address, county, lat, lng));
            campsite.setFacilities(facilities);
            campsite.setImages(images);
            return campsite;
        }
    }
}
