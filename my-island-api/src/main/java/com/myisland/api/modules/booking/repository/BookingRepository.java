package com.myisland.api.modules.booking.repository;

import com.myisland.api.modules.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByUserIdOrderByCheckInDateDesc(Long userId);

    List<Booking> findByLotId(Long lotId);

    @Query("SELECT b FROM Booking b WHERE b.lot.id = :lotId AND b.checkOutDate > :date AND b.status NOT IN ('CANCELLED', 'PENDING_PAYMENT', 'PAYMENT_FAILED')")
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
            AND b.status NOT IN ('CANCELLED', 'PENDING_PAYMENT', 'PAYMENT_FAILED')
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

    @Query("""
            SELECT b FROM Booking b
            LEFT JOIN FETCH b.user
            JOIN FETCH b.lot l
            JOIN FETCH l.owner
            WHERE l.owner.id = :ownerId
            AND b.checkInDate = :date
            AND b.status IN ('CONFIRMED', 'PENDING')
            ORDER BY l.name ASC
            """)
    List<Booking> findTodayArrivals(Long ownerId, LocalDate date);

    @Query("""
            SELECT b FROM Booking b
            LEFT JOIN FETCH b.user
            JOIN FETCH b.lot l
            JOIN FETCH l.owner
            WHERE l.owner.id = :ownerId
            AND b.checkOutDate = :date
            AND b.status = 'CHECKED_IN'
            ORDER BY l.name ASC
            """)
    List<Booking> findTodayDepartures(Long ownerId, LocalDate date);

    Optional<Booking> findByStripePaymentIntentId(String stripePaymentIntentId);

    @Query("""
            SELECT COUNT(b) FROM Booking b
            WHERE b.lot.owner.id = :ownerId
            AND b.createdAt >= :start AND b.createdAt < :end
            AND b.status NOT IN ('PAYMENT_FAILED', 'CANCELLED')
            """)
    long countNewBookingsByOwnerIdBetween(Long ownerId, LocalDateTime start, LocalDateTime end);

    @Query("""
            SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b
            WHERE b.lot.owner.id = :ownerId
            AND b.createdAt >= :start AND b.createdAt < :end
            AND b.status NOT IN ('PAYMENT_FAILED', 'CANCELLED')
            """)
    BigDecimal sumRevenueByOwnerIdBetween(Long ownerId, LocalDateTime start, LocalDateTime end);

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.user
            JOIN FETCH b.lot l
            JOIN FETCH l.owner
            WHERE b.id = :id
            """)
    Optional<Booking> findByIdWithDetails(Long id);
}
