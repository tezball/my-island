package com.myisland.api.modules.marketplace.dto;

import com.myisland.api.modules.marketplace.entity.Offer;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OfferDto(
        Long id,
        Long supplierId,
        String supplierName,
        String supplierCategory,
        String title,
        String description,
        String discountType,
        BigDecimal discountValue,
        BigDecimal minPurchase,
        String termsConditions,
        LocalDate validFrom,
        LocalDate validUntil,
        Integer maxClaims,
        int currentClaims,
        boolean isActive,
        boolean isAvailable,
        String imageUrl
) {
    public static OfferDto from(Offer offer) {
        return new OfferDto(
                offer.getId(),
                offer.getSupplier().getId(),
                offer.getSupplier().getBusinessName(),
                offer.getSupplier().getCategory() != null ? offer.getSupplier().getCategory().name() : null,
                offer.getTitle(),
                offer.getDescription(),
                offer.getDiscountType().name(),
                offer.getDiscountValue(),
                offer.getMinPurchase(),
                offer.getTermsConditions(),
                offer.getValidFrom(),
                offer.getValidUntil(),
                offer.getMaxClaims(),
                offer.getCurrentClaims(),
                offer.isActive(),
                offer.isAvailable(),
                offer.getImageUrl()
        );
    }
}
