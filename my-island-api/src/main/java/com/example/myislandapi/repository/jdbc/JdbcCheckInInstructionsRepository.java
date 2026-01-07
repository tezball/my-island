package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.model.CheckInInstructionsModel;
import com.example.myislandapi.repository.rowmapper.CheckInInstructionsRowMapper;
import com.example.myislandapi.util.AuditingUtil;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;

@Repository
public class JdbcCheckInInstructionsRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final CheckInInstructionsRowMapper rowMapper;

    public JdbcCheckInInstructionsRepository(NamedParameterJdbcTemplate jdbc, CheckInInstructionsRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<CheckInInstructionsModel> findById(UUID id) {
        String sql = "SELECT * FROM check_in_instructions WHERE id = :id";
        List<CheckInInstructionsModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        if (!results.isEmpty()) {
            loadRules(results);
        }
        return results.stream().findFirst();
    }

    public Optional<CheckInInstructionsModel> findByCampsiteId(UUID campsiteId) {
        String sql = "SELECT * FROM check_in_instructions WHERE campsite_id = :campsiteId";
        List<CheckInInstructionsModel> results = jdbc.query(sql, Map.of("campsiteId", campsiteId), rowMapper);
        if (!results.isEmpty()) {
            loadRules(results);
        }
        return results.stream().findFirst();
    }

    @Transactional
    public CheckInInstructionsModel save(CheckInInstructionsModel instructions) {
        if (instructions.getId() == null) {
            return insert(instructions);
        } else {
            return update(instructions);
        }
    }

    private CheckInInstructionsModel insert(CheckInInstructionsModel instructions) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(instructions.getId(), instructions.getCreatedAt());
        instructions.setId(audit.id());
        instructions.setCreatedAt(audit.createdAt());
        instructions.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO check_in_instructions (id, campsite_id, check_in_time, check_out_time, instructions, created_at, updated_at)
            VALUES (:id, :campsiteId, :checkInTime, :checkOutTime, :instructions, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(instructions));
        saveRules(instructions);
        return instructions;
    }

    private CheckInInstructionsModel update(CheckInInstructionsModel instructions) {
        instructions.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE check_in_instructions SET
                campsite_id = :campsiteId, check_in_time = :checkInTime, check_out_time = :checkOutTime,
                instructions = :instructions, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(instructions));
        saveRules(instructions);
        return instructions;
    }

    @Transactional
    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM check_in_rules WHERE check_in_instructions_id = :id", Map.of("id", id));
        jdbc.update("DELETE FROM check_in_instructions WHERE id = :id", Map.of("id", id));
    }

    private void loadRules(List<CheckInInstructionsModel> instructionsList) {
        if (instructionsList.isEmpty()) return;

        List<UUID> ids = instructionsList.stream().map(CheckInInstructionsModel::getId).toList();
        String sql = "SELECT check_in_instructions_id, rule FROM check_in_rules WHERE check_in_instructions_id IN (:ids)";

        Map<UUID, List<String>> rulesMap = new HashMap<>();
        jdbc.query(sql, Map.of("ids", ids), rs -> {
            UUID instructionsId = UUID.fromString(rs.getString("check_in_instructions_id"));
            String rule = rs.getString("rule");
            rulesMap.computeIfAbsent(instructionsId, k -> new ArrayList<>()).add(rule);
        });

        instructionsList.forEach(i -> i.setRules(rulesMap.getOrDefault(i.getId(), List.of())));
    }

    @Transactional
    private void saveRules(CheckInInstructionsModel instructions) {
        UUID id = instructions.getId();
        jdbc.update("DELETE FROM check_in_rules WHERE check_in_instructions_id = :id", Map.of("id", id));

        if (instructions.getRules() != null && !instructions.getRules().isEmpty()) {
            String sql = "INSERT INTO check_in_rules (check_in_instructions_id, rule) VALUES (:id, :rule)";
            for (String rule : instructions.getRules()) {
                jdbc.update(sql, Map.of("id", id, "rule", rule));
            }
        }
    }

    private MapSqlParameterSource toParameterSource(CheckInInstructionsModel instructions) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", instructions.getId());
        params.addValue("campsiteId", instructions.getCampsiteId());
        params.addValue("checkInTime", instructions.getCheckInTime());
        params.addValue("checkOutTime", instructions.getCheckOutTime());
        params.addValue("instructions", instructions.getInstructions());
        params.addValue("createdAt", Timestamp.from(instructions.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(instructions.getUpdatedAt()));
        return params;
    }
}
