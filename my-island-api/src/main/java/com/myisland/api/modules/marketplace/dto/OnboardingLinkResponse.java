package com.myisland.api.modules.marketplace.dto;

public record OnboardingLinkResponse(
        String url,
        boolean devMode
) {}
