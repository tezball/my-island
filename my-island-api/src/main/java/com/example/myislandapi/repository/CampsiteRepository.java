package com.example.myislandapi.repository;

import com.example.myislandapi.entity.Campsite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
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
    @Query("SELECT c FROM Campsite c WHERE c.active = true AND " +
           "(:county IS NULL OR c.location.county = :county) AND " +
           "(:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Campsite> search(@Param("county") String county, @Param("search") String search, Pageable pageable);

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
