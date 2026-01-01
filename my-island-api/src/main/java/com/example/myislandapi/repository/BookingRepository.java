package com.example.myislandapi.repository;

import com.example.myislandapi.entity.Booking;
import com.example.myislandapi.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Page<Booking> findByUserId(UUID userId, Pageable pageable);

    Page<Booking> findByUserIdAndStatus(UUID userId, BookingStatus status, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.lot.campsite.owner.id = :ownerId")
    Page<Booking> findByOwnerId(@Param("ownerId") UUID ownerId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.lot.campsite.owner.id = :ownerId AND b.status = :status")
    Page<Booking> findByOwnerIdAndStatus(@Param("ownerId") UUID ownerId,
                                          @Param("status") BookingStatus status,
                                          Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.lot.id = :lotId AND b.status NOT IN ('CANCELLED') " +
           "AND ((b.checkIn <= :checkOut AND b.checkOut >= :checkIn))")
    List<Booking> findConflictingBookings(@Param("lotId") UUID lotId,
                                          @Param("checkIn") LocalDate checkIn,
                                          @Param("checkOut") LocalDate checkOut);

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.status = 'CONFIRMED' " +
           "AND b.checkIn <= CURRENT_DATE AND b.checkOut >= CURRENT_DATE")
    List<Booking> findActiveBookingsForUser(@Param("userId") UUID userId);

    @Query("SELECT b FROM Booking b WHERE b.lot.campsite.id = :campsiteId")
    Page<Booking> findByCampsiteId(@Param("campsiteId") UUID campsiteId, Pageable pageable);

    List<Booking> findByLotId(UUID lotId);

    @Query("SELECT b FROM Booking b WHERE b.checkIn = :date AND b.status = 'CONFIRMED'")
    List<Booking> findBookingsCheckingInOn(@Param("date") LocalDate date);

    @Query("SELECT b FROM Booking b WHERE b.checkOut = :date AND b.status = 'CONFIRMED'")
    List<Booking> findBookingsCheckingOutOn(@Param("date") LocalDate date);
}
