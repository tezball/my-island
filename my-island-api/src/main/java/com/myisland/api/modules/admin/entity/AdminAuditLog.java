package com.myisland.api.modules.admin.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_audit_log")
public class AdminAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admin_user_id", nullable = false)
    private Long adminUserId;

    @Column(length = 50, nullable = false)
    private String action;

    @Column(name = "entity_type", length = 50)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(length = 500)
    private String summary;

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String details;

    @Column(name = "previous_value", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String previousValue;

    @Column(name = "new_value", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String newValue;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAdminUserId() {
        return adminUserId;
    }

    public void setAdminUserId(Long adminUserId) {
        this.adminUserId = adminUserId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getPreviousValue() {
        return previousValue;
    }

    public void setPreviousValue(String previousValue) {
        this.previousValue = previousValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
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
        private final AdminAuditLog log = new AdminAuditLog();

        public Builder adminUserId(Long adminUserId) {
            log.adminUserId = adminUserId;
            return this;
        }

        public Builder action(String action) {
            log.action = action;
            return this;
        }

        public Builder entityType(String entityType) {
            log.entityType = entityType;
            return this;
        }

        public Builder entityId(Long entityId) {
            log.entityId = entityId;
            return this;
        }

        public Builder summary(String summary) {
            log.summary = summary;
            return this;
        }

        public Builder details(String details) {
            log.details = details;
            return this;
        }

        public Builder previousValue(String previousValue) {
            log.previousValue = previousValue;
            return this;
        }

        public Builder newValue(String newValue) {
            log.newValue = newValue;
            return this;
        }

        public AdminAuditLog build() {
            return log;
        }
    }
}
