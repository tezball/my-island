package com.myisland.api.modules.communication.entity;

import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "messages")
public class Message extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    public Message() {}

    public Message(Booking booking, User sender, String content) {
        this.booking = booking;
        this.sender = sender;
        this.content = content;
    }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
}
