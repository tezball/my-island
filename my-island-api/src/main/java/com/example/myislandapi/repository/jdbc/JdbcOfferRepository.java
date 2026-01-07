package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.enums.OfferCategory;
import com.example.myislandapi.model.OfferModel;
import com.example.myislandapi.repository.rowmapper.OfferRowMapper;
import com.example.myislandapi.util.AuditingUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JdbcOfferRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final OfferRowMapper rowMapper;

    public JdbcOfferRepository(NamedParameterJdbcTemplate jdbc, OfferRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<OfferModel> findById(UUID id) {
        String sql = "SELECT * FROM offers WHERE id = :id";
        List<OfferModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        return results.stream().findFirst();
    }

    public Page<OfferModel> findByActiveTrue(Pageable pageable) {
        String sql = "SELECT * FROM offers WHERE active = true ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<OfferModel> content = jdbc.query(sql,
            Map.of("limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);

        String countSql = "SELECT COUNT(*) FROM offers WHERE active = true";
        Long total = jdbc.queryForObject(countSql, Map.of(), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<OfferModel> findByActiveTrueAndCategory(OfferCategory category, Pageable pageable) {
        String sql = "SELECT * FROM offers WHERE active = true AND category = :category ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<OfferModel> content = jdbc.query(sql,
            Map.of("category", category.name(), "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);

        String countSql = "SELECT COUNT(*) FROM offers WHERE active = true AND category = :category";
        Long total = jdbc.queryForObject(countSql, Map.of("category", category.name()), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<OfferModel> findByActiveTrueAndFeaturedTrue(Pageable pageable) {
        String sql = "SELECT * FROM offers WHERE active = true AND featured = true ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<OfferModel> content = jdbc.query(sql,
            Map.of("limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);

        String countSql = "SELECT COUNT(*) FROM offers WHERE active = true AND featured = true";
        Long total = jdbc.queryForObject(countSql, Map.of(), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public List<OfferModel> findNearLocation(double minLat, double maxLat, double minLng, double maxLng) {
        String sql = """
            SELECT * FROM offers
            WHERE active = true
            AND lat BETWEEN :minLat AND :maxLat
            AND lng BETWEEN :minLng AND :maxLng
            """;
        return jdbc.query(sql, Map.of("minLat", minLat, "maxLat", maxLat, "minLng", minLng, "maxLng", maxLng), rowMapper);
    }

    public List<OfferModel> findByCampsiteId(UUID campsiteId) {
        String sql = "SELECT * FROM offers WHERE campsite_id = :campsiteId ORDER BY created_at DESC";
        return jdbc.query(sql, Map.of("campsiteId", campsiteId), rowMapper);
    }

    public OfferModel save(OfferModel offer) {
        if (offer.getId() == null) {
            return insert(offer);
        } else {
            return update(offer);
        }
    }

    private OfferModel insert(OfferModel offer) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(offer.getId(), offer.getCreatedAt());
        offer.setId(audit.id());
        offer.setCreatedAt(audit.createdAt());
        offer.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO offers (id, campsite_id, name, description, discount_percentage, category, start_date, end_date,
                image_url, lat, lng, active, featured, created_at, updated_at)
            VALUES (:id, :campsiteId, :name, :description, :discountPercentage, :category, :startDate, :endDate,
                :imageUrl, :lat, :lng, :active, :featured, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(offer));
        return offer;
    }

    private OfferModel update(OfferModel offer) {
        offer.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE offers SET
                campsite_id = :campsiteId, name = :name, description = :description, discount_percentage = :discountPercentage,
                category = :category, start_date = :startDate, end_date = :endDate, image_url = :imageUrl,
                lat = :lat, lng = :lng, active = :active, featured = :featured, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(offer));
        return offer;
    }

    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM offers WHERE id = :id", Map.of("id", id));
    }

    private MapSqlParameterSource toParameterSource(OfferModel offer) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", offer.getId());
        params.addValue("campsiteId", offer.getCampsiteId());
        params.addValue("name", offer.getTitle());
        params.addValue("description", offer.getDescription());
        params.addValue("discountPercentage", offer.getDiscountPercent());
        params.addValue("category", offer.getCategory() != null ? offer.getCategory().name() : null);
        params.addValue("startDate", offer.getValidFrom() != null ? Date.valueOf(offer.getValidFrom()) : null);
        params.addValue("endDate", offer.getValidUntil() != null ? Date.valueOf(offer.getValidUntil()) : null);
        params.addValue("imageUrl", offer.getImageUrl());
        params.addValue("lat", offer.getLat());
        params.addValue("lng", offer.getLng());
        params.addValue("active", offer.isActive());
        params.addValue("featured", offer.isFeatured());
        params.addValue("createdAt", Timestamp.from(offer.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(offer.getUpdatedAt()));
        return params;
    }
}
