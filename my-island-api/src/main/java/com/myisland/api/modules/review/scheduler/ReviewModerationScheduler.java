package com.myisland.api.modules.review.scheduler;

import com.myisland.api.modules.review.entity.Review;
import com.myisland.api.modules.review.entity.SupplierReview;
import com.myisland.api.modules.review.repository.ReviewRepository;
import com.myisland.api.modules.review.repository.SupplierReviewRepository;
import com.myisland.api.modules.review.service.ReviewModerationService;
import com.myisland.api.modules.review.service.ReviewService;
import com.myisland.api.modules.review.service.SupplierReviewService;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ReviewModerationScheduler {

    private static final Logger log = LoggerFactory.getLogger(ReviewModerationScheduler.class);

    private final ReviewRepository reviewRepository;
    private final SupplierReviewRepository supplierReviewRepository;
    private final ReviewModerationService moderationService;
    private final ReviewService reviewService;
    private final SupplierReviewService supplierReviewService;

    public ReviewModerationScheduler(ReviewRepository reviewRepository,
                                     SupplierReviewRepository supplierReviewRepository,
                                     ReviewModerationService moderationService,
                                     ReviewService reviewService,
                                     SupplierReviewService supplierReviewService) {
        this.reviewRepository = reviewRepository;
        this.supplierReviewRepository = supplierReviewRepository;
        this.moderationService = moderationService;
        this.reviewService = reviewService;
        this.supplierReviewService = supplierReviewService;
    }

    @Scheduled(fixedRate = 300000) // every 5 minutes
    @SchedulerLock(name = "reviewModeration", lockAtLeastFor = "1m", lockAtMostFor = "10m")
    @Transactional
    public void moderatePendingReviews() {
        List<Review> pendingReviews = reviewRepository.findByModerationStatus(Review.ModerationStatus.PENDING);
        List<SupplierReview> pendingSupplierReviews = supplierReviewRepository.findByModerationStatus(Review.ModerationStatus.PENDING);

        if (pendingReviews.isEmpty() && pendingSupplierReviews.isEmpty()) {
            return;
        }

        int approved = 0;
        int rejected = 0;

        for (Review review : pendingReviews) {
            ReviewModerationService.ModerationResult result = moderationService.moderate(review.getComment(), review.getRating());
            review.setModerationStatus(result.approved() ? Review.ModerationStatus.APPROVED : Review.ModerationStatus.REJECTED);
            review.setModerationReason(result.reason());
            review.setModeratedAt(LocalDateTime.now());
            reviewRepository.save(review);

            if (result.approved()) {
                approved++;
                reviewService.recalculateOwnerRating(review.getOwner());
            } else {
                rejected++;
            }
        }

        for (SupplierReview review : pendingSupplierReviews) {
            ReviewModerationService.ModerationResult result = moderationService.moderate(review.getComment(), review.getRating());
            review.setModerationStatus(result.approved() ? Review.ModerationStatus.APPROVED : Review.ModerationStatus.REJECTED);
            review.setModerationReason(result.reason());
            review.setModeratedAt(LocalDateTime.now());
            supplierReviewRepository.save(review);

            if (result.approved()) {
                approved++;
                supplierReviewService.recalculateSupplierRating(review.getSupplier());
            } else {
                rejected++;
            }
        }

        log.info("Moderated {} reviews: {} approved, {} rejected",
                pendingReviews.size() + pendingSupplierReviews.size(), approved, rejected);
    }
}
