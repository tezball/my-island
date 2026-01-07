package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.model.FaqModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class FaqRowMapper implements RowMapper<FaqModel> {

    @Override
    public FaqModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        FaqModel faq = new FaqModel();
        faq.setId(UUID.fromString(rs.getString("id")));
        faq.setQuestion(rs.getString("question"));
        faq.setAnswer(rs.getString("answer"));
        faq.setCategory(rs.getString("category"));
        faq.setSortOrder(rs.getInt("sort_order"));
        faq.setActive(rs.getBoolean("active"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            faq.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            faq.setUpdatedAt(updatedAt.toInstant());
        }

        return faq;
    }
}
