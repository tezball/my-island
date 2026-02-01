package com.myisland.api.modules.accommodation.repository;

import com.myisland.api.modules.accommodation.entity.Lot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LotRepository extends JpaRepository<Lot, Long> {

    List<Lot> findByOwnerId(Long ownerId);

    List<Lot> findByOwnerIdAndIsActiveTrue(Long ownerId);

    @Query("SELECT l FROM Lot l WHERE l.isActive = true AND l.pricePerNight BETWEEN :minPrice AND :maxPrice")
    List<Lot> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);

    @Query("SELECT l FROM Lot l WHERE l.isActive = true AND l.lotType = :lotType")
    List<Lot> findByLotType(Lot.LotType lotType);

    @Query("""
            SELECT l FROM Lot l
            WHERE l.isActive = true
            AND l.id NOT IN (
                SELECT b.lot.id FROM Booking b
                WHERE b.status != 'CANCELLED'
                AND b.checkInDate < :checkOut
                AND b.checkOutDate > :checkIn
            )
            """)
    List<Lot> findAvailableLots(LocalDate checkIn, LocalDate checkOut);

    @Query("""
            SELECT l FROM Lot l
            WHERE l.owner.id = :ownerId
            AND l.isActive = true
            AND l.id NOT IN (
                SELECT b.lot.id FROM Booking b
                WHERE b.status != 'CANCELLED'
                AND b.checkInDate < :checkOut
                AND b.checkOutDate > :checkIn
            )
            """)
    List<Lot> findAvailableLotsByOwner(Long ownerId, LocalDate checkIn, LocalDate checkOut);
}
