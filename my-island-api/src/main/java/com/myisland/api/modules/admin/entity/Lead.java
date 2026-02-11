package com.myisland.api.modules.admin.entity;

import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
public class Lead extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 255)
    private String email;

    @Column(length = 50)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "business_type", length = 20)
    private BusinessType businessType;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private LeadStatus status = LeadStatus.NEW;

    @Column(length = 100)
    private String source;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "assigned_to")
    private Long assignedTo;

    @Column(length = 500)
    private String tags;

    @Column(nullable = false)
    private int score = 0;

    @Column(name = "scheduled_follow_up")
    private LocalDateTime scheduledFollowUp;

    @Column(name = "converted_user_id")
    private Long convertedUserId;

    // Enums

    public enum BusinessType {
        OWNER,
        SUPPLIER
    }

    public enum LeadStatus {
        NEW,
        CONTACTED,
        QUALIFIED,
        CONVERTED,
        LOST
    }

    // Getters and Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public BusinessType getBusinessType() {
        return businessType;
    }

    public void setBusinessType(BusinessType businessType) {
        this.businessType = businessType;
    }

    public LeadStatus getStatus() {
        return status;
    }

    public void setStatus(LeadStatus status) {
        this.status = status;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(Long assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public LocalDateTime getScheduledFollowUp() {
        return scheduledFollowUp;
    }

    public void setScheduledFollowUp(LocalDateTime scheduledFollowUp) {
        this.scheduledFollowUp = scheduledFollowUp;
    }

    public Long getConvertedUserId() {
        return convertedUserId;
    }

    public void setConvertedUserId(Long convertedUserId) {
        this.convertedUserId = convertedUserId;
    }

    // Builder

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Lead lead = new Lead();

        public Builder name(String name) {
            lead.name = name;
            return this;
        }

        public Builder email(String email) {
            lead.email = email;
            return this;
        }

        public Builder phone(String phone) {
            lead.phone = phone;
            return this;
        }

        public Builder businessType(BusinessType businessType) {
            lead.businessType = businessType;
            return this;
        }

        public Builder status(LeadStatus status) {
            lead.status = status;
            return this;
        }

        public Builder source(String source) {
            lead.source = source;
            return this;
        }

        public Builder notes(String notes) {
            lead.notes = notes;
            return this;
        }

        public Builder assignedTo(Long assignedTo) {
            lead.assignedTo = assignedTo;
            return this;
        }

        public Builder tags(String tags) {
            lead.tags = tags;
            return this;
        }

        public Builder score(int score) {
            lead.score = score;
            return this;
        }

        public Builder scheduledFollowUp(LocalDateTime scheduledFollowUp) {
            lead.scheduledFollowUp = scheduledFollowUp;
            return this;
        }

        public Builder convertedUserId(Long convertedUserId) {
            lead.convertedUserId = convertedUserId;
            return this;
        }

        public Lead build() {
            return lead;
        }
    }
}
