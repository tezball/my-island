package com.myisland.api.modules.marketplace.repository;

import com.myisland.api.modules.marketplace.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    Optional<Supplier> findByUserId(Long userId);

    List<Supplier> findByCategory(Supplier.SupplierCategory category);

    List<Supplier> findByCounty(String county);

    List<Supplier> findByIsVerifiedTrue();

    Optional<Supplier> findByStripeCustomerId(String stripeCustomerId);

    Optional<Supplier> findByStripeConnectAccountId(String stripeConnectAccountId);

    @Query("SELECT s FROM Supplier s WHERE s.isFeatured = true AND s.featuredUntil > CURRENT_TIMESTAMP ORDER BY s.featuredUntil DESC")
    List<Supplier> findFeaturedSuppliers();

    @Modifying
    @Query("UPDATE Supplier s SET s.isFeatured = false WHERE s.isFeatured = true AND s.featuredUntil < :now")
    int expireFeaturedListings(@Param("now") LocalDateTime now);

    List<Supplier> findBySubscriptionStatusAndTrialEndsAtBefore(Supplier.SubscriptionStatus status, Instant now);
}
