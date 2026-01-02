package com.example.myislandapi.repository;

import com.example.myislandapi.entity.Campsite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.myislandapi.enums.Facility;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface CampsiteRepository extends JpaRepository<Campsite, UUID> {

    @EntityGraph(attributePaths = {"images", "facilities", "owner"})
    Page<Campsite> findByActiveTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"images", "facilities", "owner"})
    Page<Campsite> findByActiveTrueAndFeaturedTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"images", "facilities", "lots", "owner"})
    Optional<Campsite> findById(UUID id);

    @EntityGraph(attributePaths = {"images", "facilities", "owner"})
    @Query("SELECT c FROM Campsite c WHERE c.active = true AND c.location.county = :county")
    Page<Campsite> findByCounty(@Param("county") String county, Pageable pageable);

    @EntityGraph(attributePaths = {"images", "facilities", "owner"})
    @Query("SELECT DISTINCT c FROM Campsite c LEFT JOIN c.facilities f WHERE c.active = true AND " +
           "(:county IS NULL OR c.location.county = :county) AND " +
           "(:search IS NULL OR " +
           "LOWER(c.name) LIKE %:search% OR " +
           "LOWER(c.location.county) LIKE %:search% OR " +
           "LOWER(c.location.address) LIKE %:search% OR " +
           "LOWER(c.description) LIKE %:search%) AND " +
           "(:facilities IS NULL OR f IN :facilities) " +
           "GROUP BY c.id " +
           "HAVING (:facilities IS NULL OR COUNT(DISTINCT f) >= :facilityCount)")
    Page<Campsite> search(@Param("county") String county,
                          @Param("search") String search,
                          @Param("facilities") Set<Facility> facilities,
                          @Param("facilityCount") long facilityCount,
                          Pageable pageable);

    @EntityGraph(attributePaths = {"images", "facilities", "owner"})
    List<Campsite> findByOwnerId(UUID ownerId);

    @EntityGraph(attributePaths = {"images", "facilities", "owner"})
    @Query("SELECT c FROM Campsite c WHERE c.active = true AND " +
           "c.location.lat BETWEEN :minLat AND :maxLat AND " +
           "c.location.lng BETWEEN :minLng AND :maxLng")
    List<Campsite> findInBoundingBox(
            @Param("minLat") double minLat,
            @Param("maxLat") double maxLat,
            @Param("minLng") double minLng,
            @Param("maxLng") double maxLng);
}
