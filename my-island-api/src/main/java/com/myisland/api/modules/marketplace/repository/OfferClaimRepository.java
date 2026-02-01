package com.myisland.api.modules.marketplace.repository;

import com.myisland.api.modules.marketplace.entity.OfferClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfferClaimRepository extends JpaRepository<OfferClaim, Long> {

    Optional<OfferClaim> findByClaimCode(String claimCode);

    List<OfferClaim> findByUserId(Long userId);

    List<OfferClaim> findByUserIdAndIsTestFalse(Long userId);

    List<OfferClaim> findByOfferId(Long offerId);

    @Query("SELECT c FROM OfferClaim c WHERE c.offer.supplier.id = :supplierId ORDER BY c.claimedAt DESC")
    List<OfferClaim> findBySupplierIdOrderByClaimedAtDesc(Long supplierId);

    @Query("SELECT c FROM OfferClaim c WHERE c.offer.supplier.id = :supplierId AND c.isTest = false")
    List<OfferClaim> findBySupplierIdAndIsTestFalse(Long supplierId);

    @Query("SELECT c FROM OfferClaim c WHERE c.offer.supplier.id = :supplierId AND c.isTest = true")
    List<OfferClaim> findBySupplierIdAndIsTestTrue(Long supplierId);

    @Query("SELECT COUNT(c) FROM OfferClaim c WHERE c.offer.supplier.id = :supplierId AND c.status = :status AND c.isTest = false")
    long countBySupplierIdAndStatus(Long supplierId, OfferClaim.ClaimStatus status);

    boolean existsByOfferIdAndUserIdAndIsTestFalse(Long offerId, Long userId);
}
