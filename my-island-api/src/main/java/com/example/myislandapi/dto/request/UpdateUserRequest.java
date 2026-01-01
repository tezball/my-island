package com.example.myislandapi.dto.request;

import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Size(max = 255) String name,
        @Size(max = 500) String avatar,
        @Size(max = 50) String phone,
        @Size(max = 500) String bio
) {}
