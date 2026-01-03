package com.example.myislandapi.fixture;

import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.enums.LotType;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Fixtures for creating Lot entities in tests.
 */
public class LotFixtures {

    public static Lot createLot(Campsite campsite) {
        return builder()
                .campsite(campsite)
                .build();
    }

    public static Lot createLot(Campsite campsite, String name) {
        return builder()
                .campsite(campsite)
                .name(name)
                .build();
    }

    public static Lot createLot(Campsite campsite, LotType type) {
        return builder()
                .campsite(campsite)
                .type(type)
                .build();
    }

    public static LotBuilder builder() {
        return new LotBuilder();
    }

    public static class LotBuilder {
        private Campsite campsite;
        private String name = "Test Lot";
        private LotType type = LotType.TENT;
        private int capacity = 4;
        private BigDecimal pricePerNight = new BigDecimal("35.00");
        private boolean available = true;
        private List<String> images = new ArrayList<>();
        private List<String> amenities = new ArrayList<>(List.of("Fire Pit", "Picnic Table"));

        public LotBuilder campsite(Campsite campsite) {
            this.campsite = campsite;
            return this;
        }

        public LotBuilder name(String name) {
            this.name = name;
            return this;
        }

        public LotBuilder type(LotType type) {
            this.type = type;
            return this;
        }

        public LotBuilder capacity(int capacity) {
            this.capacity = capacity;
            return this;
        }

        public LotBuilder pricePerNight(BigDecimal pricePerNight) {
            this.pricePerNight = pricePerNight;
            return this;
        }

        public LotBuilder available(boolean available) {
            this.available = available;
            return this;
        }

        public LotBuilder images(List<String> images) {
            this.images = images;
            return this;
        }

        public LotBuilder amenities(List<String> amenities) {
            this.amenities = amenities;
            return this;
        }

        public Lot build() {
            Lot lot = new Lot();
            lot.setCampsite(campsite);
            lot.setName(name);
            lot.setType(type);
            lot.setCapacity(capacity);
            lot.setPricePerNight(pricePerNight);
            lot.setAvailable(available);
            lot.setImages(images);
            lot.setAmenities(amenities);
            return lot;
        }
    }
}
