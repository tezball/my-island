package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.NotificationResponse;
import com.example.myislandapi.entity.Notification;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.enums.NotificationType;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.NotificationRepository;
import com.example.myislandapi.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository) {
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
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found: " + notificationId);
        }

        notification.setRead(true);
        notification = notificationRepository.save(notification);

        return toNotificationResponse(notification);
    }

    public void createNotification(UUID userId, NotificationType type, String title,
                                   String message, String actionUrl, String relatedId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setActionUrl(actionUrl);
        notification.setRelatedId(relatedId);

        notificationRepository.save(notification);
    }

    private NotificationResponse toNotificationResponse(Notification notification) {
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
