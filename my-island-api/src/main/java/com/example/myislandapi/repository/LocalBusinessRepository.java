package com.example.myislandapi.repository;

import com.example.myislandapi.entity.LocalBusiness;
import com.example.myislandapi.enums.SupplierCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LocalBusinessRepository extends JpaRepository<LocalBusiness, UUID> {

    Page<LocalBusiness> findByActiveTrue(Pageable pageable);

    Page<LocalBusiness> findByActiveTrueAndCategory(SupplierCategory category, Pageable pageable);

    Page<LocalBusiness> findByActiveTrueAndFeaturedTrue(Pageable pageable);

    @Query("SELECT b FROM LocalBusiness b WHERE b.active = true AND b.location.county = :county")
    Page<LocalBusiness> findByCounty(@Param("county") String county, Pageable pageable);

    @Query("SELECT b FROM LocalBusiness b WHERE b.active = true " +
           "AND b.location.lat BETWEEN :minLat AND :maxLat " +
           "AND b.location.lng BETWEEN :minLng AND :maxLng")
    List<LocalBusiness> findWithinBounds(@Param("minLat") double minLat,
                                          @Param("maxLat") double maxLat,
                                          @Param("minLng") double minLng,
                                          @Param("maxLng") double maxLng);

    @Query("SELECT b FROM LocalBusiness b WHERE b.active = true " +
           "AND b.category = :category " +
           "AND b.location.lat BETWEEN :minLat AND :maxLat " +
           "AND b.location.lng BETWEEN :minLng AND :maxLng")
    List<LocalBusiness> findWithinBoundsAndCategory(@Param("category") SupplierCategory category,
                                                     @Param("minLat") double minLat,
                                                     @Param("maxLat") double maxLat,
                                                     @Param("minLng") double minLng,
                                                     @Param("maxLng") double maxLng);

    @Query("SELECT DISTINCT b.location.county FROM LocalBusiness b WHERE b.active = true ORDER BY b.location.county")
    List<String> findDistinctCounties();

    @Query("SELECT b FROM LocalBusiness b WHERE b.active = true " +
           "AND (LOWER(b.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(b.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<LocalBusiness> searchByNameOrDescription(@Param("search") String search, Pageable pageable);
}
