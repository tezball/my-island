package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.model.NotificationPreferences;
import com.example.myislandapi.model.UserModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class UserRowMapper implements RowMapper<UserModel> {

    @Override
    public UserModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        UserModel user = new UserModel();
        user.setId(UUID.fromString(rs.getString("id")));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setName(rs.getString("name"));
        user.setAvatar(rs.getString("avatar"));
        user.setPhone(rs.getString("phone"));
        user.setBio(rs.getString("bio"));
        user.setOwner(rs.getBoolean("is_owner"));
        user.setSupplier(rs.getBoolean("is_supplier"));

        // Embedded NotificationPreferences
        NotificationPreferences prefs = new NotificationPreferences();
        prefs.setEmail(rs.getBoolean("email_notifications"));
        prefs.setPush(rs.getBoolean("push_notifications"));
        prefs.setSms(rs.getBoolean("sms_notifications"));
        prefs.setMarketing(rs.getBoolean("marketing_notifications"));
        user.setNotificationPreferences(prefs);

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            user.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            user.setUpdatedAt(updatedAt.toInstant());
        }

        return user;
    }
}
