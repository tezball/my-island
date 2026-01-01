package com.example.myislandapi.dto.request;

import com.example.myislandapi.enums.Facility;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Set;

public record UpdateCampsiteRequest(
    @Size(max = 255) String name,
    @Size(max = 2000) String description,
    @Valid LocationRequest location,
    List<String> images,
    Set<Facility> facilities,
    Boolean active
) {
    public record LocationRequest(
        @Size(max = 500) String address,
        @Size(max = 100) String county,
        Double lat,
        Double lng
    ) {}
}
