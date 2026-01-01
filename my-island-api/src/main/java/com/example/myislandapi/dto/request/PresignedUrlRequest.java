package com.example.myislandapi.dto.request;

import jakarta.validation.constraints.NotBlank;

public record PresignedUrlRequest(
        @NotBlank String fileName,
        @NotBlank String contentType,
        String folder
) {
    public PresignedUrlRequest {
        if (folder == null || folder.isBlank()) {
            folder = "general";
        }
    }
}
