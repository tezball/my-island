package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.model.BookingExtraModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class BookingExtraRowMapper implements RowMapper<BookingExtraModel> {

    @Override
    public BookingExtraModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        BookingExtraModel extra = new BookingExtraModel();
        extra.setId(UUID.fromString(rs.getString("id")));

        String bookingId = rs.getString("booking_id");
        if (bookingId != null) {
            extra.setBookingId(UUID.fromString(bookingId));
        }

        String extraId = rs.getString("extra_id");
        if (extraId != null) {
            extra.setExtraId(UUID.fromString(extraId));
        }

        extra.setQuantity(rs.getInt("quantity"));
        extra.setUnitPrice(rs.getBigDecimal("unit_price"));
        extra.setTotalPrice(rs.getBigDecimal("total_price"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            extra.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            extra.setUpdatedAt(updatedAt.toInstant());
        }

        return extra;
    }
}
