package com.example.myislandapi.dto.response;

public record PresignedUrlResponse(
        String uploadUrl,
        String fileName
) {}
