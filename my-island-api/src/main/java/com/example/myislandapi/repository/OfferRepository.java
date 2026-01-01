package com.example.myislandapi.repository;

import com.example.myislandapi.entity.Offer;
import com.example.myislandapi.enums.OfferCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OfferRepository extends JpaRepository<Offer, UUID> {

    Page<Offer> findByActiveTrue(Pageable pageable);

    Page<Offer> findByActiveTrueAndCategory(OfferCategory category, Pageable pageable);

    Page<Offer> findByActiveTrueAndFeaturedTrue(Pageable pageable);

    @Query("SELECT o FROM Offer o WHERE o.active = true " +
           "AND o.lat BETWEEN :minLat AND :maxLat " +
           "AND o.lng BETWEEN :minLng AND :maxLng")
    List<Offer> findNearLocation(@Param("minLat") double minLat,
                                  @Param("maxLat") double maxLat,
                                  @Param("minLng") double minLng,
                                  @Param("maxLng") double maxLng);

    List<Offer> findByCampsiteId(UUID campsiteId);
}
