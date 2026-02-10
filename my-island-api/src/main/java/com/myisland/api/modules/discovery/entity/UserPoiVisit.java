package com.myisland.api.modules.discovery.entity;

import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_poi_visits", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "poi_id"}))
public class UserPoiVisit extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poi_id", nullable = false)
    private PointOfInterest poi;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VisitStatus status;

    @Column(name = "visited_at")
    private LocalDateTime visitedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public enum VisitStatus {
        PLANNED, VISITED
    }

    public UserPoiVisit() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private User user;
        private PointOfInterest poi;
        private VisitStatus status;
        private LocalDateTime visitedAt;
        private String notes;

        public Builder user(User user) { this.user = user; return this; }
        public Builder poi(PointOfInterest poi) { this.poi = poi; return this; }
        public Builder status(VisitStatus status) { this.status = status; return this; }
        public Builder visitedAt(LocalDateTime visitedAt) { this.visitedAt = visitedAt; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }

        public UserPoiVisit build() {
            UserPoiVisit visit = new UserPoiVisit();
            visit.user = this.user;
            visit.poi = this.poi;
            visit.status = this.status;
            visit.visitedAt = this.visitedAt;
            visit.notes = this.notes;
            return visit;
        }
    }

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public PointOfInterest getPoi() { return poi; }
    public void setPoi(PointOfInterest poi) { this.poi = poi; }

    public VisitStatus getStatus() { return status; }
    public void setStatus(VisitStatus status) { this.status = status; }

    public LocalDateTime getVisitedAt() { return visitedAt; }
    public void setVisitedAt(LocalDateTime visitedAt) { this.visitedAt = visitedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
