package com.myisland.api.shared.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class JavaMailEmailSender implements EmailSender {

    private static final Logger log = LoggerFactory.getLogger(JavaMailEmailSender.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public JavaMailEmailSender(
            JavaMailSender mailSender,
            @Value("${myisland.email.from:noreply@myisland.ie}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    @Override
    public void send(String to, String subject, String htmlContent) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            log.info("Email sent successfully: to={}, subject={}", to, subject);
        } catch (MessagingException e) {
            log.error("Failed to send email: to={}, subject={}, error={}", to, subject, e.getMessage());
        }
    }
}
