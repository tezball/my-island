package com.myisland.api.shared.events;

import org.springframework.context.ApplicationEvent;

public class OfferEvent extends ApplicationEvent {

    private final Long claimId;
    private final Type type;

    public OfferEvent(Object source, Long claimId, Type type) {
        super(source);
        this.claimId = claimId;
        this.type = type;
    }

    public Long getClaimId() {
        return claimId;
    }

    public Type getType() {
        return type;
    }

    public enum Type {
        CLAIMED, REDEEMED
    }
}
