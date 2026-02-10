package com.myisland.api.modules.identity.service;

/**
 * Permission groups for owner and supplier portals.
 * Each group corresponds to a functional area in the portal.
 */
public enum PermissionGroup {
    // Owner portal groups
    DASHBOARD,
    TODAY,
    LOTS,
    BOOKINGS,
    CALENDAR,
    PRICING,
    PROPERTY,
    REVIEWS,
    SETTINGS,
    BILLING,
    STAFF,

    // Supplier portal groups
    OFFERS,
    REDEEM,
    PROFILE
}
