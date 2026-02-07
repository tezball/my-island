package com.myisland.api.modules.accommodation.repository;

import com.myisland.api.modules.accommodation.entity.LotBlockedPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LotBlockedPeriodRepository extends JpaRepository<LotBlockedPeriod, Long> {

    List<LotBlockedPeriod> findByLotId(Long lotId);

    @Query("""
            SELECT bp FROM LotBlockedPeriod bp
            WHERE bp.lot.id = :lotId
            AND bp.startDate < :endDate
            AND bp.endDate > :startDate
            """)
    List<LotBlockedPeriod> findOverlappingBlocks(Long lotId, LocalDate startDate, LocalDate endDate);

    @Query("""
            SELECT bp FROM LotBlockedPeriod bp
            WHERE bp.lot.owner.id = :ownerId
            ORDER BY bp.startDate ASC
            """)
    List<LotBlockedPeriod> findByOwnerId(Long ownerId);
}
