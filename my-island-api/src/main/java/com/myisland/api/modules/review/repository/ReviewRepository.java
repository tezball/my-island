package com.myisland.api.modules.review.repository;

import com.myisland.api.modules.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    Optional<Review> findByBookingId(Long bookingId);

    List<Review> findByModerationStatus(Review.ModerationStatus status);

    @Query("""
            SELECT r FROM Review r
            JOIN FETCH r.user
            JOIN FETCH r.booking b
            JOIN FETCH b.lot
            WHERE r.owner.id = :ownerId
            AND r.moderationStatus = :status
            ORDER BY r.createdAt DESC
            """)
    List<Review> findByOwnerIdAndModerationStatusWithDetails(@Param("ownerId") Long ownerId, @Param("status") Review.ModerationStatus status);

    @Query("""
            SELECT r FROM Review r
            JOIN FETCH r.user
            JOIN FETCH r.booking b
            JOIN FETCH b.lot
            WHERE r.owner.id = :ownerId
            ORDER BY r.createdAt DESC
            """)
    List<Review> findByOwnerIdWithDetails(Long ownerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.owner.id = :ownerId AND r.moderationStatus = :status")
    BigDecimal calculateAverageRatingByStatus(@Param("ownerId") Long ownerId, @Param("status") Review.ModerationStatus status);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.owner.id = :ownerId AND r.moderationStatus = :status")
    long countByOwnerIdAndModerationStatus(@Param("ownerId") Long ownerId, @Param("status") Review.ModerationStatus status);

    long countByOwnerId(Long ownerId);
}
