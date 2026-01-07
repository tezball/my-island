package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.model.ReviewCategories;
import com.example.myislandapi.model.ReviewModel;
import com.example.myislandapi.repository.rowmapper.ReviewRowMapper;
import com.example.myislandapi.util.AuditingUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JdbcReviewRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final ReviewRowMapper rowMapper;

    public JdbcReviewRepository(NamedParameterJdbcTemplate jdbc, ReviewRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<ReviewModel> findById(UUID id) {
        String sql = "SELECT * FROM reviews WHERE id = :id";
        List<ReviewModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        return results.stream().findFirst();
    }

    public Page<ReviewModel> findByCampsiteId(UUID campsiteId, Pageable pageable) {
        String sql = "SELECT * FROM reviews WHERE campsite_id = :campsiteId ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<ReviewModel> content = jdbc.query(sql,
            Map.of("campsiteId", campsiteId, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);

        String countSql = "SELECT COUNT(*) FROM reviews WHERE campsite_id = :campsiteId";
        Long total = jdbc.queryForObject(countSql, Map.of("campsiteId", campsiteId), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<ReviewModel> findByUserId(UUID userId, Pageable pageable) {
        String sql = "SELECT * FROM reviews WHERE user_id = :userId ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<ReviewModel> content = jdbc.query(sql,
            Map.of("userId", userId, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);

        String countSql = "SELECT COUNT(*) FROM reviews WHERE user_id = :userId";
        Long total = jdbc.queryForObject(countSql, Map.of("userId", userId), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Optional<ReviewModel> findByBookingId(UUID bookingId) {
        String sql = "SELECT * FROM reviews WHERE booking_id = :bookingId";
        List<ReviewModel> results = jdbc.query(sql, Map.of("bookingId", bookingId), rowMapper);
        return results.stream().findFirst();
    }

    public boolean existsByBookingId(UUID bookingId) {
        String sql = "SELECT COUNT(*) FROM reviews WHERE booking_id = :bookingId";
        Integer count = jdbc.queryForObject(sql, Map.of("bookingId", bookingId), Integer.class);
        return count != null && count > 0;
    }

    public Double getAverageRatingForCampsite(UUID campsiteId) {
        String sql = "SELECT AVG(rating) FROM reviews WHERE campsite_id = :campsiteId";
        return jdbc.queryForObject(sql, Map.of("campsiteId", campsiteId), Double.class);
    }

    public int countByCampsiteId(UUID campsiteId) {
        String sql = "SELECT COUNT(*) FROM reviews WHERE campsite_id = :campsiteId";
        Integer count = jdbc.queryForObject(sql, Map.of("campsiteId", campsiteId), Integer.class);
        return count != null ? count : 0;
    }

    public Page<ReviewModel> findByOwnerId(UUID ownerId, Pageable pageable) {
        String sql = """
            SELECT r.* FROM reviews r
            JOIN campsites c ON r.campsite_id = c.id
            WHERE c.owner_id = :ownerId
            ORDER BY r.created_at DESC LIMIT :limit OFFSET :offset
            """;
        List<ReviewModel> content = jdbc.query(sql,
            Map.of("ownerId", ownerId, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);

        String countSql = """
            SELECT COUNT(*) FROM reviews r
            JOIN campsites c ON r.campsite_id = c.id
            WHERE c.owner_id = :ownerId
            """;
        Long total = jdbc.queryForObject(countSql, Map.of("ownerId", ownerId), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public ReviewModel save(ReviewModel review) {
        if (review.getId() == null) {
            return insert(review);
        } else {
            return update(review);
        }
    }

    private ReviewModel insert(ReviewModel review) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(review.getId(), review.getCreatedAt());
        review.setId(audit.id());
        review.setCreatedAt(audit.createdAt());
        review.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO reviews (id, user_id, campsite_id, booking_id, rating, comment,
                cleanliness_rating, location_rating, value_rating, facilities_rating,
                helpful_count, owner_response, created_at, updated_at)
            VALUES (:id, :userId, :campsiteId, :bookingId, :rating, :comment,
                :cleanliness, :location, :value, :facilities,
                :helpfulCount, :ownerResponse, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(review));
        return review;
    }

    private ReviewModel update(ReviewModel review) {
        review.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE reviews SET
                user_id = :userId, campsite_id = :campsiteId, booking_id = :bookingId, rating = :rating,
                comment = :comment, cleanliness_rating = :cleanliness, location_rating = :location,
                value_rating = :value, facilities_rating = :facilities, helpful_count = :helpfulCount,
                owner_response = :ownerResponse, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(review));
        return review;
    }

    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM reviews WHERE id = :id", Map.of("id", id));
    }

    private MapSqlParameterSource toParameterSource(ReviewModel review) {
        ReviewCategories categories = review.getCategories();

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", review.getId());
        params.addValue("userId", review.getUserId());
        params.addValue("campsiteId", review.getCampsiteId());
        params.addValue("bookingId", review.getBookingId());
        params.addValue("rating", review.getRating());
        params.addValue("comment", review.getComment());
        params.addValue("cleanliness", categories != null ? categories.getCleanliness() : null);
        params.addValue("location", categories != null ? categories.getLocation() : null);
        params.addValue("value", categories != null ? categories.getValue() : null);
        params.addValue("facilities", categories != null ? categories.getFacilities() : null);
        params.addValue("helpfulCount", review.getHelpfulCount());
        params.addValue("ownerResponse", review.getOwnerResponse());
        params.addValue("createdAt", Timestamp.from(review.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(review.getUpdatedAt()));
        return params;
    }
}
