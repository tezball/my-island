package com.myisland.api.modules.marketplace.service;

import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.marketplace.dto.ClaimOfferRequest;
import com.myisland.api.modules.marketplace.dto.OfferClaimDto;
import com.myisland.api.modules.marketplace.dto.OfferDto;
import com.myisland.api.modules.marketplace.dto.SupplierDto;
import com.myisland.api.modules.marketplace.entity.Offer;
import com.myisland.api.modules.marketplace.entity.OfferClaim;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.OfferClaimRepository;
import com.myisland.api.modules.marketplace.repository.OfferRepository;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.shared.events.OfferEvent;
import com.myisland.api.shared.exceptions.BadRequestException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MarketplaceService {

    private static final Logger log = LoggerFactory.getLogger(MarketplaceService.class);

    private final SupplierRepository supplierRepository;
    private final OfferRepository offerRepository;
    private final OfferClaimRepository offerClaimRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ApplicationEventPublisher eventPublisher;

    public MarketplaceService(SupplierRepository supplierRepository, OfferRepository offerRepository,
                              OfferClaimRepository offerClaimRepository, UserRepository userRepository,
                              BookingRepository bookingRepository, ApplicationEventPublisher eventPublisher) {
        this.supplierRepository = supplierRepository;
        this.offerRepository = offerRepository;
        this.offerClaimRepository = offerClaimRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<SupplierDto> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(SupplierDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public SupplierDto getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", id));
        return SupplierDto.from(supplier);
    }

    @Transactional(readOnly = true)
    public List<OfferDto> getAvailableOffers() {
        return offerRepository.findAvailableOffers(LocalDate.now()).stream()
                .map(OfferDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OfferDto> getSupplierOffers(Long supplierId) {
        return offerRepository.findBySupplierIdAndIsActiveTrue(supplierId).stream()
                .map(OfferDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OfferDto getOfferById(Long offerId) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", offerId));
        return OfferDto.from(offer);
    }

    @Transactional
    public OfferClaimDto claimOffer(Long userId, ClaimOfferRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Offer offer = offerRepository.findById(request.offerId())
                .orElseThrow(() -> new ResourceNotFoundException("Offer", request.offerId()));

        if (!offer.isAvailable()) {
            throw new BadRequestException("Offer is not available for claiming");
        }

        // Check if user already claimed this offer
        if (offerClaimRepository.existsByOfferIdAndUserIdAndIsTestFalse(offer.getId(), userId)) {
            throw new BadRequestException("You have already claimed this offer");
        }

        Booking booking = null;
        if (request.bookingId() != null) {
            booking = bookingRepository.findById(request.bookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking", request.bookingId()));
            if (!booking.getUser().getId().equals(userId)) {
                throw new BadRequestException("Booking does not belong to this user");
            }
        }

        // Generate claim code
        String claimCode = generateClaimCode(offer);

        // Calculate expiry (end of booking or offer validity, whichever is earlier)
        LocalDateTime expiresAt;
        if (booking != null) {
            expiresAt = booking.getCheckOutDate().atTime(23, 59, 59);
        } else {
            expiresAt = offer.getValidUntil().atTime(23, 59, 59);
        }

        OfferClaim claim = OfferClaim.builder()
                .offer(offer)
                .user(user)
                .booking(booking)
                .claimCode(claimCode)
                .expiresAt(expiresAt)
                .build();

        claim = offerClaimRepository.save(claim);

        // Update offer claims count
        offer.setCurrentClaims(offer.getCurrentClaims() + 1);
        offerRepository.save(offer);

        log.info("User {} claimed offer {} with code {}", userId, offer.getId(), claimCode);

        eventPublisher.publishEvent(new OfferEvent(this, claim.getId(), OfferEvent.Type.CLAIMED));

        return OfferClaimDto.from(claim);
    }

    @Transactional
    public OfferClaimDto createTestClaim(Long userId, Long offerId) {
        Supplier supplier = supplierRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier profile not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", offerId));

        if (!offer.getSupplier().getId().equals(supplier.getId())) {
            throw new BadRequestException("Offer does not belong to this supplier");
        }

        String claimCode = generateTestClaimCode(offer);

        OfferClaim claim = OfferClaim.builder()
                .offer(offer)
                .user(user)
                .claimCode(claimCode)
                .isTest(true)
                .expiresAt(LocalDateTime.now().plusDays(1))
                .build();

        claim = offerClaimRepository.save(claim);
        log.info("Created test claim for offer {} with code {}", offerId, claimCode);

        return OfferClaimDto.from(claim);
    }

    @Transactional
    public void resetTestClaim(Long userId, String claimCode) {
        Supplier supplier = supplierRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier profile not found"));

        OfferClaim claim = offerClaimRepository.findByClaimCode(claimCode)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with code: " + claimCode));

        if (!claim.getOffer().getSupplier().getId().equals(supplier.getId())) {
            throw new BadRequestException("Claim does not belong to this supplier");
        }

        if (!claim.isTest()) {
            throw new BadRequestException("Cannot reset non-test claims");
        }

        // Reset the test claim by deleting it
        offerClaimRepository.delete(claim);
        log.info("Reset (deleted) test claim {} by supplier {}", claimCode, supplier.getId());
    }

    @Transactional
    public OfferClaimDto redeemClaim(Long userId, String claimCode) {
        Supplier supplier = supplierRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier profile not found"));

        OfferClaim claim = offerClaimRepository.findByClaimCode(claimCode)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with code: " + claimCode));

        if (!claim.getOffer().getSupplier().getId().equals(supplier.getId())) {
            throw new BadRequestException("Claim does not belong to this supplier");
        }

        if (claim.getStatus() == OfferClaim.ClaimStatus.REDEEMED) {
            throw new BadRequestException("Claim has already been redeemed");
        }

        if (claim.getStatus() == OfferClaim.ClaimStatus.EXPIRED || !claim.isValid()) {
            throw new BadRequestException("Claim has expired");
        }

        if (claim.getStatus() == OfferClaim.ClaimStatus.CANCELLED) {
            throw new BadRequestException("Claim has been cancelled");
        }

        claim.setStatus(OfferClaim.ClaimStatus.REDEEMED);
        claim.setRedeemedAt(LocalDateTime.now());
        claim = offerClaimRepository.save(claim);

        log.info("Redeemed claim {} by supplier {}", claimCode, supplier.getId());

        eventPublisher.publishEvent(new OfferEvent(this, claim.getId(), OfferEvent.Type.REDEEMED));

        return OfferClaimDto.from(claim);
    }

    @Transactional(readOnly = true)
    public OfferClaimDto validateClaim(Long userId, String claimCode) {
        Supplier supplier = supplierRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier profile not found"));

        OfferClaim claim = offerClaimRepository.findByClaimCode(claimCode)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with code: " + claimCode));

        if (!claim.getOffer().getSupplier().getId().equals(supplier.getId())) {
            throw new BadRequestException("Claim does not belong to this supplier");
        }

        return OfferClaimDto.from(claim);
    }

    @Transactional(readOnly = true)
    public List<OfferClaimDto> getUserClaims(Long userId) {
        return offerClaimRepository.findByUserIdAndIsTestFalse(userId).stream()
                .map(OfferClaimDto::from)
                .toList();
    }

    private String generateClaimCode(Offer offer) {
        String prefix = offer.getSupplier().getBusinessName()
                .substring(0, Math.min(2, offer.getSupplier().getBusinessName().length()))
                .toUpperCase()
                .replaceAll("[^A-Z]", "X");
        String year = String.valueOf(LocalDate.now().getYear());
        String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return String.format("%s-%s-%03d-%s", prefix, year, offer.getCurrentClaims() + 1, random);
    }

    private String generateTestClaimCode(Offer offer) {
        String prefix = offer.getSupplier().getBusinessName()
                .substring(0, Math.min(2, offer.getSupplier().getBusinessName().length()))
                .toUpperCase()
                .replaceAll("[^A-Z]", "X");
        String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return String.format("%s-TEST-%s", prefix, random);
    }
}
