package com.myisland.api.modules.identity.service;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.identity.entity.StaffMember;
import com.myisland.api.modules.identity.repository.StaffMemberRepository;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.shared.exceptions.ForbiddenException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

/**
 * Enforces staff ACL permissions at the service layer.
 * If user IS the owner/supplier → full access (skip check).
 * If user IS staff → look up StaffMember, check role permissions.
 */
@Service
public class StaffPermissionChecker {

    private final OwnerRepository ownerRepository;
    private final SupplierRepository supplierRepository;
    private final StaffMemberRepository staffMemberRepository;

    public StaffPermissionChecker(OwnerRepository ownerRepository,
                                   SupplierRepository supplierRepository,
                                   StaffMemberRepository staffMemberRepository) {
        this.ownerRepository = ownerRepository;
        this.supplierRepository = supplierRepository;
        this.staffMemberRepository = staffMemberRepository;
    }

    /**
     * Check if a user has at least the required access level for a permission group on an owner.
     * Owners get full access. Staff are checked against their role permissions.
     * @throws ForbiddenException if denied
     */
    @Transactional(readOnly = true)
    public void checkOwnerPermission(Long userId, Owner owner, PermissionGroup group, AccessLevel required) {
        // Direct owner → full access
        if (owner.getUser().getId().equals(userId)) {
            return;
        }

        // Must be staff
        Optional<StaffMember> staffOpt = staffMemberRepository.findByOwnerIdAndUserId(owner.getId(), userId);
        if (staffOpt.isEmpty() || staffOpt.get().getStatus() != StaffMember.StaffStatus.ACTIVE) {
            throw new ForbiddenException("You do not have permission to access this resource");
        }

        StaffMember staff = staffOpt.get();
        Map<PermissionGroup, AccessLevel> permissions = StaffPermissions.getOwnerPermissions(staff.getRole());
        AccessLevel actual = permissions.getOrDefault(group, AccessLevel.NONE);

        if (!meetsRequirement(actual, required)) {
            throw new ForbiddenException("You do not have " + required.name().toLowerCase() + " access to " + group.name().toLowerCase());
        }
    }

    /**
     * Check if a user has at least the required access level for a permission group on a supplier.
     */
    @Transactional(readOnly = true)
    public void checkSupplierPermission(Long userId, Supplier supplier, PermissionGroup group, AccessLevel required) {
        // Direct supplier → full access
        if (supplier.getUser().getId().equals(userId)) {
            return;
        }

        Optional<StaffMember> staffOpt = staffMemberRepository.findBySupplierIdAndUserId(supplier.getId(), userId);
        if (staffOpt.isEmpty() || staffOpt.get().getStatus() != StaffMember.StaffStatus.ACTIVE) {
            throw new ForbiddenException("You do not have permission to access this resource");
        }

        StaffMember staff = staffOpt.get();
        Map<PermissionGroup, AccessLevel> permissions = StaffPermissions.getSupplierPermissions(staff.getRole());
        AccessLevel actual = permissions.getOrDefault(group, AccessLevel.NONE);

        if (!meetsRequirement(actual, required)) {
            throw new ForbiddenException("You do not have " + required.name().toLowerCase() + " access to " + group.name().toLowerCase());
        }
    }

    /**
     * Resolve the owner for a user (direct or via staff) and check permission in one call.
     */
    @Transactional(readOnly = true)
    public Owner resolveOwnerAndCheck(Long userId, PermissionGroup group, AccessLevel required) {
        // Check direct ownership first
        Optional<Owner> directOwner = ownerRepository.findByUserId(userId);
        if (directOwner.isPresent()) {
            return directOwner.get(); // Owner always has full access
        }

        // Check staff membership
        Optional<StaffMember> staffOpt = staffMemberRepository.findByUserId(userId).stream()
                .filter(sm -> sm.getOwner() != null && sm.getStatus() == StaffMember.StaffStatus.ACTIVE)
                .findFirst();

        if (staffOpt.isEmpty()) {
            throw new ResourceNotFoundException("Owner profile not found for user");
        }

        StaffMember staff = staffOpt.get();
        Map<PermissionGroup, AccessLevel> permissions = StaffPermissions.getOwnerPermissions(staff.getRole());
        AccessLevel actual = permissions.getOrDefault(group, AccessLevel.NONE);

        if (!meetsRequirement(actual, required)) {
            throw new ForbiddenException("You do not have " + required.name().toLowerCase() + " access to " + group.name().toLowerCase());
        }

        return staff.getOwner();
    }

    /**
     * Resolve the supplier for a user (direct or via staff) and check permission in one call.
     */
    @Transactional(readOnly = true)
    public Supplier resolveSupplierAndCheck(Long userId, PermissionGroup group, AccessLevel required) {
        Optional<Supplier> directSupplier = supplierRepository.findByUserId(userId);
        if (directSupplier.isPresent()) {
            return directSupplier.get();
        }

        Optional<StaffMember> staffOpt = staffMemberRepository.findByUserId(userId).stream()
                .filter(sm -> sm.getSupplier() != null && sm.getStatus() == StaffMember.StaffStatus.ACTIVE)
                .findFirst();

        if (staffOpt.isEmpty()) {
            throw new ResourceNotFoundException("Supplier profile not found for user");
        }

        StaffMember staff = staffOpt.get();
        Map<PermissionGroup, AccessLevel> permissions = StaffPermissions.getSupplierPermissions(staff.getRole());
        AccessLevel actual = permissions.getOrDefault(group, AccessLevel.NONE);

        if (!meetsRequirement(actual, required)) {
            throw new ForbiddenException("You do not have " + required.name().toLowerCase() + " access to " + group.name().toLowerCase());
        }

        return staff.getSupplier();
    }

    private boolean meetsRequirement(AccessLevel actual, AccessLevel required) {
        return actual.ordinal() >= required.ordinal();
    }
}
