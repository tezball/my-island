package com.myisland.api.modules.identity.entity;

/**
 * Preset roles for staff members. Each role maps to a fixed set of permission group access levels.
 * Owner-specific roles: MANAGER, RECEPTIONIST, GROUNDSKEEPER, VIEWER
 * Supplier-specific roles: MANAGER, ASSOCIATE, REDEEMER, VIEWER
 */
public enum StaffRole {
    // Shared roles
    MANAGER,
    VIEWER,

    // Owner-specific roles
    RECEPTIONIST,
    GROUNDSKEEPER,

    // Supplier-specific roles
    ASSOCIATE,
    REDEEMER
}
