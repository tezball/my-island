package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.model.MessageModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class MessageRowMapper implements RowMapper<MessageModel> {

    @Override
    public MessageModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        MessageModel message = new MessageModel();
        message.setId(UUID.fromString(rs.getString("id")));

        String bookingId = rs.getString("booking_id");
        if (bookingId != null) {
            message.setBookingId(UUID.fromString(bookingId));
        }

        String senderId = rs.getString("sender_id");
        if (senderId != null) {
            message.setSenderId(UUID.fromString(senderId));
        }

        message.setContent(rs.getString("content"));
        message.setRead(rs.getBoolean("is_read"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            message.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            message.setUpdatedAt(updatedAt.toInstant());
        }

        return message;
    }
}
