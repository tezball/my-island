package com.myisland.api.repository;

import com.myisland.api.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByUserId(UUID userId);

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId " +
           "AND b.status IN ('CONFIRMED', 'PENDING')")
    List<Booking> findUpcomingByUserId(@Param("userId") UUID userId);

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId " +
           "AND b.status IN ('COMPLETED', 'CANCELLED')")
    List<Booking> findPastByUserId(@Param("userId") UUID userId);

    Optional<Booking> findByReference(String reference);

    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(b.reference, 10) AS integer)), 0) FROM Booking b " +
           "WHERE b.reference LIKE :prefix%")
    Integer findMaxReferenceNumber(@Param("prefix") String prefix);
}
