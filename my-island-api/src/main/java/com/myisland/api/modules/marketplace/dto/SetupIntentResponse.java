package com.myisland.api.modules.marketplace.dto;

public record SetupIntentResponse(
        String clientSecret,
        String customerId,
        String publishableKey,
        boolean devMode
) {}
