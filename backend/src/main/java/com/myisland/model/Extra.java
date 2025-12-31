package com.myisland.model;

public record Extra(String id, String name, String description, double price, String icon) {
    public static Builder builder() {
        return new Builder();
    }

    public double getPrice() {
        return price;
    }

    public static class Builder {
        private String id;
        private String name;
        private String description;
        private double price;
        private String icon;

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder price(double price) {
            this.price = price;
            return this;
        }

        public Builder icon(String icon) {
            this.icon = icon;
            return this;
        }

        public Extra build() {
            return new Extra(id, name, description, price, icon);
        }
    }
}
