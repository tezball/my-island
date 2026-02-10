package com.myisland.api.modules.marketplace.entity;

import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "suppliers")
public class Supplier extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupplierCategory category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String county;

    private String town;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String phone;

    private String website;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Offer> offers = new HashSet<>();

    // Subscription fields
    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;

    @Column(name = "stripe_subscription_id")
    private String stripeSubscriptionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_status")
    private SubscriptionStatus subscriptionStatus = SubscriptionStatus.NONE;

    @Column(name = "subscription_current_period_end")
    private Instant subscriptionCurrentPeriodEnd;

    @Column(name = "subscription_cancel_at_period_end")
    private boolean subscriptionCancelAtPeriodEnd = false;

    // Featured promotion fields
    @Column(name = "is_featured", nullable = false)
    private boolean isFeatured = false;

    @Column(name = "featured_until")
    private LocalDateTime featuredUntil;

    @Column(name = "featured_purchase_id")
    private String featuredPurchaseId;

    // Stripe Connect fields
    @Column(name = "stripe_connect_account_id")
    private String stripeConnectAccountId;

    @Column(name = "connect_onboarding_complete", nullable = false)
    private boolean connectOnboardingComplete = false;

    @Column(name = "payouts_enabled", nullable = false)
    private boolean payoutsEnabled = false;

    // Review rating fields
    @Column(precision = 2, scale = 1)
    private BigDecimal rating;

    @Column(name = "review_count", nullable = false)
    private int reviewCount = 0;

    // Trial fields
    @Column(name = "trial_ends_at")
    private Instant trialEndsAt;

    @Column(name = "trial_used", nullable = false)
    private boolean trialUsed = false;

    public enum SubscriptionStatus {
        NONE, // Never subscribed
        TRIALING, // Free trial period
        ACTIVE, // Subscription is active
        PAST_DUE, // Payment failed, in grace period
        CANCELED, // Subscription was canceled
        UNPAID // Payment failed, subscription suspended
    }

    public enum SupplierCategory {
        FARM_SHOP, RESTAURANT, CAFE, PUB,
        ACTIVITY_PROVIDER, TOUR_OPERATOR, EQUIPMENT_RENTAL,
        SPA, ARTISAN, GROCERY, OTHER
    }

    public Supplier() {
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private User user;
        private String businessName;
        private SupplierCategory category;
        private String description;
        private String county;
        private String town;
        private String address;
        private String phone;
        private String website;
        private String logoUrl;
        private Double latitude;
        private Double longitude;
        private boolean isVerified = false;

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder businessName(String businessName) {
            this.businessName = businessName;
            return this;
        }

        public Builder category(SupplierCategory category) {
            this.category = category;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder county(String county) {
            this.county = county;
            return this;
        }

        public Builder town(String town) {
            this.town = town;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder website(String website) {
            this.website = website;
            return this;
        }

        public Builder logoUrl(String logoUrl) {
            this.logoUrl = logoUrl;
            return this;
        }

        public Builder latitude(Double latitude) {
            this.latitude = latitude;
            return this;
        }

        public Builder longitude(Double longitude) {
            this.longitude = longitude;
            return this;
        }

        public Builder isVerified(boolean isVerified) {
            this.isVerified = isVerified;
            return this;
        }

        public Supplier build() {
            Supplier supplier = new Supplier();
            supplier.user = this.user;
            supplier.businessName = this.businessName;
            supplier.category = this.category;
            supplier.description = this.description;
            supplier.county = this.county;
            supplier.town = this.town;
            supplier.address = this.address;
            supplier.phone = this.phone;
            supplier.website = this.website;
            supplier.logoUrl = this.logoUrl;
            supplier.latitude = this.latitude;
            supplier.longitude = this.longitude;
            supplier.isVerified = this.isVerified;
            return supplier;
        }
    }

    // Getters and Setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public SupplierCategory getCategory() {
        return category;
    }

    public void setCategory(SupplierCategory category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public String getTown() {
        return town;
    }

    public void setTown(String town) {
        this.town = town;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public Set<Offer> getOffers() {
        return offers;
    }

    public void setOffers(Set<Offer> offers) {
        this.offers = offers;
    }

    // Subscription getters and setters
    public String getStripeCustomerId() {
        return stripeCustomerId;
    }

    public void setStripeCustomerId(String stripeCustomerId) {
        this.stripeCustomerId = stripeCustomerId;
    }

    public String getStripeSubscriptionId() {
        return stripeSubscriptionId;
    }

    public void setStripeSubscriptionId(String stripeSubscriptionId) {
        this.stripeSubscriptionId = stripeSubscriptionId;
    }

    public SubscriptionStatus getSubscriptionStatus() {
        return subscriptionStatus;
    }

    public void setSubscriptionStatus(SubscriptionStatus subscriptionStatus) {
        this.subscriptionStatus = subscriptionStatus;
    }

    public Instant getSubscriptionCurrentPeriodEnd() {
        return subscriptionCurrentPeriodEnd;
    }

    public void setSubscriptionCurrentPeriodEnd(Instant subscriptionCurrentPeriodEnd) {
        this.subscriptionCurrentPeriodEnd = subscriptionCurrentPeriodEnd;
    }

    public boolean isSubscriptionCancelAtPeriodEnd() {
        return subscriptionCancelAtPeriodEnd;
    }

    public void setSubscriptionCancelAtPeriodEnd(boolean subscriptionCancelAtPeriodEnd) {
        this.subscriptionCancelAtPeriodEnd = subscriptionCancelAtPeriodEnd;
    }

    // Helper methods
    public boolean hasActiveSubscription() {
        if (subscriptionStatus == SubscriptionStatus.ACTIVE) {
            return true;
        }
        if (subscriptionStatus == SubscriptionStatus.TRIALING) {
            return trialEndsAt != null && trialEndsAt.isAfter(Instant.now());
        }
        return false;
    }

    public boolean hasLapsedSubscription() {
        return subscriptionStatus == SubscriptionStatus.PAST_DUE
                || subscriptionStatus == SubscriptionStatus.CANCELED
                || subscriptionStatus == SubscriptionStatus.UNPAID;
    }

    public boolean needsSubscription() {
        if (subscriptionStatus == SubscriptionStatus.NONE) {
            return true;
        }
        if (subscriptionStatus == SubscriptionStatus.TRIALING) {
            return trialEndsAt == null || !trialEndsAt.isAfter(Instant.now());
        }
        return false;
    }

    public boolean isTrialing() {
        return subscriptionStatus == SubscriptionStatus.TRIALING
                && trialEndsAt != null && trialEndsAt.isAfter(Instant.now());
    }

    public Integer getTrialDaysRemaining() {
        if (!isTrialing()) return null;
        long seconds = java.time.Duration.between(Instant.now(), trialEndsAt).getSeconds();
        return Math.max(0, (int) (seconds / 86400));
    }

    public void startTrial() {
        this.subscriptionStatus = SubscriptionStatus.TRIALING;
        this.trialEndsAt = Instant.now().plus(java.time.Duration.ofDays(14));
        this.trialUsed = true;
    }

    // Trial getters and setters
    public Instant getTrialEndsAt() {
        return trialEndsAt;
    }

    public void setTrialEndsAt(Instant trialEndsAt) {
        this.trialEndsAt = trialEndsAt;
    }

    public boolean isTrialUsed() {
        return trialUsed;
    }

    public void setTrialUsed(boolean trialUsed) {
        this.trialUsed = trialUsed;
    }

    // Featured promotion getters and setters
    public boolean isFeatured() {
        return isFeatured;
    }

    public void setFeatured(boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public LocalDateTime getFeaturedUntil() {
        return featuredUntil;
    }

    public void setFeaturedUntil(LocalDateTime featuredUntil) {
        this.featuredUntil = featuredUntil;
    }

    public String getFeaturedPurchaseId() {
        return featuredPurchaseId;
    }

    public void setFeaturedPurchaseId(String featuredPurchaseId) {
        this.featuredPurchaseId = featuredPurchaseId;
    }

    // Helper method for checking active featured status
    public boolean isCurrentlyFeatured() {
        return isFeatured && featuredUntil != null && featuredUntil.isAfter(LocalDateTime.now());
    }

    // Stripe Connect getters and setters
    public String getStripeConnectAccountId() {
        return stripeConnectAccountId;
    }

    public void setStripeConnectAccountId(String stripeConnectAccountId) {
        this.stripeConnectAccountId = stripeConnectAccountId;
    }

    public boolean isConnectOnboardingComplete() {
        return connectOnboardingComplete;
    }

    public void setConnectOnboardingComplete(boolean connectOnboardingComplete) {
        this.connectOnboardingComplete = connectOnboardingComplete;
    }

    public boolean isPayoutsEnabled() {
        return payoutsEnabled;
    }

    public void setPayoutsEnabled(boolean payoutsEnabled) {
        this.payoutsEnabled = payoutsEnabled;
    }

    // Review rating getters and setters
    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
    }
}
