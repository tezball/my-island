package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.enums.AvailabilityStatus;
import com.example.myislandapi.model.LotAvailabilityModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class LotAvailabilityRowMapper implements RowMapper<LotAvailabilityModel> {

    @Override
    public LotAvailabilityModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        LotAvailabilityModel availability = new LotAvailabilityModel();
        availability.setId(UUID.fromString(rs.getString("id")));

        String lotId = rs.getString("lot_id");
        if (lotId != null) {
            availability.setLotId(UUID.fromString(lotId));
        }

        java.sql.Date date = rs.getDate("date");
        if (date != null) {
            availability.setDate(date.toLocalDate());
        }

        String statusStr = rs.getString("status");
        if (statusStr != null) {
            availability.setStatus(AvailabilityStatus.valueOf(statusStr));
        }

        availability.setPriceOverride(rs.getBigDecimal("price_override"));

        String bookingId = rs.getString("booking_id");
        if (bookingId != null) {
            availability.setBookingId(UUID.fromString(bookingId));
        }

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            availability.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            availability.setUpdatedAt(updatedAt.toInstant());
        }

        return availability;
    }
}
