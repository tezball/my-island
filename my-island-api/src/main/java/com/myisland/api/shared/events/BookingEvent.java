package com.myisland.api.shared.events;

import org.springframework.context.ApplicationEvent;

public class BookingEvent extends ApplicationEvent {

    private final Long bookingId;
    private final Type type;

    public BookingEvent(Object source, Long bookingId, Type type) {
        super(source);
        this.bookingId = bookingId;
        this.type = type;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public Type getType() {
        return type;
    }

    public enum Type {
        CREATED, CONFIRMED, CANCELLED, COMPLETED
    }
}
