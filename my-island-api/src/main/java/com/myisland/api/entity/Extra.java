package com.myisland.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "extras")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Extra {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private String icon;
}
