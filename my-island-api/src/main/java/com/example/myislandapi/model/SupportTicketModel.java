package com.example.myislandapi.model;

import com.example.myislandapi.enums.TicketStatus;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * SupportTicket model - POJO without JPA annotations.
 */
public class SupportTicketModel {

    private UUID id;
    private UUID userId;
    private String subject;
    private String description;
    private String category;
    private TicketStatus status = TicketStatus.OPEN;
    private UUID relatedBookingId;
    private List<TicketMessageModel> messages = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;

    public SupportTicketModel() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public UUID getRelatedBookingId() {
        return relatedBookingId;
    }

    public void setRelatedBookingId(UUID relatedBookingId) {
        this.relatedBookingId = relatedBookingId;
    }

    public List<TicketMessageModel> getMessages() {
        return messages;
    }

    public void setMessages(List<TicketMessageModel> messages) {
        this.messages = messages;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
