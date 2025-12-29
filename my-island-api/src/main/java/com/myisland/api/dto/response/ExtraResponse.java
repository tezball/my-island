package com.myisland.api.dto.response;

import com.myisland.api.entity.Extra;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class ExtraResponse {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String icon;

    public static ExtraResponse from(Extra e) {
        return ExtraResponse.builder()
            .id(e.getId())
            .name(e.getName())
            .description(e.getDescription())
            .price(e.getPrice())
            .icon(e.getIcon())
            .build();
    }
}
