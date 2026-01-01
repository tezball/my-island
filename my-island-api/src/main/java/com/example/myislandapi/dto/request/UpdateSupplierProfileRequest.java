package com.example.myislandapi.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateSupplierProfileRequest(
        @Size(max = 255) String businessName,
        @Size(max = 2000) String description,
        @Size(max = 255) String location,
        @Email @Size(max = 255) String contactEmail,
        @Size(max = 50) String phoneNumber
) {}
