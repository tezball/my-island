package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.model.ExtraModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class ExtraRowMapper implements RowMapper<ExtraModel> {

    @Override
    public ExtraModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        ExtraModel extra = new ExtraModel();
        extra.setId(UUID.fromString(rs.getString("id")));

        String campsiteId = rs.getString("campsite_id");
        if (campsiteId != null) {
            extra.setCampsiteId(UUID.fromString(campsiteId));
        }

        extra.setName(rs.getString("name"));
        extra.setDescription(rs.getString("description"));
        extra.setPrice(rs.getBigDecimal("price"));
        extra.setPerNight(rs.getBoolean("per_night"));
        extra.setImageUrl(rs.getString("image_url"));
        extra.setAvailable(rs.getBoolean("available"));

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
