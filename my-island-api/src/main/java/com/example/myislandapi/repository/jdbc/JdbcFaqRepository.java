package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.model.FaqModel;
import com.example.myislandapi.repository.rowmapper.FaqRowMapper;
import com.example.myislandapi.util.AuditingUtil;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JdbcFaqRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final FaqRowMapper rowMapper;

    public JdbcFaqRepository(NamedParameterJdbcTemplate jdbc, FaqRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<FaqModel> findById(UUID id) {
        String sql = "SELECT * FROM faqs WHERE id = :id";
        List<FaqModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        return results.stream().findFirst();
    }

    public List<FaqModel> findAll() {
        String sql = "SELECT * FROM faqs ORDER BY created_at DESC";
        return jdbc.query(sql, rowMapper);
    }

    public List<FaqModel> findByActiveTrueOrderBySortOrderAsc() {
        String sql = "SELECT * FROM faqs WHERE active = true ORDER BY sort_order ASC";
        return jdbc.query(sql, rowMapper);
    }

    public List<FaqModel> findByActiveTrueAndCategoryOrderBySortOrderAsc(String category) {
        String sql = "SELECT * FROM faqs WHERE active = true AND category = :category ORDER BY sort_order ASC";
        return jdbc.query(sql, Map.of("category", category), rowMapper);
    }

    public FaqModel save(FaqModel faq) {
        if (faq.getId() == null) {
            return insert(faq);
        } else {
            return update(faq);
        }
    }

    private FaqModel insert(FaqModel faq) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(faq.getId(), faq.getCreatedAt());
        faq.setId(audit.id());
        faq.setCreatedAt(audit.createdAt());
        faq.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO faqs (id, question, answer, category, sort_order, active, created_at, updated_at)
            VALUES (:id, :question, :answer, :category, :sortOrder, :active, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(faq));
        return faq;
    }

    private FaqModel update(FaqModel faq) {
        faq.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE faqs
            SET question = :question, answer = :answer, category = :category,
                sort_order = :sortOrder, active = :active, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(faq));
        return faq;
    }

    public void deleteById(UUID id) {
        String sql = "DELETE FROM faqs WHERE id = :id";
        jdbc.update(sql, Map.of("id", id));
    }

    public boolean existsById(UUID id) {
        String sql = "SELECT COUNT(*) FROM faqs WHERE id = :id";
        Integer count = jdbc.queryForObject(sql, Map.of("id", id), Integer.class);
        return count != null && count > 0;
    }

    public long count() {
        String sql = "SELECT COUNT(*) FROM faqs";
        Long count = jdbc.queryForObject(sql, Map.of(), Long.class);
        return count != null ? count : 0L;
    }

    private MapSqlParameterSource toParameterSource(FaqModel faq) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", faq.getId());
        params.addValue("question", faq.getQuestion());
        params.addValue("answer", faq.getAnswer());
        params.addValue("category", faq.getCategory());
        params.addValue("sortOrder", faq.getSortOrder());
        params.addValue("active", faq.isActive());
        params.addValue("createdAt", Timestamp.from(faq.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(faq.getUpdatedAt()));
        return params;
    }
}
