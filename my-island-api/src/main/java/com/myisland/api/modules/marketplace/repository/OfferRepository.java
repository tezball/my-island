package com.myisland.api.modules.marketplace.repository;

import com.myisland.api.modules.marketplace.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    List<Offer> findBySupplierId(Long supplierId);

    List<Offer> findBySupplierIdAndIsActiveTrue(Long supplierId);

    @Query("""
            SELECT o FROM Offer o
            WHERE o.isActive = true
            AND o.validFrom <= :today
            AND o.validUntil >= :today
            AND (o.maxClaims IS NULL OR o.currentClaims < o.maxClaims)
            """)
    List<Offer> findAvailableOffers(LocalDate today);

    @Query("""
            SELECT o FROM Offer o
            WHERE o.supplier.id = :supplierId
            AND o.isActive = true
            AND o.validFrom <= :today
            AND o.validUntil >= :today
            """)
    List<Offer> findActiveOffersBySupplierId(Long supplierId, LocalDate today);
}
