package com.myisland.api.modules.identity.service;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.identity.dto.StaffMemberDto;
import com.myisland.api.modules.identity.entity.StaffMember;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.StaffMemberRepository;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.shared.exceptions.BadRequestException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    private static final Logger log = LoggerFactory.getLogger(StaffService.class);

    private final StaffMemberRepository staffMemberRepository;
    private final UserRepository userRepository;
    private final OwnerRepository ownerRepository;
    private final SupplierRepository supplierRepository;

    public StaffService(StaffMemberRepository staffMemberRepository,
                        UserRepository userRepository,
                        OwnerRepository ownerRepository,
                        SupplierRepository supplierRepository) {
        this.staffMemberRepository = staffMemberRepository;
        this.userRepository = userRepository;
        this.ownerRepository = ownerRepository;
        this.supplierRepository = supplierRepository;
    }

    @Transactional
    public StaffMemberDto addStaffForOwner(Long userId, String email) {
        Owner owner = ownerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner profile not found for user"));

        if (staffMemberRepository.findByOwnerIdAndEmail(owner.getId(), email).isPresent()) {
            throw new BadRequestException("Staff member with this email already exists");
        }

        StaffMember staffMember = new StaffMember();
        staffMember.setEmail(email);
        staffMember.setOwner(owner);

        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            staffMember.setUser(user);
            staffMember.setStatus(StaffMember.StaffStatus.ACTIVE);
            user.setStaff(true);
            userRepository.save(user);
        }

        staffMember = staffMemberRepository.save(staffMember);
        log.info("Added staff member {} for owner {}", email, owner.getId());
        return StaffMemberDto.from(staffMember);
    }

    @Transactional
    public StaffMemberDto addStaffForSupplier(Long userId, String email) {
        Supplier supplier = supplierRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier profile not found for user"));

        if (staffMemberRepository.findBySupplierIdAndEmail(supplier.getId(), email).isPresent()) {
            throw new BadRequestException("Staff member with this email already exists");
        }

        StaffMember staffMember = new StaffMember();
        staffMember.setEmail(email);
        staffMember.setSupplier(supplier);

        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            staffMember.setUser(user);
            staffMember.setStatus(StaffMember.StaffStatus.ACTIVE);
            user.setStaff(true);
            userRepository.save(user);
        }

        staffMember = staffMemberRepository.save(staffMember);
        log.info("Added staff member {} for supplier {}", email, supplier.getId());
        return StaffMemberDto.from(staffMember);
    }

    @Transactional
    public void removeStaffForOwner(Long userId, Long staffMemberId) {
        Owner owner = ownerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner profile not found for user"));

        StaffMember staffMember = staffMemberRepository.findById(staffMemberId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member", staffMemberId));

        if (staffMember.getOwner() == null || !staffMember.getOwner().getId().equals(owner.getId())) {
            throw new BadRequestException("Staff member does not belong to this owner");
        }

        staffMemberRepository.delete(staffMember);

        // If user has no remaining staff memberships, remove staff flag
        if (staffMember.getUser() != null) {
            removeStaffFlagIfNoMemberships(staffMember.getUser());
        }

        log.info("Removed staff member {} from owner {}", staffMemberId, owner.getId());
    }

    @Transactional
    public void removeStaffForSupplier(Long userId, Long staffMemberId) {
        Supplier supplier = supplierRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier profile not found for user"));

        StaffMember staffMember = staffMemberRepository.findById(staffMemberId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member", staffMemberId));

        if (staffMember.getSupplier() == null || !staffMember.getSupplier().getId().equals(supplier.getId())) {
            throw new BadRequestException("Staff member does not belong to this supplier");
        }

        staffMemberRepository.delete(staffMember);

        // If user has no remaining staff memberships, remove staff flag
        if (staffMember.getUser() != null) {
            removeStaffFlagIfNoMemberships(staffMember.getUser());
        }

        log.info("Removed staff member {} from supplier {}", staffMemberId, supplier.getId());
    }

    @Transactional(readOnly = true)
    public List<StaffMemberDto> listStaffForOwner(Long userId) {
        Owner owner = ownerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner profile not found for user"));
        return staffMemberRepository.findByOwnerId(owner.getId()).stream()
                .map(StaffMemberDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StaffMemberDto> listStaffForSupplier(Long userId) {
        Supplier supplier = supplierRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier profile not found for user"));
        return staffMemberRepository.findBySupplierId(supplier.getId()).stream()
                .map(StaffMemberDto::from)
                .toList();
    }

    /**
     * Called from AuthService.signup() to activate any pending staff invitations.
     */
    @Transactional
    public void activateStaffOnSignup(User user) {
        List<StaffMember> invitations = staffMemberRepository.findByEmail(user.getEmail());
        if (invitations.isEmpty()) return;

        boolean activated = false;
        for (StaffMember invitation : invitations) {
            if (invitation.getStatus() == StaffMember.StaffStatus.INVITED) {
                invitation.setUser(user);
                invitation.setStatus(StaffMember.StaffStatus.ACTIVE);
                staffMemberRepository.save(invitation);
                activated = true;
            }
        }

        if (activated) {
            user.setStaff(true);
            userRepository.save(user);
            log.info("Activated staff memberships for new user: {}", user.getEmail());
        }
    }

    /**
     * Resolve the owner for a user — either direct ownership or via staff membership.
     */
    @Transactional(readOnly = true)
    public Optional<Owner> resolveOwnerForUser(Long userId) {
        // Check direct ownership first
        Optional<Owner> directOwner = ownerRepository.findByUserId(userId);
        if (directOwner.isPresent()) return directOwner;

        // Check staff membership
        List<StaffMember> memberships = staffMemberRepository.findByUserId(userId);
        return memberships.stream()
                .filter(sm -> sm.getOwner() != null && sm.getStatus() == StaffMember.StaffStatus.ACTIVE)
                .map(StaffMember::getOwner)
                .findFirst();
    }

    /**
     * Resolve the supplier for a user — either direct supplier or via staff membership.
     */
    @Transactional(readOnly = true)
    public Optional<Supplier> resolveSupplierForUser(Long userId) {
        // Check direct supplier first
        Optional<Supplier> directSupplier = supplierRepository.findByUserId(userId);
        if (directSupplier.isPresent()) return directSupplier;

        // Check staff membership
        List<StaffMember> memberships = staffMemberRepository.findByUserId(userId);
        return memberships.stream()
                .filter(sm -> sm.getSupplier() != null && sm.getStatus() == StaffMember.StaffStatus.ACTIVE)
                .map(StaffMember::getSupplier)
                .findFirst();
    }

    private void removeStaffFlagIfNoMemberships(User user) {
        // Need to check after deletion — count remaining active memberships
        List<StaffMember> remaining = staffMemberRepository.findByUserId(user.getId());
        if (remaining.isEmpty()) {
            user.setStaff(false);
            userRepository.save(user);
            log.info("Removed staff flag from user {} — no remaining memberships", user.getEmail());
        }
    }
}
