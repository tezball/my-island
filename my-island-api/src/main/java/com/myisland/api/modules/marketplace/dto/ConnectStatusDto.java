package com.myisland.api.modules.marketplace.dto;

public record ConnectStatusDto(
        boolean hasConnectAccount,
        boolean onboardingComplete,
        boolean payoutsEnabled,
        String accountId
) {}
