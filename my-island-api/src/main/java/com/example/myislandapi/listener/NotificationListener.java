package com.example.myislandapi.listener;

import com.example.myislandapi.config.KafkaConfig;
import com.example.myislandapi.event.NotificationEvent;
import com.example.myislandapi.model.NotificationModel;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.repository.jdbc.JdbcNotificationRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationListener.class);

    private final JdbcNotificationRepository notificationRepository;
    private final JdbcUserRepository userRepository;

    public NotificationListener(JdbcNotificationRepository notificationRepository,
                                JdbcUserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @KafkaListener(
            topics = KafkaConfig.NOTIFICATION_EVENTS_TOPIC,
            groupId = "notification-processor"
    )
    public void handleNotificationEvent(NotificationEvent event) {
        log.info("Received notification event for user: {}, type: {}", event.userId(), event.type());

        try {
            UserModel user = userRepository.findById(event.userId()).orElse(null);
            if (user == null) {
                log.warn("User not found for notification: {}", event.userId());
                return;
            }

            NotificationModel notification = new NotificationModel();
            notification.setUserId(event.userId());
            notification.setType(event.type());
            notification.setTitle(event.title());
            notification.setMessage(event.message());
            if (event.referenceId() != null) {
                notification.setRelatedId(event.referenceId().toString());
            }
            notification.setRead(false);

            notificationRepository.save(notification);
            log.info("Created notification for user: {}", event.userId());
        } catch (Exception e) {
            log.error("Error processing notification event: {}", e.getMessage(), e);
        }
    }
}
