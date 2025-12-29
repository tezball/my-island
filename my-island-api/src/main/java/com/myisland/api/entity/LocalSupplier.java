package com.myisland.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "local_suppliers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LocalSupplier {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campsite_id", nullable = false)
    private Campsite campsite;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupplierCategory category;

    private String distance;

    @Column(nullable = false)
    private Boolean alertsEnabled;

    public enum SupplierCategory {
        FOOD, ACTIVITY, GEAR, OTHER
    }
}
