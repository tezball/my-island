package com.example.myislandapi.dto.response;

public record ImageUploadResponse(
        String url,
        String fileName,
        long size
) {}
