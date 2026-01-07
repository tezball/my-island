package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.enums.SupplierCategory;
import com.example.myislandapi.model.SupplierModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class SupplierRowMapper implements RowMapper<SupplierModel> {

    @Override
    public SupplierModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        SupplierModel supplier = new SupplierModel();
        supplier.setId(UUID.fromString(rs.getString("id")));

        String userId = rs.getString("user_id");
        if (userId != null) {
            supplier.setUserId(UUID.fromString(userId));
        }

        supplier.setBusinessName(rs.getString("business_name"));
        supplier.setDescription(rs.getString("description"));
        supplier.setLocation(rs.getString("location"));
        supplier.setContactEmail(rs.getString("contact_email"));
        supplier.setPhoneNumber(rs.getString("phone_number"));
        supplier.setLogoUrl(rs.getString("logo_url"));

        String categoryStr = rs.getString("category");
        if (categoryStr != null) {
            supplier.setCategory(SupplierCategory.valueOf(categoryStr));
        }

        supplier.setEircode(rs.getString("eircode"));
        supplier.setLatitude(rs.getObject("latitude", Double.class));
        supplier.setLongitude(rs.getObject("longitude", Double.class));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            supplier.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            supplier.setUpdatedAt(updatedAt.toInstant());
        }

        return supplier;
    }
}
