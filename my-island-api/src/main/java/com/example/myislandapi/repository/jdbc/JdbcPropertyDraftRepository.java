package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.model.PropertyDraftModel;
import com.example.myislandapi.repository.rowmapper.PropertyDraftRowMapper;
import com.example.myislandapi.util.AuditingUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.sql.Types;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JdbcPropertyDraftRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final PropertyDraftRowMapper rowMapper;
    private final ObjectMapper objectMapper;

    public JdbcPropertyDraftRepository(NamedParameterJdbcTemplate jdbc, PropertyDraftRowMapper rowMapper, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
        this.objectMapper = objectMapper;
    }

    public Optional<PropertyDraftModel> findById(UUID id) {
        String sql = "SELECT * FROM property_drafts WHERE id = :id";
        List<PropertyDraftModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        return results.stream().findFirst();
    }

    public Optional<PropertyDraftModel> findByOwnerId(UUID ownerId) {
        String sql = "SELECT * FROM property_drafts WHERE owner_id = :ownerId";
        List<PropertyDraftModel> results = jdbc.query(sql, Map.of("ownerId", ownerId), rowMapper);
        return results.stream().findFirst();
    }

    public boolean existsByOwnerId(UUID ownerId) {
        String sql = "SELECT COUNT(*) FROM property_drafts WHERE owner_id = :ownerId";
        Integer count = jdbc.queryForObject(sql, Map.of("ownerId", ownerId), Integer.class);
        return count != null && count > 0;
    }

    public void deleteByOwnerId(UUID ownerId) {
        jdbc.update("DELETE FROM property_drafts WHERE owner_id = :ownerId", Map.of("ownerId", ownerId));
    }

    public PropertyDraftModel save(PropertyDraftModel draft) {
        if (draft.getId() == null) {
            return insert(draft);
        } else {
            return update(draft);
        }
    }

    private PropertyDraftModel insert(PropertyDraftModel draft) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(draft.getId(), draft.getCreatedAt());
        draft.setId(audit.id());
        draft.setCreatedAt(audit.createdAt());
        draft.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO property_drafts (id, owner_id, current_step, data, created_at, updated_at)
            VALUES (:id, :ownerId, :currentStep, :data::jsonb, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(draft));
        return draft;
    }

    private PropertyDraftModel update(PropertyDraftModel draft) {
        draft.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE property_drafts SET
                owner_id = :ownerId, current_step = :currentStep, data = :data::jsonb, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(draft));
        return draft;
    }

    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM property_drafts WHERE id = :id", Map.of("id", id));
    }

    private MapSqlParameterSource toParameterSource(PropertyDraftModel draft) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", draft.getId());
        params.addValue("ownerId", draft.getOwnerId());
        params.addValue("currentStep", draft.getCurrentStep());

        // Serialize data to JSON
        String dataJson = null;
        if (draft.getData() != null) {
            try {
                dataJson = objectMapper.writeValueAsString(draft.getData());
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize property draft data", e);
            }
        }
        params.addValue("data", dataJson, Types.OTHER);

        params.addValue("createdAt", Timestamp.from(draft.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(draft.getUpdatedAt()));
        return params;
    }
}
