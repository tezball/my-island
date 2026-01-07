package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.model.FavoriteModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class FavoriteRowMapper implements RowMapper<FavoriteModel> {

    @Override
    public FavoriteModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        FavoriteModel favorite = new FavoriteModel();
        favorite.setId(UUID.fromString(rs.getString("id")));

        String userId = rs.getString("user_id");
        if (userId != null) {
            favorite.setUserId(UUID.fromString(userId));
        }

        String campsiteId = rs.getString("campsite_id");
        if (campsiteId != null) {
            favorite.setCampsiteId(UUID.fromString(campsiteId));
        }

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            favorite.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            favorite.setUpdatedAt(updatedAt.toInstant());
        }

        return favorite;
    }
}
