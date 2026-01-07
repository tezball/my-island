package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.enums.NotificationType;
import com.example.myislandapi.model.NotificationModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class NotificationRowMapper implements RowMapper<NotificationModel> {

    @Override
    public NotificationModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        NotificationModel notification = new NotificationModel();
        notification.setId(UUID.fromString(rs.getString("id")));

        String userId = rs.getString("user_id");
        if (userId != null) {
            notification.setUserId(UUID.fromString(userId));
        }

        String typeStr = rs.getString("type");
        if (typeStr != null) {
            notification.setType(NotificationType.valueOf(typeStr));
        }

        notification.setTitle(rs.getString("title"));
        notification.setMessage(rs.getString("message"));
        notification.setRead(rs.getBoolean("is_read"));
        notification.setActionUrl(rs.getString("action_url"));
        notification.setRelatedId(rs.getString("related_id"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            notification.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            notification.setUpdatedAt(updatedAt.toInstant());
        }

        return notification;
    }
}
