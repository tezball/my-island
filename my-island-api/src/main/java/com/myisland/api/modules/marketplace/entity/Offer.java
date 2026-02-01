package com.myisland.api.modules.marketplace.entity;

import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "offers")
public class Offer extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "min_purchase", precision = 10, scale = 2)
    private BigDecimal minPurchase;

    @Column(name = "terms_conditions", columnDefinition = "TEXT")
    private String termsConditions;

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @Column(name = "valid_until", nullable = false)
    private LocalDate validUntil;

    @Column(name = "max_claims")
    private Integer maxClaims;

    @Column(name = "current_claims", nullable = false)
    private int currentClaims = 0;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @OneToMany(mappedBy = "offer", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OfferClaim> claims = new HashSet<>();

    public enum DiscountType {
        PERCENTAGE, FIXED_AMOUNT, FREE_ITEM, BUY_ONE_GET_ONE
    }

    public Offer() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Supplier supplier;
        private String title;
        private String description;
        private DiscountType discountType;
        private BigDecimal discountValue;
        private BigDecimal minPurchase;
        private String termsConditions;
        private LocalDate validFrom;
        private LocalDate validUntil;
        private Integer maxClaims;
        private int currentClaims = 0;
        private boolean isActive = true;
        private String imageUrl;

        public Builder supplier(Supplier supplier) { this.supplier = supplier; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder discountType(DiscountType discountType) { this.discountType = discountType; return this; }
        public Builder discountValue(BigDecimal discountValue) { this.discountValue = discountValue; return this; }
        public Builder minPurchase(BigDecimal minPurchase) { this.minPurchase = minPurchase; return this; }
        public Builder termsConditions(String termsConditions) { this.termsConditions = termsConditions; return this; }
        public Builder validFrom(LocalDate validFrom) { this.validFrom = validFrom; return this; }
        public Builder validUntil(LocalDate validUntil) { this.validUntil = validUntil; return this; }
        public Builder maxClaims(Integer maxClaims) { this.maxClaims = maxClaims; return this; }
        public Builder currentClaims(int currentClaims) { this.currentClaims = currentClaims; return this; }
        public Builder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }

        public Offer build() {
            Offer offer = new Offer();
            offer.supplier = this.supplier;
            offer.title = this.title;
            offer.description = this.description;
            offer.discountType = this.discountType;
            offer.discountValue = this.discountValue;
            offer.minPurchase = this.minPurchase;
            offer.termsConditions = this.termsConditions;
            offer.validFrom = this.validFrom;
            offer.validUntil = this.validUntil;
            offer.maxClaims = this.maxClaims;
            offer.currentClaims = this.currentClaims;
            offer.isActive = this.isActive;
            offer.imageUrl = this.imageUrl;
            return offer;
        }
    }

    public boolean isAvailable() {
        LocalDate today = LocalDate.now();
        return isActive
                && !today.isBefore(validFrom)
                && !today.isAfter(validUntil)
                && (maxClaims == null || currentClaims < maxClaims);
    }

    // Getters and Setters
    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getMinPurchase() { return minPurchase; }
    public void setMinPurchase(BigDecimal minPurchase) { this.minPurchase = minPurchase; }

    public String getTermsConditions() { return termsConditions; }
    public void setTermsConditions(String termsConditions) { this.termsConditions = termsConditions; }

    public LocalDate getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDate validFrom) { this.validFrom = validFrom; }

    public LocalDate getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDate validUntil) { this.validUntil = validUntil; }

    public Integer getMaxClaims() { return maxClaims; }
    public void setMaxClaims(Integer maxClaims) { this.maxClaims = maxClaims; }

    public int getCurrentClaims() { return currentClaims; }
    public void setCurrentClaims(int currentClaims) { this.currentClaims = currentClaims; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Set<OfferClaim> getClaims() { return claims; }
    public void setClaims(Set<OfferClaim> claims) { this.claims = claims; }
}
