package com.example.myislandapi.dto.response;

public record LocationResponse(
    String address,
    String county,
    Double lat,
    Double lng
) {}
