package com.myisland.api.modules.admin.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_interactions")
public class LeadInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lead_id", nullable = false)
    private Long leadId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private InteractionType type;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Enum

    public enum InteractionType {
        CALL,
        EMAIL,
        MEETING,
        NOTE
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLeadId() {
        return leadId;
    }

    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }

    public InteractionType getType() {
        return type;
    }

    public void setType(InteractionType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Builder

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final LeadInteraction interaction = new LeadInteraction();

        public Builder leadId(Long leadId) {
            interaction.leadId = leadId;
            return this;
        }

        public Builder type(InteractionType type) {
            interaction.type = type;
            return this;
        }

        public Builder content(String content) {
            interaction.content = content;
            return this;
        }

        public Builder createdBy(Long createdBy) {
            interaction.createdBy = createdBy;
            return this;
        }

        public LeadInteraction build() {
            return interaction;
        }
    }
}
