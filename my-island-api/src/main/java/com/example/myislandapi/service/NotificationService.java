package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.NotificationResponse;
import com.example.myislandapi.model.NotificationModel;
import com.example.myislandapi.enums.NotificationType;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.jdbc.JdbcNotificationRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class NotificationService {

    private final JdbcNotificationRepository notificationRepository;
    private final JdbcUserRepository userRepository;

    public NotificationService(JdbcNotificationRepository notificationRepository,
                               JdbcUserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(UUID userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toNotificationResponse);
    }

    @Transactional(readOnly = true)
    public int getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public NotificationResponse markAsRead(UUID notificationId, UUID userId) {
        NotificationModel notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));

        if (!notification.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found: " + notificationId);
        }

        notification.setRead(true);
        notification = notificationRepository.save(notification);

        return toNotificationResponse(notification);
    }

    public int markAllAsRead(UUID userId) {
        return notificationRepository.markAllAsReadByUserId(userId);
    }

    public void createNotification(UUID userId, NotificationType type, String title,
                                   String message, String actionUrl, String relatedId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found: " + userId);
        }

        NotificationModel notification = new NotificationModel();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setActionUrl(actionUrl);
        notification.setRelatedId(relatedId);

        notificationRepository.save(notification);
    }

    private NotificationResponse toNotificationResponse(NotificationModel notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.isRead(),
                notification.getActionUrl(),
                notification.getRelatedId(),
                notification.getCreatedAt()
        );
    }
}
