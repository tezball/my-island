package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.enums.SupplierCategory;
import com.example.myislandapi.model.LocalBusinessModel;
import com.example.myislandapi.model.Location;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class LocalBusinessRowMapper implements RowMapper<LocalBusinessModel> {

    @Override
    public LocalBusinessModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        LocalBusinessModel business = new LocalBusinessModel();
        business.setId(UUID.fromString(rs.getString("id")));
        business.setName(rs.getString("name"));

        String categoryStr = rs.getString("category");
        if (categoryStr != null) {
            business.setCategory(SupplierCategory.valueOf(categoryStr));
        }

        business.setDescription(rs.getString("description"));

        // Embedded Location
        Location location = new Location();
        location.setAddress(rs.getString("address"));
        location.setCounty(rs.getString("county"));
        Double lat = rs.getObject("latitude", Double.class);
        Double lng = rs.getObject("longitude", Double.class);
        location.setLat(lat);
        location.setLng(lng);
        business.setLocation(location);

        business.setPhone(rs.getString("phone"));
        business.setEmail(rs.getString("email"));
        business.setWebsite(rs.getString("website"));
        business.setWeekdayHours(rs.getString("weekday_hours"));
        business.setWeekendHours(rs.getString("weekend_hours"));
        business.setRating(rs.getBigDecimal("rating"));
        business.setReviewCount(rs.getInt("review_count"));
        business.setFeatured(rs.getBoolean("featured"));
        business.setActive(rs.getBoolean("active"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            business.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            business.setUpdatedAt(updatedAt.toInstant());
        }

        return business;
    }
}
