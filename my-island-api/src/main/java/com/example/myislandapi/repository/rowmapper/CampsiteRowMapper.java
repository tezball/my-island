package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.Location;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class CampsiteRowMapper implements RowMapper<CampsiteModel> {

    @Override
    public CampsiteModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        CampsiteModel campsite = new CampsiteModel();
        campsite.setId(UUID.fromString(rs.getString("id")));
        campsite.setName(rs.getString("name"));
        campsite.setDescription(rs.getString("description"));

        // Embedded Location
        Location location = new Location();
        location.setAddress(rs.getString("address"));
        location.setCounty(rs.getString("county"));
        Double lat = rs.getObject("latitude", Double.class);
        Double lng = rs.getObject("longitude", Double.class);
        location.setLat(lat);
        location.setLng(lng);
        campsite.setLocation(location);

        campsite.setRating(rs.getBigDecimal("rating"));
        campsite.setReviewCount(rs.getInt("review_count"));
        campsite.setPricePerNight(rs.getBigDecimal("price_per_night"));

        String ownerId = rs.getString("owner_id");
        if (ownerId != null) {
            campsite.setOwnerId(UUID.fromString(ownerId));
        }

        campsite.setFeatured(rs.getBoolean("featured"));
        campsite.setActive(rs.getBoolean("active"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            campsite.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            campsite.setUpdatedAt(updatedAt.toInstant());
        }

        return campsite;
    }
}
