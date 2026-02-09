package com.myisland.api.modules.review.controller;

import com.myisland.api.modules.review.dto.*;
import com.myisland.api.modules.review.service.ReviewService;
import com.myisland.api.modules.review.service.SupplierReviewService;
import com.myisland.api.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@Tag(name = "Reviews", description = "Campsite review endpoints")
public class ReviewController {

    private final ReviewService reviewService;
    private final SupplierReviewService supplierReviewService;

    public ReviewController(ReviewService reviewService, SupplierReviewService supplierReviewService) {
        this.reviewService = reviewService;
        this.supplierReviewService = supplierReviewService;
    }

    @GetMapping("/campsite/{ownerId}")
    @Operation(summary = "Get all reviews for a campsite")
    public ResponseEntity<List<ReviewDto>> getCampsiteReviews(@PathVariable Long ownerId) {
        return ResponseEntity.ok(reviewService.getReviewsByOwner(ownerId));
    }

    @PostMapping
    @Operation(summary = "Submit a review for a booking")
    public ResponseEntity<ReviewDto> createReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(userDetails.getUserId(), request));
    }

    @GetMapping("/eligibility/{ownerId}")
    @Operation(summary = "Check if user can review a campsite")
    public ResponseEntity<ReviewEligibilityDto> checkEligibility(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long ownerId
    ) {
        return ResponseEntity.ok(reviewService.checkEligibility(userDetails.getUserId(), ownerId));
    }

    // --- Supplier Review Endpoints ---

    @GetMapping("/supplier/{supplierId}")
    @Operation(summary = "Get all reviews for a supplier")
    public ResponseEntity<List<SupplierReviewDto>> getSupplierReviews(@PathVariable Long supplierId) {
        return ResponseEntity.ok(supplierReviewService.getReviewsBySupplier(supplierId));
    }

    @PostMapping("/supplier")
    @Operation(summary = "Submit a review for a redeemed offer")
    public ResponseEntity<SupplierReviewDto> createSupplierReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateSupplierReviewRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(supplierReviewService.createReview(userDetails.getUserId(), request));
    }

    @GetMapping("/supplier/eligibility/{supplierId}")
    @Operation(summary = "Check if user can review a supplier")
    public ResponseEntity<SupplierReviewEligibilityDto> checkSupplierEligibility(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long supplierId
    ) {
        return ResponseEntity.ok(supplierReviewService.checkEligibility(userDetails.getUserId(), supplierId));
    }
}
