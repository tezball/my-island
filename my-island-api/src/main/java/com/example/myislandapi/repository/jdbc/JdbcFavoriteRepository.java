package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.model.FavoriteModel;
import com.example.myislandapi.repository.rowmapper.FavoriteRowMapper;
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
public class JdbcFavoriteRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final FavoriteRowMapper rowMapper;

    public JdbcFavoriteRepository(NamedParameterJdbcTemplate jdbc, FavoriteRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<FavoriteModel> findById(UUID id) {
        String sql = "SELECT * FROM favorites WHERE id = :id";
        List<FavoriteModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        return results.stream().findFirst();
    }

    public Page<FavoriteModel> findByUserId(UUID userId, Pageable pageable) {
        String sql = "SELECT * FROM favorites WHERE user_id = :userId ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<FavoriteModel> content = jdbc.query(sql,
            Map.of("userId", userId, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);

        String countSql = "SELECT COUNT(*) FROM favorites WHERE user_id = :userId";
        Long total = jdbc.queryForObject(countSql, Map.of("userId", userId), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Optional<FavoriteModel> findByUserIdAndCampsiteId(UUID userId, UUID campsiteId) {
        String sql = "SELECT * FROM favorites WHERE user_id = :userId AND campsite_id = :campsiteId";
        List<FavoriteModel> results = jdbc.query(sql, Map.of("userId", userId, "campsiteId", campsiteId), rowMapper);
        return results.stream().findFirst();
    }

    public boolean existsByUserIdAndCampsiteId(UUID userId, UUID campsiteId) {
        String sql = "SELECT COUNT(*) FROM favorites WHERE user_id = :userId AND campsite_id = :campsiteId";
        Integer count = jdbc.queryForObject(sql, Map.of("userId", userId, "campsiteId", campsiteId), Integer.class);
        return count != null && count > 0;
    }

    public void deleteByUserIdAndCampsiteId(UUID userId, UUID campsiteId) {
        String sql = "DELETE FROM favorites WHERE user_id = :userId AND campsite_id = :campsiteId";
        jdbc.update(sql, Map.of("userId", userId, "campsiteId", campsiteId));
    }

    public FavoriteModel save(FavoriteModel favorite) {
        if (favorite.getId() == null) {
            return insert(favorite);
        } else {
            return update(favorite);
        }
    }

    private FavoriteModel insert(FavoriteModel favorite) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(favorite.getId(), favorite.getCreatedAt());
        favorite.setId(audit.id());
        favorite.setCreatedAt(audit.createdAt());
        favorite.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO favorites (id, user_id, campsite_id, created_at, updated_at)
            VALUES (:id, :userId, :campsiteId, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(favorite));
        return favorite;
    }

    private FavoriteModel update(FavoriteModel favorite) {
        favorite.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE favorites SET user_id = :userId, campsite_id = :campsiteId, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(favorite));
        return favorite;
    }

    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM favorites WHERE id = :id", Map.of("id", id));
    }

    private MapSqlParameterSource toParameterSource(FavoriteModel favorite) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", favorite.getId());
        params.addValue("userId", favorite.getUserId());
        params.addValue("campsiteId", favorite.getCampsiteId());
        params.addValue("createdAt", Timestamp.from(favorite.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(favorite.getUpdatedAt()));
        return params;
    }
}
