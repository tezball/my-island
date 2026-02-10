package com.myisland.api.modules.accommodation.dto;

import com.myisland.api.modules.accommodation.entity.Owner;

import java.time.Instant;

public record OwnerSubscriptionDto(
        String status,
        Instant currentPeriodEnd,
        boolean cancelAtPeriodEnd,
        boolean hasActiveSubscription,
        boolean hasLapsedSubscription,
        boolean needsSubscription,
        boolean isTrialing,
        Integer trialDaysRemaining
) {
    public static OwnerSubscriptionDto from(Owner owner) {
        return new OwnerSubscriptionDto(
                owner.getSubscriptionStatus().name(),
                owner.getSubscriptionCurrentPeriodEnd(),
                owner.isSubscriptionCancelAtPeriodEnd(),
                owner.hasActiveSubscription(),
                owner.hasLapsedSubscription(),
                owner.needsSubscription(),
                owner.isTrialing(),
                owner.getTrialDaysRemaining()
        );
    }
}
