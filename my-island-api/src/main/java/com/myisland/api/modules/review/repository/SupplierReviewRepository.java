package com.myisland.api.modules.review.repository;

import com.myisland.api.modules.review.entity.SupplierReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierReviewRepository extends JpaRepository<SupplierReview, Long> {

    List<SupplierReview> findBySupplierIdOrderByCreatedAtDesc(Long supplierId);

    Optional<SupplierReview> findByOfferClaimId(Long offerClaimId);

    @Query("""
            SELECT r FROM SupplierReview r
            JOIN FETCH r.user
            JOIN FETCH r.offerClaim oc
            JOIN FETCH oc.offer
            WHERE r.supplier.id = :supplierId
            ORDER BY r.createdAt DESC
            """)
    List<SupplierReview> findBySupplierIdWithDetails(Long supplierId);

    @Query("SELECT AVG(r.rating) FROM SupplierReview r WHERE r.supplier.id = :supplierId")
    BigDecimal calculateAverageRating(Long supplierId);

    long countBySupplierId(Long supplierId);
}
