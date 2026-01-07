package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.enums.TicketStatus;
import com.example.myislandapi.model.SupportTicketModel;
import com.example.myislandapi.model.TicketMessageModel;
import com.example.myislandapi.repository.rowmapper.SupportTicketRowMapper;
import com.example.myislandapi.util.AuditingUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;

@Repository
public class JdbcSupportTicketRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final SupportTicketRowMapper rowMapper;

    public JdbcSupportTicketRepository(NamedParameterJdbcTemplate jdbc, SupportTicketRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<SupportTicketModel> findById(UUID id) {
        String sql = "SELECT * FROM support_tickets WHERE id = :id";
        List<SupportTicketModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        if (!results.isEmpty()) {
            loadMessages(results);
        }
        return results.stream().findFirst();
    }

    public Page<SupportTicketModel> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable) {
        String sql = "SELECT * FROM support_tickets WHERE user_id = :userId ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<SupportTicketModel> content = jdbc.query(sql,
            Map.of("userId", userId, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadMessages(content);

        String countSql = "SELECT COUNT(*) FROM support_tickets WHERE user_id = :userId";
        Long total = jdbc.queryForObject(countSql, Map.of("userId", userId), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<SupportTicketModel> findByUserIdAndStatusOrderByCreatedAtDesc(UUID userId, TicketStatus status, Pageable pageable) {
        String sql = "SELECT * FROM support_tickets WHERE user_id = :userId AND status = :status ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<SupportTicketModel> content = jdbc.query(sql,
            Map.of("userId", userId, "status", status.name(), "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadMessages(content);

        String countSql = "SELECT COUNT(*) FROM support_tickets WHERE user_id = :userId AND status = :status";
        Long total = jdbc.queryForObject(countSql, Map.of("userId", userId, "status", status.name()), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    @Transactional
    public SupportTicketModel save(SupportTicketModel ticket) {
        if (ticket.getId() == null) {
            return insert(ticket);
        } else {
            return update(ticket);
        }
    }

    private SupportTicketModel insert(SupportTicketModel ticket) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(ticket.getId(), ticket.getCreatedAt());
        ticket.setId(audit.id());
        ticket.setCreatedAt(audit.createdAt());
        ticket.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO support_tickets (id, user_id, subject, status, created_at, updated_at)
            VALUES (:id, :userId, :subject, :status, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(ticket));
        saveMessages(ticket);
        return ticket;
    }

    private SupportTicketModel update(SupportTicketModel ticket) {
        ticket.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE support_tickets SET
                user_id = :userId, subject = :subject, status = :status, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(ticket));
        saveMessages(ticket);
        return ticket;
    }

    @Transactional
    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM ticket_messages WHERE ticket_id = :id", Map.of("id", id));
        jdbc.update("DELETE FROM support_tickets WHERE id = :id", Map.of("id", id));
    }

    private void loadMessages(List<SupportTicketModel> tickets) {
        if (tickets.isEmpty()) return;

        List<UUID> ids = tickets.stream().map(SupportTicketModel::getId).toList();
        String sql = "SELECT * FROM ticket_messages WHERE ticket_id IN (:ids) ORDER BY created_at ASC";

        Map<UUID, List<TicketMessageModel>> messagesMap = new HashMap<>();
        jdbc.query(sql, Map.of("ids", ids), rs -> {
            TicketMessageModel message = new TicketMessageModel();
            message.setId(UUID.fromString(rs.getString("id")));
            message.setTicketId(UUID.fromString(rs.getString("ticket_id")));
            message.setSenderId(UUID.fromString(rs.getString("sender_id")));
            message.setContent(rs.getString("content"));
            message.setStaffReply(rs.getBoolean("from_support"));
            message.setCreatedAt(rs.getTimestamp("created_at").toInstant());
            message.setUpdatedAt(rs.getTimestamp("updated_at").toInstant());
            messagesMap.computeIfAbsent(message.getTicketId(), k -> new ArrayList<>()).add(message);
        });

        tickets.forEach(t -> t.setMessages(messagesMap.getOrDefault(t.getId(), List.of())));
    }

    @Transactional
    private void saveMessages(SupportTicketModel ticket) {
        UUID id = ticket.getId();

        // Delete existing messages (orphan removal)
        jdbc.update("DELETE FROM ticket_messages WHERE ticket_id = :id", Map.of("id", id));

        if (ticket.getMessages() != null && !ticket.getMessages().isEmpty()) {
            String sql = """
                INSERT INTO ticket_messages (id, ticket_id, sender_id, content, from_support, created_at, updated_at)
                VALUES (:id, :ticketId, :senderId, :content, :fromSupport, :createdAt, :updatedAt)
                """;

            for (TicketMessageModel message : ticket.getMessages()) {
                if (message.getId() == null) {
                    message.setId(UUID.randomUUID());
                    message.setCreatedAt(AuditingUtil.now());
                }
                message.setTicketId(ticket.getId());
                message.setUpdatedAt(AuditingUtil.now());

                MapSqlParameterSource params = new MapSqlParameterSource();
                params.addValue("id", message.getId());
                params.addValue("ticketId", message.getTicketId());
                params.addValue("senderId", message.getSenderId());
                params.addValue("content", message.getContent());
                params.addValue("fromSupport", message.isStaffReply());
                params.addValue("createdAt", Timestamp.from(message.getCreatedAt()));
                params.addValue("updatedAt", Timestamp.from(message.getUpdatedAt()));
                jdbc.update(sql, params);
            }
        }
    }

    private MapSqlParameterSource toParameterSource(SupportTicketModel ticket) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", ticket.getId());
        params.addValue("userId", ticket.getUserId());
        params.addValue("subject", ticket.getSubject());
        params.addValue("status", ticket.getStatus() != null ? ticket.getStatus().name() : TicketStatus.OPEN.name());
        params.addValue("createdAt", Timestamp.from(ticket.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(ticket.getUpdatedAt()));
        return params;
    }
}
