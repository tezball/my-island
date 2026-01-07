package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.model.BookingModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class BookingRowMapper implements RowMapper<BookingModel> {

    @Override
    public BookingModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        BookingModel booking = new BookingModel();
        booking.setId(UUID.fromString(rs.getString("id")));

        String userId = rs.getString("user_id");
        if (userId != null) {
            booking.setUserId(UUID.fromString(userId));
        }

        String lotId = rs.getString("lot_id");
        if (lotId != null) {
            booking.setLotId(UUID.fromString(lotId));
        }

        booking.setCheckIn(rs.getDate("check_in").toLocalDate());
        booking.setCheckOut(rs.getDate("check_out").toLocalDate());
        booking.setGuests(rs.getInt("guests"));

        String statusStr = rs.getString("status");
        if (statusStr != null) {
            booking.setStatus(BookingStatus.valueOf(statusStr));
        }

        booking.setLotPrice(rs.getBigDecimal("lot_price"));
        booking.setExtrasPrice(rs.getBigDecimal("extras_price"));
        booking.setServiceFee(rs.getBigDecimal("service_fee"));
        booking.setTotalPrice(rs.getBigDecimal("total_price"));
        booking.setSpecialRequests(rs.getString("special_requests"));
        booking.setCancellationReason(rs.getString("cancellation_reason"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            booking.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            booking.setUpdatedAt(updatedAt.toInstant());
        }

        return booking;
    }
}
