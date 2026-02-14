package com.myisland.api.modules.notification.entity;

import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "notifications")
public class Notification extends BaseEntity {

    public enum NotificationType {
        BOOKING_CREATED,
        BOOKING_CONFIRMED,
        BOOKING_CANCELLED,
        BOOKING_CHECKED_IN,
        BOOKING_CHECKED_OUT,
        BOOKING_MODIFIED,
        BOOKING_MODIFICATION_REQUESTED,
        BOOKING_MODIFICATION_APPROVED,
        BOOKING_MODIFICATION_DECLINED,
        OFFER_CLAIMED,
        OFFER_REDEEMED,
        MESSAGE_RECEIVED
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private NotificationType type;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(length = 500)
    private String link;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    public Notification() {}

    public Notification(User user, NotificationType type, String title, String message, String link) {
        this.user = user;
        this.type = type;
        this.title = title;
        this.message = message;
        this.link = link;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User user;
        private NotificationType type;
        private String title;
        private String message;
        private String link;

        public Builder user(User user) { this.user = user; return this; }
        public Builder type(NotificationType type) { this.type = type; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder link(String link) { this.link = link; return this; }

        public Notification build() {
            return new Notification(user, type, title, message, link);
        }
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
}
