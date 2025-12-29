package com.myisland.api.dto.response;

import com.myisland.api.entity.SupplierOffer;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class OfferResponse {
    private String id;
    private String supplierId;
    private String supplierName;
    private String supplierLogo;
    private String category;
    private String title;
    private String description;
    private String imageUrl;
    private String discount;
    private List<String> tags;
    private String location;
    private String distance;

    public static OfferResponse from(SupplierOffer o) {
        return OfferResponse.builder()
            .id(o.getId().toString())
            .supplierId(o.getSupplier() != null ? o.getSupplier().getId().toString() : null)
            .supplierName(o.getSupplierName())
            .supplierLogo(o.getSupplierLogo())
            .category(o.getCategory().name().toLowerCase())
            .title(o.getTitle())
            .description(o.getDescription())
            .imageUrl(o.getImageUrl())
            .discount(o.getDiscount())
            .tags(o.getTags())
            .location(o.getLocation())
            .distance(o.getDistance())
            .build();
    }
}
