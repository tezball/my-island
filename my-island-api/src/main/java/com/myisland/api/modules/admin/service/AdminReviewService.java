package com.myisland.api.modules.admin.service;

import com.myisland.api.modules.review.entity.Review;
import com.myisland.api.modules.review.entity.SupplierReview;
import com.myisland.api.modules.review.repository.ReviewRepository;
import com.myisland.api.modules.review.repository.SupplierReviewRepository;
import com.myisland.api.modules.review.service.ReviewModerationService;
import com.myisland.api.modules.review.service.ReviewService;
import com.myisland.api.modules.review.service.SupplierReviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AdminReviewService {

    private final ReviewRepository reviewRepository;
    private final SupplierReviewRepository supplierReviewRepository;
    private final AdminAuditService adminAuditService;
    private final ReviewService reviewService;
    private final SupplierReviewService supplierReviewService;
    private final ReviewModerationService reviewModerationService;

    public AdminReviewService(
            ReviewRepository reviewRepository,
            SupplierReviewRepository supplierReviewRepository,
            AdminAuditService adminAuditService,
            ReviewService reviewService,
            SupplierReviewService supplierReviewService,
            ReviewModerationService reviewModerationService) {
        this.reviewRepository = reviewRepository;
        this.supplierReviewRepository = supplierReviewRepository;
        this.adminAuditService = adminAuditService;
        this.reviewService = reviewService;
        this.supplierReviewService = supplierReviewService;
        this.reviewModerationService = reviewModerationService;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listReviews(int page, int size) {
        List<Map<String, Object>> allReviews = new ArrayList<>();

        // Add owner reviews
        reviewRepository.findAll().forEach(review -> {
            Map<String, Object> reviewData = new HashMap<>();
            reviewData.put("type", "OWNER");
            reviewData.put("id", review.getId());
            reviewData.put("userId", review.getUser().getId());
            reviewData.put("userName", review.getUser().getName());
            reviewData.put("ownerId", review.getOwner().getId());
            reviewData.put("ownerName", review.getOwner().getPropertyName());
            reviewData.put("rating", review.getRating());
            reviewData.put("comment", review.getComment());
            reviewData.put("ownerResponse", review.getOwnerResponse());
            reviewData.put("isFlagged", review.isFlagged());
            reviewData.put("moderationStatus", review.getModerationStatus().name());
            reviewData.put("moderationReason", review.getModerationReason());
            reviewData.put("createdAt", review.getCreatedAt());
            allReviews.add(reviewData);
        });

        // Add supplier reviews
        supplierReviewRepository.findAll().forEach(review -> {
            Map<String, Object> reviewData = new HashMap<>();
            reviewData.put("type", "SUPPLIER");
            reviewData.put("id", review.getId());
            reviewData.put("userId", review.getUser().getId());
            reviewData.put("userName", review.getUser().getName());
            reviewData.put("supplierId", review.getSupplier().getId());
            reviewData.put("supplierName", review.getSupplier().getBusinessName());
            reviewData.put("rating", review.getRating());
            reviewData.put("comment", review.getComment());
            reviewData.put("supplierResponse", review.getSupplierResponse());
            reviewData.put("isFlagged", review.isFlagged());
            reviewData.put("moderationStatus", review.getModerationStatus().name());
            reviewData.put("moderationReason", review.getModerationReason());
            reviewData.put("createdAt", review.getCreatedAt());
            allReviews.add(reviewData);
        });

        // Sort by createdAt desc
        allReviews.sort((a, b) -> {
            @SuppressWarnings("unchecked")
            Comparable<Object> dateA = (Comparable<Object>) a.get("createdAt");
            @SuppressWarnings("unchecked")
            Comparable<Object> dateB = (Comparable<Object>) b.get("createdAt");
            return dateB.compareTo(dateA);
        });

        // Paginate
        int start = page * size;
        int end = Math.min(start + size, allReviews.size());
        return allReviews.subList(start, end);
    }

    @Transactional
    public void flagReview(Long adminUserId, String type, Long reviewId) {
        if ("OWNER".equals(type)) {
            Review review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

            boolean previousFlagged = review.isFlagged();
            review.setFlagged(!previousFlagged);
            reviewRepository.save(review);

            adminAuditService.log(
                    adminUserId,
                    "FLAG_REVIEW",
                    "OWNER_REVIEW",
                    reviewId,
                    "Toggled flag status for owner review",
                    "{\"isFlagged\":" + previousFlagged + "}",
                    "{\"isFlagged\":" + !previousFlagged + "}"
            );
        } else {
            SupplierReview review = supplierReviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Supplier review not found with id: " + reviewId));

            boolean previousFlagged = review.isFlagged();
            review.setFlagged(!previousFlagged);
            supplierReviewRepository.save(review);

            adminAuditService.log(
                    adminUserId,
                    "FLAG_REVIEW",
                    "SUPPLIER_REVIEW",
                    reviewId,
                    "Toggled flag status for supplier review",
                    "{\"isFlagged\":" + previousFlagged + "}",
                    "{\"isFlagged\":" + !previousFlagged + "}"
            );
        }
    }

    @Transactional
    public void moderateReview(Long adminUserId, String type, Long reviewId, String status, String reason) {
        Review.ModerationStatus moderationStatus = Review.ModerationStatus.valueOf(status);

        if ("OWNER".equals(type)) {
            Review review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

            String previousStatus = review.getModerationStatus().name();
            review.setModerationStatus(moderationStatus);
            review.setModerationReason(reason);
            review.setModeratedAt(LocalDateTime.now());
            reviewRepository.save(review);

            if (moderationStatus == Review.ModerationStatus.APPROVED) {
                reviewService.recalculateOwnerRating(review.getOwner());
            }

            adminAuditService.log(
                    adminUserId,
                    "MODERATE_REVIEW",
                    "OWNER_REVIEW",
                    reviewId,
                    "Manually moderated owner review: " + status,
                    "{\"moderationStatus\":\"" + previousStatus + "\"}",
                    "{\"moderationStatus\":\"" + status + "\"}"
            );
        } else {
            SupplierReview review = supplierReviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Supplier review not found with id: " + reviewId));

            String previousStatus = review.getModerationStatus().name();
            review.setModerationStatus(moderationStatus);
            review.setModerationReason(reason);
            review.setModeratedAt(LocalDateTime.now());
            supplierReviewRepository.save(review);

            if (moderationStatus == Review.ModerationStatus.APPROVED) {
                supplierReviewService.recalculateSupplierRating(review.getSupplier());
            }

            adminAuditService.log(
                    adminUserId,
                    "MODERATE_REVIEW",
                    "SUPPLIER_REVIEW",
                    reviewId,
                    "Manually moderated supplier review: " + status,
                    "{\"moderationStatus\":\"" + previousStatus + "\"}",
                    "{\"moderationStatus\":\"" + status + "\"}"
            );
        }
    }

    @Transactional
    public Map<String, String> aiModerateReview(Long adminUserId, String type, Long reviewId) {
        if ("OWNER".equals(type)) {
            Review review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

            String previousStatus = review.getModerationStatus().name();
            ReviewModerationService.ModerationResult result = reviewModerationService.moderate(review.getComment(), review.getRating());

            Review.ModerationStatus newStatus = result.approved() ? Review.ModerationStatus.APPROVED : Review.ModerationStatus.REJECTED;
            review.setModerationStatus(newStatus);
            review.setModerationReason(result.reason());
            review.setModeratedAt(LocalDateTime.now());
            reviewRepository.save(review);

            if (newStatus == Review.ModerationStatus.APPROVED) {
                reviewService.recalculateOwnerRating(review.getOwner());
            }

            adminAuditService.log(
                    adminUserId,
                    "AI_MODERATE_REVIEW",
                    "OWNER_REVIEW",
                    reviewId,
                    "AI moderated owner review: " + newStatus,
                    "{\"moderationStatus\":\"" + previousStatus + "\"}",
                    "{\"moderationStatus\":\"" + newStatus + "\"}"
            );

            return Map.of("status", newStatus.name(), "reason", result.reason());
        } else {
            SupplierReview review = supplierReviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Supplier review not found with id: " + reviewId));

            String previousStatus = review.getModerationStatus().name();
            ReviewModerationService.ModerationResult result = reviewModerationService.moderate(review.getComment(), review.getRating());

            Review.ModerationStatus newStatus = result.approved() ? Review.ModerationStatus.APPROVED : Review.ModerationStatus.REJECTED;
            review.setModerationStatus(newStatus);
            review.setModerationReason(result.reason());
            review.setModeratedAt(LocalDateTime.now());
            supplierReviewRepository.save(review);

            if (newStatus == Review.ModerationStatus.APPROVED) {
                supplierReviewService.recalculateSupplierRating(review.getSupplier());
            }

            adminAuditService.log(
                    adminUserId,
                    "AI_MODERATE_REVIEW",
                    "SUPPLIER_REVIEW",
                    reviewId,
                    "AI moderated supplier review: " + newStatus,
                    "{\"moderationStatus\":\"" + previousStatus + "\"}",
                    "{\"moderationStatus\":\"" + newStatus + "\"}"
            );

            return Map.of("status", newStatus.name(), "reason", result.reason());
        }
    }

    @Transactional
    public void deleteReview(Long adminUserId, String type, Long reviewId) {
        if ("OWNER".equals(type)) {
            Review review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

            reviewRepository.delete(review);

            adminAuditService.log(
                    adminUserId,
                    "DELETE_REVIEW",
                    "OWNER_REVIEW",
                    reviewId,
                    "Deleted owner review",
                    "{\"review_id\":" + reviewId + "}",
                    null
            );
        } else {
            SupplierReview review = supplierReviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Supplier review not found with id: " + reviewId));

            supplierReviewRepository.delete(review);

            adminAuditService.log(
                    adminUserId,
                    "DELETE_REVIEW",
                    "SUPPLIER_REVIEW",
                    reviewId,
                    "Deleted supplier review",
                    "{\"review_id\":" + reviewId + "}",
                    null
            );
        }
    }
}
