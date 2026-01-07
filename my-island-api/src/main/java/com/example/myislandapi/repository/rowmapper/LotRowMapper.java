package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.enums.LotType;
import com.example.myislandapi.model.LotModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class LotRowMapper implements RowMapper<LotModel> {

    @Override
    public LotModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        LotModel lot = new LotModel();
        lot.setId(UUID.fromString(rs.getString("id")));

        String campsiteId = rs.getString("campsite_id");
        if (campsiteId != null) {
            lot.setCampsiteId(UUID.fromString(campsiteId));
        }

        lot.setName(rs.getString("name"));

        String typeStr = rs.getString("type");
        if (typeStr != null) {
            lot.setType(LotType.valueOf(typeStr));
        }

        lot.setCapacity(rs.getInt("capacity"));
        lot.setPricePerNight(rs.getBigDecimal("price_per_night"));
        lot.setAvailable(rs.getBoolean("available"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            lot.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            lot.setUpdatedAt(updatedAt.toInstant());
        }

        return lot;
    }
}
