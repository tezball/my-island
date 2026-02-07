package com.myisland.api.modules.accommodation.repository;

import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.entity.SeasonalPricingRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SeasonalPricingRuleRepository extends JpaRepository<SeasonalPricingRule, Long> {

    List<SeasonalPricingRule> findByOwnerId(Long ownerId);

    @Query("""
            SELECT r FROM SeasonalPricingRule r
            WHERE r.owner.id = :ownerId
            AND r.lotType = :lotType
            AND r.startDate < :endDate
            AND r.endDate > :startDate
            ORDER BY r.startDate ASC
            """)
    List<SeasonalPricingRule> findRulesForDateRange(Long ownerId, Lot.LotType lotType, LocalDate startDate, LocalDate endDate);
}
