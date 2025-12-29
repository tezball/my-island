package com.myisland.api.repository;

import com.myisland.api.entity.Campsite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface CampsiteRepository extends JpaRepository<Campsite, UUID> {

    @Query("SELECT c FROM Campsite c WHERE " +
           "(:query IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.location) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:type IS NULL OR c.type = :type) " +
           "AND (:minPrice IS NULL OR c.pricePerNight >= :minPrice) " +
           "AND (:maxPrice IS NULL OR c.pricePerNight <= :maxPrice)")
    List<Campsite> searchCampsites(
        @Param("query") String query,
        @Param("type") Campsite.CampsiteType type,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice
    );

    @Query("SELECT c FROM Campsite c JOIN c.lots l WHERE l.id = :lotId")
    Campsite findByLotId(@Param("lotId") UUID lotId);
}
