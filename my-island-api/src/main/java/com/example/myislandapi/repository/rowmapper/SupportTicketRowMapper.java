package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.enums.TicketStatus;
import com.example.myislandapi.model.SupportTicketModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class SupportTicketRowMapper implements RowMapper<SupportTicketModel> {

    @Override
    public SupportTicketModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        SupportTicketModel ticket = new SupportTicketModel();
        ticket.setId(UUID.fromString(rs.getString("id")));

        String userId = rs.getString("user_id");
        if (userId != null) {
            ticket.setUserId(UUID.fromString(userId));
        }

        ticket.setSubject(rs.getString("subject"));
        ticket.setDescription(rs.getString("description"));
        ticket.setCategory(rs.getString("category"));

        String statusStr = rs.getString("status");
        if (statusStr != null) {
            ticket.setStatus(TicketStatus.valueOf(statusStr));
        }

        String bookingId = rs.getString("booking_id");
        if (bookingId != null) {
            ticket.setRelatedBookingId(UUID.fromString(bookingId));
        }

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            ticket.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            ticket.setUpdatedAt(updatedAt.toInstant());
        }

        return ticket;
    }
}
