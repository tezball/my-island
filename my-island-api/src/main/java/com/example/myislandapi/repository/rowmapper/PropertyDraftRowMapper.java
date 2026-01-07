package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.enums.PropertyType;
import com.example.myislandapi.model.PropertyDraftModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class PropertyDraftRowMapper implements RowMapper<PropertyDraftModel> {

    @Override
    public PropertyDraftModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        PropertyDraftModel draft = new PropertyDraftModel();
        draft.setId(UUID.fromString(rs.getString("id")));

        String ownerId = rs.getString("owner_id");
        if (ownerId != null) {
            draft.setOwnerId(UUID.fromString(ownerId));
        }

        String propertyTypeStr = rs.getString("property_type");
        if (propertyTypeStr != null) {
            draft.setPropertyType(PropertyType.valueOf(propertyTypeStr));
        }

        draft.setData(rs.getString("data"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            draft.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            draft.setUpdatedAt(updatedAt.toInstant());
        }

        return draft;
    }
}
