package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.model.MessageModel;
import com.example.myislandapi.repository.rowmapper.MessageRowMapper;
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
public class JdbcMessageRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final MessageRowMapper rowMapper;

    public JdbcMessageRepository(NamedParameterJdbcTemplate jdbc, MessageRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<MessageModel> findById(UUID id) {
        String sql = "SELECT * FROM messages WHERE id = :id";
        List<MessageModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        return results.stream().findFirst();
    }

    public Page<MessageModel> findByBookingIdOrderByCreatedAtDesc(UUID bookingId, Pageable pageable) {
        String sql = "SELECT * FROM messages WHERE booking_id = :bookingId ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<MessageModel> content = jdbc.query(sql,
            Map.of("bookingId", bookingId, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);

        String countSql = "SELECT COUNT(*) FROM messages WHERE booking_id = :bookingId";
        Long total = jdbc.queryForObject(countSql, Map.of("bookingId", bookingId), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public List<MessageModel> findByBookingIdOrderByCreatedAtAsc(UUID bookingId) {
        String sql = "SELECT * FROM messages WHERE booking_id = :bookingId ORDER BY created_at ASC";
        return jdbc.query(sql, Map.of("bookingId", bookingId), rowMapper);
    }

    public int countUnreadForBooking(UUID bookingId, UUID userId) {
        String sql = "SELECT COUNT(*) FROM messages WHERE booking_id = :bookingId AND sender_id != :userId AND is_read = false";
        Integer count = jdbc.queryForObject(sql, Map.of("bookingId", bookingId, "userId", userId), Integer.class);
        return count != null ? count : 0;
    }

    public MessageModel save(MessageModel message) {
        if (message.getId() == null) {
            return insert(message);
        } else {
            return update(message);
        }
    }

    private MessageModel insert(MessageModel message) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(message.getId(), message.getCreatedAt());
        message.setId(audit.id());
        message.setCreatedAt(audit.createdAt());
        message.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO messages (id, booking_id, sender_id, content, is_read, created_at, updated_at)
            VALUES (:id, :bookingId, :senderId, :content, :isRead, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(message));
        return message;
    }

    private MessageModel update(MessageModel message) {
        message.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE messages SET
                booking_id = :bookingId, sender_id = :senderId, content = :content, is_read = :isRead, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(message));
        return message;
    }

    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM messages WHERE id = :id", Map.of("id", id));
    }

    private MapSqlParameterSource toParameterSource(MessageModel message) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", message.getId());
        params.addValue("bookingId", message.getBookingId());
        params.addValue("senderId", message.getSenderId());
        params.addValue("content", message.getContent());
        params.addValue("isRead", message.isRead());
        params.addValue("createdAt", Timestamp.from(message.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(message.getUpdatedAt()));
        return params;
    }
}
