package com.myisland.api.modules.marketplace.service;

import com.myisland.api.modules.identity.service.AccessLevel;
import com.myisland.api.modules.identity.service.PermissionGroup;
import com.myisland.api.modules.identity.service.StaffPermissionChecker;
import com.myisland.api.modules.marketplace.dto.*;
import com.myisland.api.modules.marketplace.entity.Offer;
import com.myisland.api.modules.marketplace.entity.OfferClaim;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.OfferClaimRepository;
import com.myisland.api.modules.marketplace.repository.OfferRepository;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.modules.admin.service.FeatureToggleService;
import com.myisland.api.shared.exceptions.BadRequestException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class SupplierService {

    private static final Logger log = LoggerFactory.getLogger(SupplierService.class);

    private final SupplierRepository supplierRepository;
    private final OfferRepository offerRepository;
    private final OfferClaimRepository offerClaimRepository;
    private final StaffPermissionChecker permissionChecker;
    private final FeatureToggleService featureToggleService;

    public SupplierService(SupplierRepository supplierRepository, OfferRepository offerRepository,
            OfferClaimRepository offerClaimRepository, StaffPermissionChecker permissionChecker,
            FeatureToggleService featureToggleService) {
        this.supplierRepository = supplierRepository;
        this.offerRepository = offerRepository;
        this.offerClaimRepository = offerClaimRepository;
        this.permissionChecker = permissionChecker;
        this.featureToggleService = featureToggleService;
    }

    @Transactional(readOnly = true)
    public SupplierDto getSupplierProfile(Long userId) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.PROFILE, AccessLevel.READ);
        return SupplierDto.from(supplier);
    }

    @Transactional
    public SupplierDto updateSupplierProfile(Long userId, UpdateSupplierRequest request) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.PROFILE, AccessLevel.FULL);

        if (request.businessName() != null) {
            supplier.setBusinessName(request.businessName());
        }
        if (request.category() != null) {
            supplier.setCategory(Supplier.SupplierCategory.valueOf(request.category()));
        }
        if (request.description() != null) {
            supplier.setDescription(request.description());
        }
        if (request.county() != null) {
            supplier.setCounty(request.county());
        }
        if (request.town() != null) {
            supplier.setTown(request.town());
        }
        if (request.address() != null) {
            supplier.setAddress(request.address());
        }
        if (request.phone() != null) {
            supplier.setPhone(request.phone());
        }
        if (request.website() != null) {
            supplier.setWebsite(request.website());
        }
        if (request.logoUrl() != null) {
            supplier.setLogoUrl(request.logoUrl());
        }
        if (request.latitude() != null) {
            supplier.setLatitude(request.latitude());
        }
        if (request.longitude() != null) {
            supplier.setLongitude(request.longitude());
        }

        supplier = supplierRepository.save(supplier);
        log.info("Updated supplier profile: {}", supplier.getId());
        return SupplierDto.from(supplier);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSupplierDashboard(Long userId) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.DASHBOARD, AccessLevel.READ);

        List<Offer> activeOffers = offerRepository.findBySupplierIdAndIsActiveTrue(supplier.getId());
        long totalClaims = offerClaimRepository.countBySupplierIdAndStatus(supplier.getId(),
                OfferClaim.ClaimStatus.CLAIMED);
        long totalRedeemed = offerClaimRepository.countBySupplierIdAndStatus(supplier.getId(),
                OfferClaim.ClaimStatus.REDEEMED);

        List<OfferClaim> recentClaims = offerClaimRepository.findBySupplierIdOrderByClaimedAtDesc(supplier.getId())
                .stream()
                .filter(c -> !c.isTest())
                .limit(10)
                .toList();

        return Map.of(
                "activeOffers", activeOffers.size(),
                "totalOffers", supplier.getOffers().size(),
                "pendingClaims", totalClaims,
                "totalRedeemed", totalRedeemed,
                "recentClaims", recentClaims.stream()
                        .map(OfferClaimDto::from)
                        .toList());
    }

    @Transactional(readOnly = true)
    public List<OfferDto> getSupplierOffers(Long userId) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.OFFERS, AccessLevel.READ);
        return offerRepository.findBySupplierId(supplier.getId()).stream()
                .map(OfferDto::from)
                .toList();
    }

    @Transactional
    public OfferDto createOffer(Long userId, CreateOfferRequest request) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.OFFERS, AccessLevel.FULL);

        // Require active subscription to create offers
        if (featureToggleService.isSubscriptionEnforced() && !supplier.hasActiveSubscription()) {
            throw new BadRequestException("An active subscription is required to create offers.");
        }

        if (request.validUntil().isBefore(request.validFrom())) {
            throw new BadRequestException("Valid until date must be after valid from date");
        }

        Offer offer = Offer.builder()
                .supplier(supplier)
                .title(request.title())
                .description(request.description())
                .discountType(Offer.DiscountType.valueOf(request.discountType()))
                .discountValue(request.discountValue())
                .minPurchase(request.minPurchase())
                .termsConditions(request.termsConditions())
                .validFrom(request.validFrom())
                .validUntil(request.validUntil())
                .maxClaims(request.maxClaims())
                .imageUrl(request.imageUrl())
                .build();

        offer = offerRepository.save(offer);
        log.info("Created offer: {} for supplier: {}", offer.getId(), supplier.getId());
        return OfferDto.from(offer);
    }

    @Transactional
    public OfferDto updateOffer(Long userId, Long offerId, UpdateOfferRequest request) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.OFFERS, AccessLevel.FULL);

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", offerId));

        if (!offer.getSupplier().getId().equals(supplier.getId())) {
            throw new BadRequestException("Offer does not belong to this supplier");
        }

        if (request.title() != null) {
            offer.setTitle(request.title());
        }
        if (request.description() != null) {
            offer.setDescription(request.description());
        }
        if (request.discountType() != null) {
            offer.setDiscountType(Offer.DiscountType.valueOf(request.discountType()));
        }
        if (request.discountValue() != null) {
            offer.setDiscountValue(request.discountValue());
        }
        if (request.minPurchase() != null) {
            offer.setMinPurchase(request.minPurchase());
        }
        if (request.termsConditions() != null) {
            offer.setTermsConditions(request.termsConditions());
        }
        if (request.validFrom() != null) {
            offer.setValidFrom(request.validFrom());
        }
        if (request.validUntil() != null) {
            offer.setValidUntil(request.validUntil());
        }
        if (request.maxClaims() != null) {
            offer.setMaxClaims(request.maxClaims());
        }
        if (request.isActive() != null) {
            if (request.isActive() && featureToggleService.isSubscriptionEnforced() && !supplier.hasActiveSubscription()) {
                throw new BadRequestException("An active subscription is required to activate offers.");
            }
            offer.setActive(request.isActive());
        }
        if (request.imageUrl() != null) {
            offer.setImageUrl(request.imageUrl());
        }

        offer = offerRepository.save(offer);
        log.info("Updated offer: {}", offerId);
        return OfferDto.from(offer);
    }

    @Transactional
    public void deleteOffer(Long userId, Long offerId) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.OFFERS, AccessLevel.FULL);

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", offerId));

        if (!offer.getSupplier().getId().equals(supplier.getId())) {
            throw new BadRequestException("Offer does not belong to this supplier");
        }

        // Check for active claims
        long activeClaims = offer.getClaims().stream()
                .filter(c -> c.getStatus() == OfferClaim.ClaimStatus.CLAIMED && !c.isTest())
                .count();
        if (activeClaims > 0) {
            throw new BadRequestException("Cannot delete offer with active claims. Deactivate it instead.");
        }

        offerRepository.delete(offer);
        log.info("Deleted offer: {}", offerId);
    }

    @Transactional(readOnly = true)
    public List<OfferClaimDto> getOfferClaims(Long userId, Long offerId) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.OFFERS, AccessLevel.READ);

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", offerId));

        if (!offer.getSupplier().getId().equals(supplier.getId())) {
            throw new BadRequestException("Offer does not belong to this supplier");
        }

        return offerClaimRepository.findByOfferId(offerId).stream()
                .map(OfferClaimDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OfferClaimDto> getAllSupplierClaims(Long userId) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.OFFERS, AccessLevel.READ);

        return offerClaimRepository.findBySupplierIdAndIsTestFalse(supplier.getId()).stream()
                .map(OfferClaimDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OfferClaimDto> getTestClaims(Long userId) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.OFFERS, AccessLevel.READ);

        return offerClaimRepository.findBySupplierIdAndIsTestTrue(supplier.getId()).stream()
                .map(OfferClaimDto::from)
                .toList();
    }

    // --- Preferences ---

    @Transactional(readOnly = true)
    public SupplierPreferencesDto getSupplierPreferences(Long userId) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.SETTINGS, AccessLevel.READ);
        return SupplierPreferencesDto.from(
                supplier.isEmailNotifications(),
                supplier.isNewClaimAlerts(),
                supplier.isWeeklyReport(),
                supplier.isMarketingEmails()
        );
    }

    @Transactional
    public SupplierPreferencesDto updateSupplierPreferences(Long userId, SupplierPreferencesDto preferences) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.SETTINGS, AccessLevel.FULL);

        supplier.setEmailNotifications(preferences.emailNotifications());
        supplier.setNewClaimAlerts(preferences.newClaimAlerts());
        supplier.setWeeklyReport(preferences.weeklyReport());
        supplier.setMarketingEmails(preferences.marketingEmails());

        supplierRepository.save(supplier);
        log.info("Updated supplier preferences for user: {}", userId);

        return SupplierPreferencesDto.from(
                supplier.isEmailNotifications(),
                supplier.isNewClaimAlerts(),
                supplier.isWeeklyReport(),
                supplier.isMarketingEmails()
        );
    }

    // --- Deactivation ---

    @Transactional
    public void deactivateSupplier(Long userId) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.SETTINGS, AccessLevel.FULL);

        supplier.setDeactivated(true);

        // Deactivate all active offers
        offerRepository.findBySupplierIdAndIsActiveTrue(supplier.getId())
                .forEach(offer -> offer.setActive(false));

        supplierRepository.save(supplier);
        log.info("Deactivated supplier account for user: {}", userId);
    }

    @Transactional
    public void reactivateSupplier(Long userId) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.SETTINGS, AccessLevel.FULL);

        supplier.setDeactivated(false);
        supplierRepository.save(supplier);
        log.info("Reactivated supplier account for user: {}", userId);
    }

    @Transactional(readOnly = true)
    public boolean isSupplierDeactivated(Long userId) {
        Supplier supplier = permissionChecker.resolveSupplierAndCheck(userId, PermissionGroup.PROFILE, AccessLevel.READ);
        return supplier.isDeactivated();
    }
}
