package com.myisland.api.modules.accommodation.entity;

import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "owners")
public class Owner extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "property_name", nullable = false)
    private String propertyName;

    @Column(nullable = false)
    private String county;

    private String town;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false)
    private PropertyType propertyType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    private String phone;

    private String website;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Lot> lots = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "campsite_amenities",
            joinColumns = @JoinColumn(name = "owner_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private Set<Amenity> amenities = new HashSet<>();

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

    // Preference fields
    @Column(name = "email_notifications_bookings")
    private boolean emailNotificationsBookings = true;

    @Column(name = "weekly_summary_reports")
    private boolean weeklySummaryReports = false;

    @Column(name = "instant_booking")
    private boolean instantBooking = true;

    @Column(name = "allow_same_day_bookings")
    private boolean allowSameDayBookings = false;

    @Column(name = "require_guest_verification")
    private boolean requireGuestVerification = true;

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

    public enum SubscriptionStatus {
        NONE,       // Never subscribed
        ACTIVE,     // Subscription is active
        PAST_DUE,   // Payment failed, in grace period
        CANCELED,   // Subscription was canceled
        UNPAID      // Payment failed, subscription suspended
    }

    public enum PropertyType {
        CAMPSITE, GLAMPING, HOLIDAY_PARK, FARM, WOODLAND
    }

    public Owner() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private User user;
        private String propertyName;
        private String county;
        private String town;
        private PropertyType propertyType;
        private String description;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String phone;
        private String website;

        public Builder user(User user) { this.user = user; return this; }
        public Builder propertyName(String propertyName) { this.propertyName = propertyName; return this; }
        public Builder county(String county) { this.county = county; return this; }
        public Builder town(String town) { this.town = town; return this; }
        public Builder propertyType(PropertyType propertyType) { this.propertyType = propertyType; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder latitude(BigDecimal latitude) { this.latitude = latitude; return this; }
        public Builder latitude(Double latitude) { this.latitude = latitude != null ? BigDecimal.valueOf(latitude) : null; return this; }
        public Builder longitude(BigDecimal longitude) { this.longitude = longitude; return this; }
        public Builder longitude(Double longitude) { this.longitude = longitude != null ? BigDecimal.valueOf(longitude) : null; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder website(String website) { this.website = website; return this; }

        public Owner build() {
            Owner owner = new Owner();
            owner.user = this.user;
            owner.propertyName = this.propertyName;
            owner.county = this.county;
            owner.town = this.town;
            owner.propertyType = this.propertyType;
            owner.description = this.description;
            owner.latitude = this.latitude;
            owner.longitude = this.longitude;
            owner.phone = this.phone;
            owner.website = this.website;
            return owner;
        }
    }

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getPropertyName() { return propertyName; }
    public void setPropertyName(String propertyName) { this.propertyName = propertyName; }

    public String getCounty() { return county; }
    public void setCounty(String county) { this.county = county; }

    public String getTown() { return town; }
    public void setTown(String town) { this.town = town; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public Set<Lot> getLots() { return lots; }
    public void setLots(Set<Lot> lots) { this.lots = lots; }

    public Set<Amenity> getAmenities() { return amenities; }
    public void setAmenities(Set<Amenity> amenities) { this.amenities = amenities; }

    // Subscription getters and setters
    public String getStripeCustomerId() { return stripeCustomerId; }
    public void setStripeCustomerId(String stripeCustomerId) { this.stripeCustomerId = stripeCustomerId; }

    public String getStripeSubscriptionId() { return stripeSubscriptionId; }
    public void setStripeSubscriptionId(String stripeSubscriptionId) { this.stripeSubscriptionId = stripeSubscriptionId; }

    public SubscriptionStatus getSubscriptionStatus() { return subscriptionStatus; }
    public void setSubscriptionStatus(SubscriptionStatus subscriptionStatus) { this.subscriptionStatus = subscriptionStatus; }

    public Instant getSubscriptionCurrentPeriodEnd() { return subscriptionCurrentPeriodEnd; }
    public void setSubscriptionCurrentPeriodEnd(Instant subscriptionCurrentPeriodEnd) { this.subscriptionCurrentPeriodEnd = subscriptionCurrentPeriodEnd; }

    public boolean isSubscriptionCancelAtPeriodEnd() { return subscriptionCancelAtPeriodEnd; }
    public void setSubscriptionCancelAtPeriodEnd(boolean subscriptionCancelAtPeriodEnd) { this.subscriptionCancelAtPeriodEnd = subscriptionCancelAtPeriodEnd; }

    // Helper methods
    public boolean hasActiveSubscription() {
        return subscriptionStatus == SubscriptionStatus.ACTIVE;
    }

    public boolean hasLapsedSubscription() {
        return subscriptionStatus == SubscriptionStatus.PAST_DUE
                || subscriptionStatus == SubscriptionStatus.CANCELED
                || subscriptionStatus == SubscriptionStatus.UNPAID;
    }

    public boolean needsSubscription() {
        return subscriptionStatus == SubscriptionStatus.NONE;
    }

    // Preference getters and setters
    public boolean isEmailNotificationsBookings() { return emailNotificationsBookings; }
    public void setEmailNotificationsBookings(boolean emailNotificationsBookings) { this.emailNotificationsBookings = emailNotificationsBookings; }

    public boolean isWeeklySummaryReports() { return weeklySummaryReports; }
    public void setWeeklySummaryReports(boolean weeklySummaryReports) { this.weeklySummaryReports = weeklySummaryReports; }

    public boolean isInstantBooking() { return instantBooking; }
    public void setInstantBooking(boolean instantBooking) { this.instantBooking = instantBooking; }

    public boolean isAllowSameDayBookings() { return allowSameDayBookings; }
    public void setAllowSameDayBookings(boolean allowSameDayBookings) { this.allowSameDayBookings = allowSameDayBookings; }

    public boolean isRequireGuestVerification() { return requireGuestVerification; }
    public void setRequireGuestVerification(boolean requireGuestVerification) { this.requireGuestVerification = requireGuestVerification; }

    // Featured promotion getters and setters
    public boolean isFeatured() { return isFeatured; }
    public void setFeatured(boolean isFeatured) { this.isFeatured = isFeatured; }

    public LocalDateTime getFeaturedUntil() { return featuredUntil; }
    public void setFeaturedUntil(LocalDateTime featuredUntil) { this.featuredUntil = featuredUntil; }

    public String getFeaturedPurchaseId() { return featuredPurchaseId; }
    public void setFeaturedPurchaseId(String featuredPurchaseId) { this.featuredPurchaseId = featuredPurchaseId; }

    // Helper method for checking active featured status
    public boolean isCurrentlyFeatured() {
        return isFeatured && featuredUntil != null && featuredUntil.isAfter(LocalDateTime.now());
    }

    // Stripe Connect getters and setters
    public String getStripeConnectAccountId() { return stripeConnectAccountId; }
    public void setStripeConnectAccountId(String stripeConnectAccountId) { this.stripeConnectAccountId = stripeConnectAccountId; }

    public boolean isConnectOnboardingComplete() { return connectOnboardingComplete; }
    public void setConnectOnboardingComplete(boolean connectOnboardingComplete) { this.connectOnboardingComplete = connectOnboardingComplete; }

    public boolean isPayoutsEnabled() { return payoutsEnabled; }
    public void setPayoutsEnabled(boolean payoutsEnabled) { this.payoutsEnabled = payoutsEnabled; }

    // Review rating getters and setters
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
}
