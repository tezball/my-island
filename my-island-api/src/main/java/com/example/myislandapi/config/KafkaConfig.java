package com.example.myislandapi.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.*;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConfig {

    public static final String BOOKING_EVENTS_TOPIC = "booking-events";
    public static final String NOTIFICATION_EVENTS_TOPIC = "notification-events";
    public static final String EMAIL_EVENTS_TOPIC = "email-events";
    public static final String PROPERTY_EVENTS_TOPIC = "property-events";
    public static final String USER_EVENTS_TOPIC = "user-events";
    public static final String REVIEW_EVENTS_TOPIC = "review-events";
    public static final String FAVORITE_EVENTS_TOPIC = "favorite-events";
    public static final String PAYMENT_EVENTS_TOPIC = "payment-events";
    public static final String SEARCH_EVENTS_TOPIC = "search-events";
    public static final String ANALYTICS_EVENTS_TOPIC = "analytics-events";

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, "my-island-api");
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        configProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        configProps.put(JsonDeserializer.TRUSTED_PACKAGES, "com.example.myislandapi.event");
        return new DefaultKafkaConsumerFactory<>(configProps);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory =
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }

    @Bean
    public NewTopic bookingEventsTopic() {
        return TopicBuilder.name(BOOKING_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic notificationEventsTopic() {
        return TopicBuilder.name(NOTIFICATION_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic emailEventsTopic() {
        return TopicBuilder.name(EMAIL_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic propertyEventsTopic() {
        return TopicBuilder.name(PROPERTY_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic userEventsTopic() {
        return TopicBuilder.name(USER_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic reviewEventsTopic() {
        return TopicBuilder.name(REVIEW_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic favoriteEventsTopic() {
        return TopicBuilder.name(FAVORITE_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic paymentEventsTopic() {
        return TopicBuilder.name(PAYMENT_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic searchEventsTopic() {
        return TopicBuilder.name(SEARCH_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic analyticsEventsTopic() {
        return TopicBuilder.name(ANALYTICS_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
