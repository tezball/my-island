package com.myisland.api.shared.events.kafka;

import java.time.LocalDateTime;

public record KafkaOfferEvent(
        Long claimId,
        Long offerId,
        String offerTitle,
        Long supplierId,
        String supplierName,
        Long userId,
        String userName,
        String userEmail,
        String claimCode,
        String status,
        boolean isTest,
        LocalDateTime timestamp
) {}
