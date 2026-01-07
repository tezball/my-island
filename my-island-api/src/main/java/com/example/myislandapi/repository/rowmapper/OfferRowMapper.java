package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.enums.OfferCategory;
import com.example.myislandapi.model.OfferModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class OfferRowMapper implements RowMapper<OfferModel> {

    @Override
    public OfferModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        OfferModel offer = new OfferModel();
        offer.setId(UUID.fromString(rs.getString("id")));

        String campsiteId = rs.getString("campsite_id");
        if (campsiteId != null) {
            offer.setCampsiteId(UUID.fromString(campsiteId));
        }

        offer.setTitle(rs.getString("title"));
        offer.setDescription(rs.getString("description"));

        String categoryStr = rs.getString("category");
        if (categoryStr != null) {
            offer.setCategory(OfferCategory.valueOf(categoryStr));
        }

        offer.setImageUrl(rs.getString("image_url"));
        offer.setOriginalPrice(rs.getBigDecimal("original_price"));
        offer.setDiscountPrice(rs.getBigDecimal("discount_price"));
        offer.setDiscountPercent(rs.getObject("discount_percent", Integer.class));

        java.sql.Date validFrom = rs.getDate("valid_from");
        if (validFrom != null) {
            offer.setValidFrom(validFrom.toLocalDate());
        }

        java.sql.Date validUntil = rs.getDate("valid_until");
        if (validUntil != null) {
            offer.setValidUntil(validUntil.toLocalDate());
        }

        offer.setPromoCode(rs.getString("promo_code"));
        offer.setFeatured(rs.getBoolean("featured"));
        offer.setActive(rs.getBoolean("active"));
        offer.setLat(rs.getDouble("lat"));
        offer.setLng(rs.getDouble("lng"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            offer.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            offer.setUpdatedAt(updatedAt.toInstant());
        }

        return offer;
    }
}
