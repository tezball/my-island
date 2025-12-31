package com.myisland.model;

import java.util.ArrayList;
import java.util.List;

public class SupplierOffer {
    private String id;
    private String supplierId;
    private String supplierName;
    private String supplierLogo;
    private OfferCategory category;
    private String title;
    private String description;
    private String imageUrl;
    private String discount;
    private List<String> tags = new ArrayList<>();
    private String location;
    private String distance;

    public enum OfferCategory {
        food, activity, gear, water, wellness, experience, other
    }

    public SupplierOffer() {}

    public SupplierOffer(String id, String supplierId, String supplierName, String supplierLogo,
                         OfferCategory category, String title, String description, String imageUrl,
                         String discount, List<String> tags, String location, String distance) {
        this.id = id;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.supplierLogo = supplierLogo;
        this.category = category;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.discount = discount;
        this.tags = tags != null ? tags : new ArrayList<>();
        this.location = location;
        this.distance = distance;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getId() { return id; }
    public String getSupplierId() { return supplierId; }
    public String getSupplierName() { return supplierName; }
    public String getSupplierLogo() { return supplierLogo; }
    public OfferCategory getCategory() { return category; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public String getDiscount() { return discount; }
    public List<String> getTags() { return tags; }
    public String getLocation() { return location; }
    public String getDistance() { return distance; }

    public static class Builder {
        private String id;
        private String supplierId;
        private String supplierName;
        private String supplierLogo;
        private OfferCategory category;
        private String title;
        private String description;
        private String imageUrl;
        private String discount;
        private List<String> tags = new ArrayList<>();
        private String location;
        private String distance;

        public Builder id(String id) { this.id = id; return this; }
        public Builder supplierId(String supplierId) { this.supplierId = supplierId; return this; }
        public Builder supplierName(String supplierName) { this.supplierName = supplierName; return this; }
        public Builder supplierLogo(String supplierLogo) { this.supplierLogo = supplierLogo; return this; }
        public Builder category(OfferCategory category) { this.category = category; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder discount(String discount) { this.discount = discount; return this; }
        public Builder tags(List<String> tags) { this.tags = tags; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder distance(String distance) { this.distance = distance; return this; }

        public SupplierOffer build() {
            return new SupplierOffer(id, supplierId, supplierName, supplierLogo, category, title,
                    description, imageUrl, discount, tags, location, distance);
        }
    }
}
