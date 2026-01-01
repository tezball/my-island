package com.example.myislandapi.repository;

import com.example.myislandapi.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    Page<Review> findByCampsiteId(UUID campsiteId, Pageable pageable);

    Page<Review> findByUserId(UUID userId, Pageable pageable);

    Optional<Review> findByBookingId(UUID bookingId);

    boolean existsByBookingId(UUID bookingId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.campsite.id = :campsiteId")
    Double getAverageRatingForCampsite(@Param("campsiteId") UUID campsiteId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.campsite.id = :campsiteId")
    int countByCampsiteId(@Param("campsiteId") UUID campsiteId);

    @Query("SELECT r FROM Review r WHERE r.campsite.owner.id = :ownerId")
    Page<Review> findByOwnerId(@Param("ownerId") UUID ownerId, Pageable pageable);
}
