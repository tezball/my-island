package com.myisland.api.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    public static final String BOOKING_CREATED_TOPIC = "booking.created";
    public static final String BOOKING_CONFIRMED_TOPIC = "booking.confirmed";
    public static final String BOOKING_CANCELLED_TOPIC = "booking.cancelled";
    public static final String OFFER_CLAIMED_TOPIC = "offer.claimed";
    public static final String OFFER_REDEEMED_TOPIC = "offer.redeemed";
    public static final String USER_REGISTERED_TOPIC = "user.registered";

    @Bean
    public NewTopic bookingCreatedTopic() {
        return TopicBuilder.name(BOOKING_CREATED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic bookingConfirmedTopic() {
        return TopicBuilder.name(BOOKING_CONFIRMED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic bookingCancelledTopic() {
        return TopicBuilder.name(BOOKING_CANCELLED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic offerClaimedTopic() {
        return TopicBuilder.name(OFFER_CLAIMED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic offerRedeemedTopic() {
        return TopicBuilder.name(OFFER_REDEEMED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic userRegisteredTopic() {
        return TopicBuilder.name(USER_REGISTERED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
