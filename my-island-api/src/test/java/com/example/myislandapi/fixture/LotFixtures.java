package com.example.myislandapi.fixture;

import com.example.myislandapi.enums.LotType;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.LotModel;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Fixtures for creating LotModel instances in tests.
 */
public class LotFixtures {

    public static LotModel createLot(CampsiteModel campsite) {
        return builder()
                .campsite(campsite)
                .build();
    }

    public static LotModel createLot(CampsiteModel campsite, String name) {
        return builder()
                .campsite(campsite)
                .name(name)
                .build();
    }

    public static LotModel createLot(CampsiteModel campsite, LotType type) {
        return builder()
                .campsite(campsite)
                .type(type)
                .build();
    }

    public static LotBuilder builder() {
        return new LotBuilder();
    }

    public static class LotBuilder {
        private CampsiteModel campsite;
        private String name = "Test Lot";
        private LotType type = LotType.TENT;
        private int capacity = 4;
        private BigDecimal pricePerNight = new BigDecimal("35.00");
        private boolean available = true;
        private List<String> images = new ArrayList<>();
        private List<String> amenities = new ArrayList<>(List.of("Fire Pit", "Picnic Table"));

        public LotBuilder campsite(CampsiteModel campsite) {
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

        public LotModel build() {
            LotModel lot = new LotModel();
            if (campsite != null) {
                lot.setCampsiteId(campsite.getId());
                lot.setCampsite(campsite);
            }
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
