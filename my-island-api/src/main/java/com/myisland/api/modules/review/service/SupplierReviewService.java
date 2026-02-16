package com.myisland.api.modules.review.service;

import com.myisland.api.modules.admin.service.FeatureToggleService;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.marketplace.entity.OfferClaim;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.OfferClaimRepository;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.modules.review.dto.*;
import com.myisland.api.modules.review.entity.Review;
import com.myisland.api.modules.review.entity.SupplierReview;
import com.myisland.api.modules.review.repository.SupplierReviewRepository;
import com.myisland.api.shared.exceptions.BadRequestException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SupplierReviewService {

    private final SupplierReviewRepository supplierReviewRepository;
    private final OfferClaimRepository offerClaimRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final FeatureToggleService featureToggleService;

    public SupplierReviewService(SupplierReviewRepository supplierReviewRepository,
                                 OfferClaimRepository offerClaimRepository,
                                 SupplierRepository supplierRepository,
                                 UserRepository userRepository,
                                 FeatureToggleService featureToggleService) {
        this.supplierReviewRepository = supplierReviewRepository;
        this.offerClaimRepository = offerClaimRepository;
        this.supplierRepository = supplierRepository;
        this.userRepository = userRepository;
        this.featureToggleService = featureToggleService;
    }

    @Transactional(readOnly = true)
    public List<SupplierReviewDto> getReviewsBySupplier(Long supplierId) {
        return supplierReviewRepository.findBySupplierIdAndModerationStatusWithDetails(supplierId, Review.ModerationStatus.APPROVED).stream()
                .map(SupplierReviewDto::from)
                .toList();
    }

    @Transactional
    public SupplierReviewDto createReview(Long userId, CreateSupplierReviewRequest request) {
        OfferClaim claim = offerClaimRepository.findByIdWithDetails(request.offerClaimId())
                .orElseThrow(() -> new ResourceNotFoundException("Offer claim not found"));

        if (!claim.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only review your own redeemed offers");
        }

        if (claim.getStatus() != OfferClaim.ClaimStatus.REDEEMED) {
            throw new BadRequestException("You can only review redeemed offers");
        }

        if (supplierReviewRepository.findByOfferClaimId(request.offerClaimId()).isPresent()) {
            throw new BadRequestException("You have already reviewed this offer claim");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Supplier supplier = claim.getOffer().getSupplier();

        SupplierReview review = SupplierReview.builder()
                .user(user)
                .supplier(supplier)
                .offerClaim(claim)
                .rating(request.rating())
                .comment(request.comment())
                .build();

        if (featureToggleService.isReviewModerationEnabled()) {
            review.setModerationStatus(Review.ModerationStatus.PENDING);
        } else {
            review.setModerationStatus(Review.ModerationStatus.APPROVED);
        }

        review = supplierReviewRepository.save(review);

        if (!featureToggleService.isReviewModerationEnabled()) {
            recalculateSupplierRating(supplier);
        }

        return SupplierReviewDto.from(review);
    }

    @Transactional
    public SupplierReviewDto respondToReview(Long userId, Long reviewId, SupplierReviewResponseRequest request) {
        SupplierReview review = supplierReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        Supplier supplier = supplierRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        if (!review.getSupplier().getId().equals(supplier.getId())) {
            throw new BadRequestException("You can only respond to reviews for your own business");
        }

        if (review.getSupplierResponse() != null) {
            throw new BadRequestException("You have already responded to this review");
        }

        review.setSupplierResponse(request.response());
        review.setSupplierResponseAt(LocalDateTime.now());
        review = supplierReviewRepository.save(review);

        return SupplierReviewDto.from(review);
    }

    @Transactional(readOnly = true)
    public SupplierReviewEligibilityDto checkEligibility(Long userId, Long supplierId) {
        List<OfferClaim> redeemedClaims = offerClaimRepository.findBySupplierIdAndIsTestFalse(supplierId).stream()
                .filter(c -> c.getUser().getId().equals(userId))
                .filter(c -> c.getStatus() == OfferClaim.ClaimStatus.REDEEMED)
                .toList();

        List<SupplierReviewEligibilityDto.EligibleClaim> eligibleClaims = redeemedClaims.stream()
                .map(c -> new SupplierReviewEligibilityDto.EligibleClaim(
                        c.getId(),
                        c.getOffer().getTitle(),
                        c.getRedeemedAt(),
                        supplierReviewRepository.findByOfferClaimId(c.getId()).isPresent()
                ))
                .toList();

        boolean canReview = eligibleClaims.stream().anyMatch(ec -> !ec.alreadyReviewed());

        return new SupplierReviewEligibilityDto(canReview, eligibleClaims);
    }

    @Transactional(readOnly = true)
    public List<SupplierReviewDto> getSupplierReviews(Long userId) {
        Supplier supplier = supplierRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        return supplierReviewRepository.findBySupplierIdWithDetails(supplier.getId()).stream()
                .map(SupplierReviewDto::from)
                .toList();
    }

    @Transactional
    public void recalculateSupplierRating(Supplier supplier) {
        BigDecimal avgRating = supplierReviewRepository.calculateAverageRatingByStatus(supplier.getId(), Review.ModerationStatus.APPROVED);
        long count = supplierReviewRepository.countBySupplierIdAndModerationStatus(supplier.getId(), Review.ModerationStatus.APPROVED);

        if (avgRating != null) {
            supplier.setRating(avgRating.setScale(1, RoundingMode.HALF_UP));
        } else {
            supplier.setRating(null);
        }
        supplier.setReviewCount((int) count);
        supplierRepository.save(supplier);
    }
}
