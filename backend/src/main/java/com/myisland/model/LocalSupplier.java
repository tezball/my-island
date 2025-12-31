package com.myisland.model;

public record LocalSupplier(String id, String name, SupplierCategory category, String distance, boolean alertsEnabled) {

    public enum SupplierCategory {
        food, activity, gear, other
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String name;
        private SupplierCategory category;
        private String distance;
        private boolean alertsEnabled;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder category(SupplierCategory category) { this.category = category; return this; }
        public Builder distance(String distance) { this.distance = distance; return this; }
        public Builder alertsEnabled(boolean alertsEnabled) { this.alertsEnabled = alertsEnabled; return this; }

        public LocalSupplier build() {
            return new LocalSupplier(id, name, category, distance, alertsEnabled);
        }
    }
}
