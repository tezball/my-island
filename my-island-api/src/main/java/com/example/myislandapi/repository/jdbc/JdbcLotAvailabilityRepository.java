package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.enums.AvailabilityStatus;
import com.example.myislandapi.model.LotAvailabilityModel;
import com.example.myislandapi.repository.rowmapper.LotAvailabilityRowMapper;
import com.example.myislandapi.util.AuditingUtil;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JdbcLotAvailabilityRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final LotAvailabilityRowMapper rowMapper;

    public JdbcLotAvailabilityRepository(NamedParameterJdbcTemplate jdbc, LotAvailabilityRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<LotAvailabilityModel> findById(UUID id) {
        String sql = "SELECT * FROM lot_availability WHERE id = :id";
        List<LotAvailabilityModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        return results.stream().findFirst();
    }

    public List<LotAvailabilityModel> findByLotIdAndDateBetween(UUID lotId, LocalDate startDate, LocalDate endDate) {
        String sql = "SELECT * FROM lot_availability WHERE lot_id = :lotId AND date BETWEEN :startDate AND :endDate ORDER BY date";
        return jdbc.query(sql,
            Map.of("lotId", lotId, "startDate", Date.valueOf(startDate), "endDate", Date.valueOf(endDate)), rowMapper);
    }

    public Optional<LotAvailabilityModel> findByLotIdAndDate(UUID lotId, LocalDate date) {
        String sql = "SELECT * FROM lot_availability WHERE lot_id = :lotId AND date = :date";
        List<LotAvailabilityModel> results = jdbc.query(sql,
            Map.of("lotId", lotId, "date", Date.valueOf(date)), rowMapper);
        return results.stream().findFirst();
    }

    public List<LotAvailabilityModel> findUnavailableDates(UUID lotId, LocalDate startDate, LocalDate endDate, AvailabilityStatus status) {
        String sql = """
            SELECT * FROM lot_availability
            WHERE lot_id = :lotId
            AND date BETWEEN :startDate AND :endDate
            AND status != :status
            ORDER BY date
            """;
        return jdbc.query(sql,
            Map.of("lotId", lotId, "startDate", Date.valueOf(startDate), "endDate", Date.valueOf(endDate), "status", status.name()), rowMapper);
    }

    public void deleteByBookingId(UUID bookingId) {
        jdbc.update("DELETE FROM lot_availability WHERE booking_id = :bookingId", Map.of("bookingId", bookingId));
    }

    public List<LotAvailabilityModel> findByBookingId(UUID bookingId) {
        String sql = "SELECT * FROM lot_availability WHERE booking_id = :bookingId ORDER BY date";
        return jdbc.query(sql, Map.of("bookingId", bookingId), rowMapper);
    }

    public LotAvailabilityModel save(LotAvailabilityModel availability) {
        if (availability.getId() == null) {
            return insert(availability);
        } else {
            return update(availability);
        }
    }

    private LotAvailabilityModel insert(LotAvailabilityModel availability) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(availability.getId(), availability.getCreatedAt());
        availability.setId(audit.id());
        availability.setCreatedAt(audit.createdAt());
        availability.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO lot_availability (id, lot_id, date, status, price_override, booking_id, created_at, updated_at)
            VALUES (:id, :lotId, :date, :status, :priceOverride, :bookingId, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(availability));
        return availability;
    }

    private LotAvailabilityModel update(LotAvailabilityModel availability) {
        availability.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE lot_availability SET
                lot_id = :lotId, date = :date, status = :status, price_override = :priceOverride,
                booking_id = :bookingId, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(availability));
        return availability;
    }

    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM lot_availability WHERE id = :id", Map.of("id", id));
    }

    private MapSqlParameterSource toParameterSource(LotAvailabilityModel availability) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", availability.getId());
        params.addValue("lotId", availability.getLotId());
        params.addValue("date", Date.valueOf(availability.getDate()));
        params.addValue("status", availability.getStatus() != null ? availability.getStatus().name() : AvailabilityStatus.AVAILABLE.name());
        params.addValue("priceOverride", availability.getPriceOverride());
        params.addValue("bookingId", availability.getBookingId());
        params.addValue("createdAt", Timestamp.from(availability.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(availability.getUpdatedAt()));
        return params;
    }
}
