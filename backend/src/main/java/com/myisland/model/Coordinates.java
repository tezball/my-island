package com.myisland.model;

public record Coordinates(double lat, double lng) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private double lat;
        private double lng;

        public Builder lat(double lat) {
            this.lat = lat;
            return this;
        }

        public Builder lng(double lng) {
            this.lng = lng;
            return this;
        }

        public Coordinates build() {
            return new Coordinates(lat, lng);
        }
    }
}
