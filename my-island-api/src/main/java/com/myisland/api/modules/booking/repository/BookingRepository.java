package com.myisland.api.modules.booking.repository;

import com.myisland.api.modules.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByUserIdOrderByCheckInDateDesc(Long userId);

    List<Booking> findByLotId(Long lotId);

    @Query("SELECT b FROM Booking b WHERE b.lot.id = :lotId AND b.checkOutDate > :date AND b.status != 'CANCELLED'")
    List<Booking> findByLotIdAndCheckOutDateAfter(Long lotId, LocalDate date);

    @Query("""
            SELECT b FROM Booking b
            WHERE b.lot.owner.id = :ownerId
            AND b.checkInDate >= :startDate
            AND b.checkInDate <= :endDate
            ORDER BY b.checkInDate ASC
            """)
    List<Booking> findByOwnerIdAndDateRange(Long ownerId, LocalDate startDate, LocalDate endDate);

    @Query("""
            SELECT b FROM Booking b
            WHERE b.lot.id = :lotId
            AND b.status != 'CANCELLED'
            AND b.checkInDate < :checkOut
            AND b.checkOutDate > :checkIn
            """)
    List<Booking> findOverlappingBookings(Long lotId, LocalDate checkIn, LocalDate checkOut);

    @Query("""
            SELECT b FROM Booking b
            WHERE b.lot.owner.id = :ownerId
            ORDER BY b.createdAt DESC
            """)
    List<Booking> findByOwnerId(Long ownerId);

    @Query("SELECT b FROM Booking b WHERE b.status = :status ORDER BY b.checkInDate ASC")
    List<Booking> findByStatus(Booking.BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.lot.owner.id = :ownerId AND b.status = :status")
    long countByOwnerIdAndStatus(Long ownerId, Booking.BookingStatus status);
}
