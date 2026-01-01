package com.example.myislandapi.repository;

import com.example.myislandapi.entity.LotAvailability;
import com.example.myislandapi.enums.AvailabilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LotAvailabilityRepository extends JpaRepository<LotAvailability, UUID> {

    List<LotAvailability> findByLotIdAndDateBetween(UUID lotId, LocalDate startDate, LocalDate endDate);

    Optional<LotAvailability> findByLotIdAndDate(UUID lotId, LocalDate date);

    @Query("SELECT la FROM LotAvailability la WHERE la.lot.id = :lotId " +
           "AND la.date BETWEEN :startDate AND :endDate " +
           "AND la.status != :status")
    List<LotAvailability> findUnavailableDates(@Param("lotId") UUID lotId,
                                                @Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate,
                                                @Param("status") AvailabilityStatus status);

    void deleteByBookingId(UUID bookingId);

    List<LotAvailability> findByBookingId(UUID bookingId);
}
