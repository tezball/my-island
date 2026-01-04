package com.example.myislandapi.service;

import com.example.myislandapi.config.KafkaConfig;
import com.example.myislandapi.enums.PropertyType;
import com.example.myislandapi.event.BookingEvent;
import com.example.myislandapi.event.EmailEvent;
import com.example.myislandapi.event.NotificationEvent;
import com.example.myislandapi.event.PropertyEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

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

    public void publishPropertyDraftSaved(UUID draftId, UUID ownerId, PropertyType propertyType) {
        PropertyEvent event = PropertyEvent.draftSaved(draftId, ownerId, propertyType);
        log.info("Publishing property draft saved event for draft: {}", draftId);
        kafkaTemplate.send(KafkaConfig.PROPERTY_EVENTS_TOPIC, draftId.toString(), event);
    }

    public void publishPropertyCreated(UUID propertyId, UUID ownerId, PropertyType propertyType) {
        PropertyEvent event = PropertyEvent.created(propertyId, ownerId, propertyType);
        log.info("Publishing property created event for property: {}", propertyId);
        kafkaTemplate.send(KafkaConfig.PROPERTY_EVENTS_TOPIC, propertyId.toString(), event);
    }

    public void publishPropertyPendingReview(UUID propertyId, UUID ownerId) {
        PropertyEvent event = PropertyEvent.pendingReview(propertyId, ownerId);
        log.info("Publishing property pending review event for property: {}", propertyId);
        kafkaTemplate.send(KafkaConfig.PROPERTY_EVENTS_TOPIC, propertyId.toString(), event);
    }
}
