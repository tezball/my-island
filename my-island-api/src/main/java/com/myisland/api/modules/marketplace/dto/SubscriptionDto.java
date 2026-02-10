package com.myisland.api.modules.marketplace.dto;

import com.myisland.api.modules.marketplace.entity.Supplier;

import java.time.Instant;

public record SubscriptionDto(
        String status,
        Instant currentPeriodEnd,
        boolean cancelAtPeriodEnd,
        boolean hasActiveSubscription,
        boolean hasLapsedSubscription,
        boolean needsSubscription,
        boolean isTrialing,
        Integer trialDaysRemaining
) {
    public static SubscriptionDto from(Supplier supplier) {
        return new SubscriptionDto(
                supplier.getSubscriptionStatus().name(),
                supplier.getSubscriptionCurrentPeriodEnd(),
                supplier.isSubscriptionCancelAtPeriodEnd(),
                supplier.hasActiveSubscription(),
                supplier.hasLapsedSubscription(),
                supplier.needsSubscription(),
                supplier.isTrialing(),
                supplier.getTrialDaysRemaining()
        );
    }
}
