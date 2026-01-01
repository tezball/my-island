package com.example.myislandapi.dto.request;

import com.example.myislandapi.enums.Facility;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Set;

public record CreateCampsiteRequest(
    @NotBlank @Size(max = 255) String name,
    @Size(max = 2000) String description,
    @NotNull @Valid LocationRequest location,
    List<String> images,
    Set<Facility> facilities
) {
    public record LocationRequest(
        @NotBlank @Size(max = 500) String address,
        @NotBlank @Size(max = 100) String county,
        @NotNull Double lat,
        @NotNull Double lng
    ) {}
}
