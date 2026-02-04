package com.myisland.api.modules.accommodation.repository;

import com.myisland.api.modules.accommodation.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {

    Optional<Owner> findByUserId(Long userId);

    @Query("SELECT o FROM Owner o WHERE o.county = :county")
    List<Owner> findByCounty(String county);

    @Query("SELECT o FROM Owner o WHERE o.propertyType = :propertyType")
    List<Owner> findByPropertyType(Owner.PropertyType propertyType);

    @Query("SELECT DISTINCT o.county FROM Owner o ORDER BY o.county")
    List<String> findAllCounties();

    Optional<Owner> findByStripeCustomerId(String stripeCustomerId);

    Optional<Owner> findByStripeConnectAccountId(String stripeConnectAccountId);

    @Query("SELECT o FROM Owner o WHERE o.isFeatured = true AND o.featuredUntil > CURRENT_TIMESTAMP ORDER BY o.featuredUntil DESC")
    List<Owner> findFeaturedOwners();

    @Modifying
    @Query("UPDATE Owner o SET o.isFeatured = false WHERE o.isFeatured = true AND o.featuredUntil < :now")
    int expireFeaturedListings(@Param("now") LocalDateTime now);
}
