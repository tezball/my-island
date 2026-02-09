package com.myisland.api.modules.marketplace.dto;

import com.myisland.api.modules.marketplace.entity.Supplier;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SupplierDto(
        Long id,
        String businessName,
        String category,
        String description,
        String county,
        String town,
        String address,
        String phone,
        String contactEmail,
        String website,
        String logoUrl,
        Double latitude,
        Double longitude,
        boolean isVerified,
        int offerCount,
        boolean isFeatured,
        LocalDateTime featuredUntil,
        BigDecimal rating,
        int reviewCount) {
    public static SupplierDto from(Supplier supplier) {
        return new SupplierDto(
                supplier.getId(),
                supplier.getBusinessName(),
                supplier.getCategory().name(),
                supplier.getDescription(),
                supplier.getCounty(),
                supplier.getTown(),
                supplier.getAddress(),
                supplier.getPhone(),
                supplier.getUser() != null ? supplier.getUser().getEmail() : null,
                supplier.getWebsite(),
                supplier.getLogoUrl(),
                supplier.getLatitude(),
                supplier.getLongitude(),
                supplier.isVerified(),
                supplier.getOffers().size(),
                supplier.isCurrentlyFeatured(),
                supplier.getFeaturedUntil(),
                supplier.getRating(),
                supplier.getReviewCount());
    }
}
