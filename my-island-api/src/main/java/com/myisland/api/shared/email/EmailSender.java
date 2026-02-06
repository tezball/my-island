package com.myisland.api.shared.email;

public interface EmailSender {
    void send(String to, String subject, String htmlContent);
}
