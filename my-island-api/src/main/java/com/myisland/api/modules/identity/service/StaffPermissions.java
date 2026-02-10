package com.myisland.api.modules.identity.service;

import com.myisland.api.modules.identity.entity.StaffRole;

import java.util.EnumMap;
import java.util.Map;

import static com.myisland.api.modules.identity.service.AccessLevel.*;
import static com.myisland.api.modules.identity.service.PermissionGroup.*;

/**
 * Static mapping of StaffRole → {PermissionGroup → AccessLevel}.
 * This is the single source of truth for what each role can do.
 */
public final class StaffPermissions {

    private StaffPermissions() {}

    // --- Owner Portal Roles ---

    private static final Map<PermissionGroup, AccessLevel> OWNER_MANAGER = Map.ofEntries(
            Map.entry(DASHBOARD, FULL), Map.entry(TODAY, FULL), Map.entry(LOTS, FULL),
            Map.entry(BOOKINGS, FULL), Map.entry(CALENDAR, FULL), Map.entry(PRICING, FULL),
            Map.entry(PROPERTY, FULL), Map.entry(REVIEWS, FULL), Map.entry(SETTINGS, FULL),
            Map.entry(BILLING, NONE), Map.entry(STAFF, NONE)
    );

    private static final Map<PermissionGroup, AccessLevel> OWNER_RECEPTIONIST = Map.ofEntries(
            Map.entry(DASHBOARD, READ), Map.entry(TODAY, READ), Map.entry(LOTS, READ),
            Map.entry(BOOKINGS, FULL), Map.entry(CALENDAR, READ), Map.entry(PRICING, READ),
            Map.entry(PROPERTY, READ), Map.entry(REVIEWS, READ), Map.entry(SETTINGS, NONE),
            Map.entry(BILLING, NONE), Map.entry(STAFF, NONE)
    );

    private static final Map<PermissionGroup, AccessLevel> OWNER_GROUNDSKEEPER = Map.ofEntries(
            Map.entry(DASHBOARD, READ), Map.entry(TODAY, READ), Map.entry(LOTS, FULL),
            Map.entry(BOOKINGS, READ), Map.entry(CALENDAR, FULL), Map.entry(PRICING, READ),
            Map.entry(PROPERTY, READ), Map.entry(REVIEWS, READ), Map.entry(SETTINGS, NONE),
            Map.entry(BILLING, NONE), Map.entry(STAFF, NONE)
    );

    private static final Map<PermissionGroup, AccessLevel> OWNER_VIEWER = Map.ofEntries(
            Map.entry(DASHBOARD, READ), Map.entry(TODAY, READ), Map.entry(LOTS, READ),
            Map.entry(BOOKINGS, READ), Map.entry(CALENDAR, READ), Map.entry(PRICING, READ),
            Map.entry(PROPERTY, READ), Map.entry(REVIEWS, READ), Map.entry(SETTINGS, READ),
            Map.entry(BILLING, NONE), Map.entry(STAFF, NONE)
    );

    // --- Supplier Portal Roles ---

    private static final Map<PermissionGroup, AccessLevel> SUPPLIER_MANAGER = Map.ofEntries(
            Map.entry(DASHBOARD, FULL), Map.entry(OFFERS, FULL), Map.entry(REDEEM, FULL),
            Map.entry(PROFILE, FULL), Map.entry(REVIEWS, FULL), Map.entry(SETTINGS, FULL),
            Map.entry(BILLING, NONE), Map.entry(STAFF, NONE)
    );

    private static final Map<PermissionGroup, AccessLevel> SUPPLIER_ASSOCIATE = Map.ofEntries(
            Map.entry(DASHBOARD, READ), Map.entry(OFFERS, FULL), Map.entry(REDEEM, FULL),
            Map.entry(PROFILE, READ), Map.entry(REVIEWS, READ), Map.entry(SETTINGS, NONE),
            Map.entry(BILLING, NONE), Map.entry(STAFF, NONE)
    );

    private static final Map<PermissionGroup, AccessLevel> SUPPLIER_REDEEMER = Map.ofEntries(
            Map.entry(DASHBOARD, READ), Map.entry(OFFERS, READ), Map.entry(REDEEM, FULL),
            Map.entry(PROFILE, READ), Map.entry(REVIEWS, NONE), Map.entry(SETTINGS, NONE),
            Map.entry(BILLING, NONE), Map.entry(STAFF, NONE)
    );

    private static final Map<PermissionGroup, AccessLevel> SUPPLIER_VIEWER = Map.ofEntries(
            Map.entry(DASHBOARD, READ), Map.entry(OFFERS, READ), Map.entry(REDEEM, READ),
            Map.entry(PROFILE, READ), Map.entry(REVIEWS, READ), Map.entry(SETTINGS, READ),
            Map.entry(BILLING, NONE), Map.entry(STAFF, NONE)
    );

    /**
     * Get permissions for an owner staff role.
     */
    public static Map<PermissionGroup, AccessLevel> getOwnerPermissions(StaffRole role) {
        return switch (role) {
            case MANAGER -> OWNER_MANAGER;
            case RECEPTIONIST -> OWNER_RECEPTIONIST;
            case GROUNDSKEEPER -> OWNER_GROUNDSKEEPER;
            case VIEWER -> OWNER_VIEWER;
            // Supplier-specific roles shouldn't be used for owners, default to viewer
            case ASSOCIATE, REDEEMER -> OWNER_VIEWER;
        };
    }

    /**
     * Get permissions for a supplier staff role.
     */
    public static Map<PermissionGroup, AccessLevel> getSupplierPermissions(StaffRole role) {
        return switch (role) {
            case MANAGER -> SUPPLIER_MANAGER;
            case ASSOCIATE -> SUPPLIER_ASSOCIATE;
            case REDEEMER -> SUPPLIER_REDEEMER;
            case VIEWER -> SUPPLIER_VIEWER;
            // Owner-specific roles shouldn't be used for suppliers, default to viewer
            case RECEPTIONIST, GROUNDSKEEPER -> SUPPLIER_VIEWER;
        };
    }

    /**
     * Convert a permission map to a serializable Map<String, String> for API responses.
     */
    public static Map<String, String> toStringMap(Map<PermissionGroup, AccessLevel> permissions) {
        Map<String, String> result = new java.util.LinkedHashMap<>();
        for (Map.Entry<PermissionGroup, AccessLevel> entry : permissions.entrySet()) {
            result.put(entry.getKey().name().toLowerCase(), entry.getValue().name());
        }
        return result;
    }
}
