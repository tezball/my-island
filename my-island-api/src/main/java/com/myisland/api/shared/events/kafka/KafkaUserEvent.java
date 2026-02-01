package com.myisland.api.shared.events.kafka;

import java.time.LocalDateTime;

public record KafkaUserEvent(
        Long userId,
        String email,
        String name,
        String role,
        LocalDateTime timestamp
) {}
