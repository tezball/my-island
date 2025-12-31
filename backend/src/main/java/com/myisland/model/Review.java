package com.myisland.model;

import java.time.LocalDate;
import java.util.List;

public record Review(
    String id,
    String campsiteId,
    String campsiteName,
    String userId,
    String userName,
    String userAvatar,
    int rating,
    String title,
    String content,
    LocalDate date,
    List<String> photos,
    int helpful,
    ReviewResponse response
) {
    public record ReviewResponse(String from, String content, LocalDate date) {}
}
