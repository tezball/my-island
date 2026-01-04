package com.example.myislandapi.dto.request;

import com.example.myislandapi.enums.SupplierCategory;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record BecomeSupplierRequest(
        @NotBlank @Size(max = 255) String businessName,
        @NotBlank @Size(max = 2000) String description,
        @NotBlank @Size(max = 255) String location,
        @Email @Size(max = 255) String contactEmail,
        @Size(max = 50) String phoneNumber,
        @NotNull SupplierCategory category,
        @Size(max = 10) String eircode,
        Double latitude,
        Double longitude
) {}
