package com.myisland.api.modules.marketplace.dto;

public record CreatePortalSessionResponse(String portalUrl, boolean devMode) {
    public CreatePortalSessionResponse(String portalUrl) {
        this(portalUrl, false);
    }
}
