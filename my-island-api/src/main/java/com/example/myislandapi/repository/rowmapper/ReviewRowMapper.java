package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.model.ReviewCategories;
import com.example.myislandapi.model.ReviewModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class ReviewRowMapper implements RowMapper<ReviewModel> {

    @Override
    public ReviewModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        ReviewModel review = new ReviewModel();
        review.setId(UUID.fromString(rs.getString("id")));

        String userId = rs.getString("user_id");
        if (userId != null) {
            review.setUserId(UUID.fromString(userId));
        }

        String campsiteId = rs.getString("campsite_id");
        if (campsiteId != null) {
            review.setCampsiteId(UUID.fromString(campsiteId));
        }

        String bookingId = rs.getString("booking_id");
        if (bookingId != null) {
            review.setBookingId(UUID.fromString(bookingId));
        }

        review.setRating(rs.getInt("rating"));
        review.setComment(rs.getString("comment"));

        // Embedded ReviewCategories
        ReviewCategories categories = new ReviewCategories();
        categories.setCleanliness(rs.getObject("cleanliness_rating", Integer.class));
        categories.setLocation(rs.getObject("location_rating", Integer.class));
        categories.setValue(rs.getObject("value_rating", Integer.class));
        categories.setFacilities(rs.getObject("facilities_rating", Integer.class));
        review.setCategories(categories);

        review.setHelpfulCount(rs.getInt("helpful_count"));
        review.setOwnerResponse(rs.getString("owner_response"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            review.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            review.setUpdatedAt(updatedAt.toInstant());
        }

        return review;
    }
}
