package com.example.myislandapi.model;

/**
 * NotificationPreferences model - POJO without JPA annotations.
 * Used to represent embedded notification preferences data.
 */
public class NotificationPreferences {

    private boolean email = true;
    private boolean push = true;
    private boolean sms = false;
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
