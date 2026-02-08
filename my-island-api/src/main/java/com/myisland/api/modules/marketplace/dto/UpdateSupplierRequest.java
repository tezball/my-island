package com.myisland.api.modules.marketplace.dto;

public record UpdateSupplierRequest(
                String businessName,
                String category,
                String description,
                String county,
                String town,
                String address,
                String phone,
                String website,
                String logoUrl,
                Double latitude,
                Double longitude) {
}
