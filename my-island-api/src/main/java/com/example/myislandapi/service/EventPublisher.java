package com.example.myislandapi.service;

import com.example.myislandapi.config.KafkaConfig;
import com.example.myislandapi.event.BookingEvent;
import com.example.myislandapi.event.EmailEvent;
import com.example.myislandapi.event.NotificationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class EventPublisher {

    private static final Logger log = LoggerFactory.getLogger(EventPublisher.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public EventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishBookingEvent(BookingEvent event) {
        log.info("Publishing booking event: {} for booking: {}", event.eventType(), event.bookingId());
        kafkaTemplate.send(KafkaConfig.BOOKING_EVENTS_TOPIC, event.bookingId().toString(), event);
    }

    public void publishNotificationEvent(NotificationEvent event) {
        log.info("Publishing notification event for user: {}, type: {}", event.userId(), event.type());
        kafkaTemplate.send(KafkaConfig.NOTIFICATION_EVENTS_TOPIC, event.userId().toString(), event);
    }

    public void publishEmailEvent(EmailEvent event) {
        log.info("Publishing email event: {} for user: {}", event.emailType(), event.userId());
        kafkaTemplate.send(KafkaConfig.EMAIL_EVENTS_TOPIC, event.userId().toString(), event);
    }
}
