package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.model.NotificationModel;
import com.example.myislandapi.repository.rowmapper.NotificationRowMapper;
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
public class JdbcNotificationRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final NotificationRowMapper rowMapper;

    public JdbcNotificationRepository(NamedParameterJdbcTemplate jdbc, NotificationRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<NotificationModel> findById(UUID id) {
        String sql = "SELECT * FROM notifications WHERE id = :id";
        List<NotificationModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        return results.stream().findFirst();
    }

    public Page<NotificationModel> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable) {
        String sql = "SELECT * FROM notifications WHERE user_id = :userId ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<NotificationModel> content = jdbc.query(sql,
            Map.of("userId", userId, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);

        String countSql = "SELECT COUNT(*) FROM notifications WHERE user_id = :userId";
        Long total = jdbc.queryForObject(countSql, Map.of("userId", userId), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<NotificationModel> findByUserIdAndReadFalseOrderByCreatedAtDesc(UUID userId, Pageable pageable) {
        String sql = "SELECT * FROM notifications WHERE user_id = :userId AND is_read = false ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<NotificationModel> content = jdbc.query(sql,
            Map.of("userId", userId, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);

        String countSql = "SELECT COUNT(*) FROM notifications WHERE user_id = :userId AND is_read = false";
        Long total = jdbc.queryForObject(countSql, Map.of("userId", userId), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public int countByUserIdAndReadFalse(UUID userId) {
        String sql = "SELECT COUNT(*) FROM notifications WHERE user_id = :userId AND is_read = false";
        Integer count = jdbc.queryForObject(sql, Map.of("userId", userId), Integer.class);
        return count != null ? count : 0;
    }

    public int markAllAsReadByUserId(UUID userId) {
        String sql = "UPDATE notifications SET is_read = true, updated_at = :updatedAt WHERE user_id = :userId AND is_read = false";
        return jdbc.update(sql, Map.of("userId", userId, "updatedAt", Timestamp.from(java.time.Instant.now())));
    }

    public NotificationModel save(NotificationModel notification) {
        if (notification.getId() == null) {
            return insert(notification);
        } else {
            return update(notification);
        }
    }

    private NotificationModel insert(NotificationModel notification) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(notification.getId(), notification.getCreatedAt());
        notification.setId(audit.id());
        notification.setCreatedAt(audit.createdAt());
        notification.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO notifications (id, user_id, type, title, message, is_read, action_url, related_id, created_at, updated_at)
            VALUES (:id, :userId, :type, :title, :message, :isRead, :actionUrl, :relatedId, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(notification));
        return notification;
    }

    private NotificationModel update(NotificationModel notification) {
        notification.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE notifications SET
                user_id = :userId, type = :type, title = :title, message = :message,
                is_read = :isRead, action_url = :actionUrl, related_id = :relatedId, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(notification));
        return notification;
    }

    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM notifications WHERE id = :id", Map.of("id", id));
    }

    private MapSqlParameterSource toParameterSource(NotificationModel notification) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", notification.getId());
        params.addValue("userId", notification.getUserId());
        params.addValue("type", notification.getType() != null ? notification.getType().name() : null);
        params.addValue("title", notification.getTitle());
        params.addValue("message", notification.getMessage());
        params.addValue("isRead", notification.isRead());
        params.addValue("actionUrl", notification.getActionUrl());
        params.addValue("relatedId", notification.getRelatedId());
        params.addValue("createdAt", Timestamp.from(notification.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(notification.getUpdatedAt()));
        return params;
    }
}
