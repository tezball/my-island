package com.example.myislandapi.dto.response;

import java.util.UUID;

public record FAQResponse(
    UUID id,
    String question,
    String answer,
    String category,
    int displayOrder
) {}
