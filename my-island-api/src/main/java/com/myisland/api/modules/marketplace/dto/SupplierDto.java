package com.myisland.api.modules.marketplace.dto;

import com.myisland.api.modules.marketplace.entity.Supplier;

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
        String website,
        String logoUrl,
        boolean isVerified,
        int offerCount,
        boolean isFeatured,
        LocalDateTime featuredUntil
) {
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
                supplier.getWebsite(),
                supplier.getLogoUrl(),
                supplier.isVerified(),
                supplier.getOffers().size(),
                supplier.isCurrentlyFeatured(),
                supplier.getFeaturedUntil()
        );
    }
}
