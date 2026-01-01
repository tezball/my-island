package com.example.myislandapi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class NotificationPreferences {

    @Column(name = "email_notifications")
    private boolean email = true;

    @Column(name = "push_notifications")
    private boolean push = true;

    @Column(name = "sms_notifications")
    private boolean sms = false;

    @Column(name = "marketing_notifications")
    private boolean marketing = false;

    public NotificationPreferences() {
    }

    public NotificationPreferences(boolean email, boolean push, boolean sms, boolean marketing) {
        this.email = email;
        this.push = push;
        this.sms = sms;
        this.marketing = marketing;
    }

    public boolean isEmail() {
        return email;
    }

    public void setEmail(boolean email) {
        this.email = email;
    }

    public boolean isPush() {
        return push;
    }

    public void setPush(boolean push) {
        this.push = push;
    }

    public boolean isSms() {
        return sms;
    }

    public void setSms(boolean sms) {
        this.sms = sms;
    }

    public boolean isMarketing() {
        return marketing;
    }

    public void setMarketing(boolean marketing) {
        this.marketing = marketing;
    }
}
