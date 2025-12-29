package com.myisland.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "facilities")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Facility {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String icon;
}
