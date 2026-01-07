package com.example.myislandapi.model;

import java.time.Instant;
import java.util.UUID;

/**
 * TicketMessage model - POJO without JPA annotations.
 */
public class TicketMessageModel {

    private UUID id;
    private UUID ticketId;
    private UUID senderId;
    private String content;
    private boolean staffReply = false;
    private Instant createdAt;
    private Instant updatedAt;

    public TicketMessageModel() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTicketId() {
        return ticketId;
    }

    public void setTicketId(UUID ticketId) {
        this.ticketId = ticketId;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public void setSenderId(UUID senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isStaffReply() {
        return staffReply;
    }

    public void setStaffReply(boolean staffReply) {
        this.staffReply = staffReply;
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
