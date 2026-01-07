package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.model.SupplierModel;
import com.example.myislandapi.repository.rowmapper.SupplierRowMapper;
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
public class JdbcSupplierRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final SupplierRowMapper rowMapper;

    public JdbcSupplierRepository(NamedParameterJdbcTemplate jdbc, SupplierRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<SupplierModel> findById(UUID id) {
        String sql = "SELECT * FROM suppliers WHERE id = :id";
        List<SupplierModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        return results.stream().findFirst();
    }

    public Optional<SupplierModel> findByUserId(UUID userId) {
        String sql = "SELECT * FROM suppliers WHERE user_id = :userId";
        List<SupplierModel> results = jdbc.query(sql, Map.of("userId", userId), rowMapper);
        return results.stream().findFirst();
    }

    public boolean existsByUserId(UUID userId) {
        String sql = "SELECT COUNT(*) FROM suppliers WHERE user_id = :userId";
        Integer count = jdbc.queryForObject(sql, Map.of("userId", userId), Integer.class);
        return count != null && count > 0;
    }

    public SupplierModel save(SupplierModel supplier) {
        if (supplier.getId() == null) {
            return insert(supplier);
        } else {
            return update(supplier);
        }
    }

    private SupplierModel insert(SupplierModel supplier) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(supplier.getId(), supplier.getCreatedAt());
        supplier.setId(audit.id());
        supplier.setCreatedAt(audit.createdAt());
        supplier.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO suppliers (id, user_id, business_name, category, description, phone, email,
                website_url, address, county, lat, lng, active, created_at, updated_at)
            VALUES (:id, :userId, :businessName, :category, :description, :phone, :email,
                :websiteUrl, :address, :county, :lat, :lng, :active, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(supplier));
        return supplier;
    }

    private SupplierModel update(SupplierModel supplier) {
        supplier.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE suppliers SET
                user_id = :userId, business_name = :businessName, category = :category, description = :description,
                phone = :phone, email = :email, website_url = :websiteUrl, address = :address,
                county = :county, lat = :lat, lng = :lng, active = :active, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(supplier));
        return supplier;
    }

    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM suppliers WHERE id = :id", Map.of("id", id));
    }

    private MapSqlParameterSource toParameterSource(SupplierModel supplier) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", supplier.getId());
        params.addValue("userId", supplier.getUserId());
        params.addValue("businessName", supplier.getBusinessName());
        params.addValue("category", supplier.getCategory() != null ? supplier.getCategory().name() : null);
        params.addValue("description", supplier.getDescription());
        params.addValue("phone", supplier.getPhone());
        params.addValue("email", supplier.getEmail());
        params.addValue("websiteUrl", supplier.getWebsiteUrl());
        params.addValue("address", supplier.getAddress());
        params.addValue("county", supplier.getCounty());
        params.addValue("lat", supplier.getLat());
        params.addValue("lng", supplier.getLng());
        params.addValue("active", supplier.isActive());
        params.addValue("createdAt", Timestamp.from(supplier.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(supplier.getUpdatedAt()));
        return params;
    }
}
