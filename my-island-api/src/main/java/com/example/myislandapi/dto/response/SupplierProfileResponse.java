package com.example.myislandapi.dto.response;

import com.example.myislandapi.entity.Supplier;

import java.time.Instant;
import java.util.UUID;

public record SupplierProfileResponse(
        UUID id,
        UUID userId,
        String businessName,
        String description,
        String location,
        String contactEmail,
        String phoneNumber,
        String logoUrl,
        Instant createdAt,
        Instant updatedAt
) {
    public static SupplierProfileResponse from(Supplier supplier) {
        return new SupplierProfileResponse(
                supplier.getId(),
                supplier.getUser().getId(),
                supplier.getBusinessName(),
                supplier.getDescription(),
                supplier.getLocation(),
                supplier.getContactEmail(),
                supplier.getPhoneNumber(),
                supplier.getLogoUrl(),
                supplier.getCreatedAt(),
                supplier.getUpdatedAt()
        );
    }
}
