package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.model.ExtraModel;
import com.example.myislandapi.repository.rowmapper.ExtraRowMapper;
import com.example.myislandapi.util.AuditingUtil;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JdbcExtraRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final ExtraRowMapper rowMapper;

    public JdbcExtraRepository(NamedParameterJdbcTemplate jdbc, ExtraRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<ExtraModel> findById(UUID id) {
        String sql = "SELECT * FROM extras WHERE id = :id";
        List<ExtraModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        return results.stream().findFirst();
    }

    public List<ExtraModel> findByCampsiteIdAndAvailableTrue(UUID campsiteId) {
        String sql = "SELECT * FROM extras WHERE campsite_id = :campsiteId AND available = true ORDER BY created_at";
        return jdbc.query(sql, Map.of("campsiteId", campsiteId), rowMapper);
    }

    public List<ExtraModel> findByCampsiteId(UUID campsiteId) {
        String sql = "SELECT * FROM extras WHERE campsite_id = :campsiteId ORDER BY created_at";
        return jdbc.query(sql, Map.of("campsiteId", campsiteId), rowMapper);
    }

    public List<ExtraModel> findByCampsiteOwnerIdOrderByCreatedAtDesc(UUID ownerId) {
        String sql = """
            SELECT e.* FROM extras e
            JOIN campsites c ON e.campsite_id = c.id
            WHERE c.owner_id = :ownerId
            ORDER BY e.created_at DESC
            """;
        return jdbc.query(sql, Map.of("ownerId", ownerId), rowMapper);
    }

    public List<ExtraModel> findByCampsiteIdAndCampsiteOwnerIdOrderByCreatedAtDesc(UUID campsiteId, UUID ownerId) {
        String sql = """
            SELECT e.* FROM extras e
            JOIN campsites c ON e.campsite_id = c.id
            WHERE e.campsite_id = :campsiteId AND c.owner_id = :ownerId
            ORDER BY e.created_at DESC
            """;
        return jdbc.query(sql, Map.of("campsiteId", campsiteId, "ownerId", ownerId), rowMapper);
    }

    public Optional<ExtraModel> findByIdAndCampsiteOwnerId(UUID id, UUID ownerId) {
        String sql = """
            SELECT e.* FROM extras e
            JOIN campsites c ON e.campsite_id = c.id
            WHERE e.id = :id AND c.owner_id = :ownerId
            """;
        List<ExtraModel> results = jdbc.query(sql, Map.of("id", id, "ownerId", ownerId), rowMapper);
        return results.stream().findFirst();
    }

    public ExtraModel save(ExtraModel extra) {
        if (extra.getId() == null) {
            return insert(extra);
        } else {
            return update(extra);
        }
    }

    private ExtraModel insert(ExtraModel extra) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(extra.getId(), extra.getCreatedAt());
        extra.setId(audit.id());
        extra.setCreatedAt(audit.createdAt());
        extra.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO extras (id, campsite_id, name, description, price, available, image_url, created_at, updated_at)
            VALUES (:id, :campsiteId, :name, :description, :price, :available, :imageUrl, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(extra));
        return extra;
    }

    private ExtraModel update(ExtraModel extra) {
        extra.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE extras SET
                campsite_id = :campsiteId, name = :name, description = :description,
                price = :price, available = :available, image_url = :imageUrl, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(extra));
        return extra;
    }

    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM extras WHERE id = :id", Map.of("id", id));
    }

    private MapSqlParameterSource toParameterSource(ExtraModel extra) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", extra.getId());
        params.addValue("campsiteId", extra.getCampsiteId());
        params.addValue("name", extra.getName());
        params.addValue("description", extra.getDescription());
        params.addValue("price", extra.getPrice());
        params.addValue("available", extra.isAvailable());
        params.addValue("imageUrl", extra.getImageUrl());
        params.addValue("createdAt", Timestamp.from(extra.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(extra.getUpdatedAt()));
        return params;
    }
}
