package com.myisland.api.modules.review.repository;

import com.myisland.api.modules.review.entity.Review;
import com.myisland.api.modules.review.entity.SupplierReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierReviewRepository extends JpaRepository<SupplierReview, Long> {

    List<SupplierReview> findBySupplierIdOrderByCreatedAtDesc(Long supplierId);

    Optional<SupplierReview> findByOfferClaimId(Long offerClaimId);

    List<SupplierReview> findByModerationStatus(Review.ModerationStatus status);

    @Query("""
            SELECT r FROM SupplierReview r
            JOIN FETCH r.user
            JOIN FETCH r.offerClaim oc
            JOIN FETCH oc.offer
            WHERE r.supplier.id = :supplierId
            AND r.moderationStatus = :status
            ORDER BY r.createdAt DESC
            """)
    List<SupplierReview> findBySupplierIdAndModerationStatusWithDetails(@Param("supplierId") Long supplierId, @Param("status") Review.ModerationStatus status);

    @Query("""
            SELECT r FROM SupplierReview r
            JOIN FETCH r.user
            JOIN FETCH r.offerClaim oc
            JOIN FETCH oc.offer
            WHERE r.supplier.id = :supplierId
            ORDER BY r.createdAt DESC
            """)
    List<SupplierReview> findBySupplierIdWithDetails(Long supplierId);

    @Query("SELECT AVG(r.rating) FROM SupplierReview r WHERE r.supplier.id = :supplierId AND r.moderationStatus = :status")
    BigDecimal calculateAverageRatingByStatus(@Param("supplierId") Long supplierId, @Param("status") Review.ModerationStatus status);

    @Query("SELECT COUNT(r) FROM SupplierReview r WHERE r.supplier.id = :supplierId AND r.moderationStatus = :status")
    long countBySupplierIdAndModerationStatus(@Param("supplierId") Long supplierId, @Param("status") Review.ModerationStatus status);

    long countBySupplierId(Long supplierId);
}
