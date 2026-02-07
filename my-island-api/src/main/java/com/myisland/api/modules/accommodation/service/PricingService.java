package com.myisland.api.modules.accommodation.service;

import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.entity.SeasonalPricingRule;
import com.myisland.api.modules.accommodation.repository.SeasonalPricingRuleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class PricingService {

    private final SeasonalPricingRuleRepository pricingRuleRepository;

    public PricingService(SeasonalPricingRuleRepository pricingRuleRepository) {
        this.pricingRuleRepository = pricingRuleRepository;
    }

    /**
     * Calculate total price for a stay by iterating each night.
     * For each night, checks if a seasonal pricing rule applies; falls back to lot base price.
     */
    public BigDecimal calculateTotalPrice(Lot lot, LocalDate checkIn, LocalDate checkOut) {
        Long ownerId = lot.getOwner().getId();
        List<SeasonalPricingRule> rules = pricingRuleRepository.findRulesForDateRange(
                ownerId, lot.getLotType(), checkIn, checkOut);

        BigDecimal total = BigDecimal.ZERO;
        LocalDate current = checkIn;

        while (current.isBefore(checkOut)) {
            BigDecimal nightPrice = lot.getPricePerNight(); // default

            // Find applicable rule for this night (first match wins)
            for (SeasonalPricingRule rule : rules) {
                if (!current.isBefore(rule.getStartDate()) && current.isBefore(rule.getEndDate())) {
                    nightPrice = rule.getPricePerNight();
                    break;
                }
            }

            total = total.add(nightPrice);
            current = current.plusDays(1);
        }

        return total;
    }
}
