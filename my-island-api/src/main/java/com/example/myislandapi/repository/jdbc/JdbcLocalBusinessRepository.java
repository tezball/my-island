package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.enums.SupplierCategory;
import com.example.myislandapi.model.LocalBusinessModel;
import com.example.myislandapi.model.Location;
import com.example.myislandapi.repository.rowmapper.LocalBusinessRowMapper;
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
public class JdbcLocalBusinessRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final LocalBusinessRowMapper rowMapper;

    public JdbcLocalBusinessRepository(NamedParameterJdbcTemplate jdbc, LocalBusinessRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<LocalBusinessModel> findById(UUID id) {
        String sql = "SELECT * FROM local_businesses WHERE id = :id";
        List<LocalBusinessModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        if (!results.isEmpty()) {
            loadImages(results);
        }
        return results.stream().findFirst();
    }

    public Page<LocalBusinessModel> findByActiveTrue(Pageable pageable) {
        String sql = "SELECT * FROM local_businesses WHERE active = true ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<LocalBusinessModel> content = jdbc.query(sql,
            Map.of("limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadImages(content);

        String countSql = "SELECT COUNT(*) FROM local_businesses WHERE active = true";
        Long total = jdbc.queryForObject(countSql, Map.of(), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<LocalBusinessModel> findByActiveTrueAndCategory(SupplierCategory category, Pageable pageable) {
        String sql = "SELECT * FROM local_businesses WHERE active = true AND category = :category ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<LocalBusinessModel> content = jdbc.query(sql,
            Map.of("category", category.name(), "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadImages(content);

        String countSql = "SELECT COUNT(*) FROM local_businesses WHERE active = true AND category = :category";
        Long total = jdbc.queryForObject(countSql, Map.of("category", category.name()), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<LocalBusinessModel> findByActiveTrueAndFeaturedTrue(Pageable pageable) {
        String sql = "SELECT * FROM local_businesses WHERE active = true AND featured = true ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<LocalBusinessModel> content = jdbc.query(sql,
            Map.of("limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadImages(content);

        String countSql = "SELECT COUNT(*) FROM local_businesses WHERE active = true AND featured = true";
        Long total = jdbc.queryForObject(countSql, Map.of(), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<LocalBusinessModel> findByCounty(String county, Pageable pageable) {
        String sql = "SELECT * FROM local_businesses WHERE active = true AND county = :county ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<LocalBusinessModel> content = jdbc.query(sql,
            Map.of("county", county, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadImages(content);

        String countSql = "SELECT COUNT(*) FROM local_businesses WHERE active = true AND county = :county";
        Long total = jdbc.queryForObject(countSql, Map.of("county", county), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public List<LocalBusinessModel> findWithinBounds(double minLat, double maxLat, double minLng, double maxLng) {
        String sql = """
            SELECT * FROM local_businesses
            WHERE active = true
            AND lat BETWEEN :minLat AND :maxLat
            AND lng BETWEEN :minLng AND :maxLng
            """;
        List<LocalBusinessModel> results = jdbc.query(sql,
            Map.of("minLat", minLat, "maxLat", maxLat, "minLng", minLng, "maxLng", maxLng), rowMapper);
        loadImages(results);
        return results;
    }

    public List<LocalBusinessModel> findWithinBoundsAndCategory(SupplierCategory category, double minLat, double maxLat, double minLng, double maxLng) {
        String sql = """
            SELECT * FROM local_businesses
            WHERE active = true AND category = :category
            AND lat BETWEEN :minLat AND :maxLat
            AND lng BETWEEN :minLng AND :maxLng
            """;
        List<LocalBusinessModel> results = jdbc.query(sql,
            Map.of("category", category.name(), "minLat", minLat, "maxLat", maxLat, "minLng", minLng, "maxLng", maxLng), rowMapper);
        loadImages(results);
        return results;
    }

    public List<String> findDistinctCounties() {
        String sql = "SELECT DISTINCT county FROM local_businesses WHERE active = true AND county IS NOT NULL ORDER BY county";
        return jdbc.queryForList(sql, Map.of(), String.class);
    }

    public Page<LocalBusinessModel> searchByNameOrDescription(String search, Pageable pageable) {
        String sql = """
            SELECT * FROM local_businesses
            WHERE active = true
            AND (LOWER(name) LIKE LOWER(:search) OR LOWER(description) LIKE LOWER(:search))
            ORDER BY created_at DESC LIMIT :limit OFFSET :offset
            """;
        String searchPattern = "%" + search + "%";
        List<LocalBusinessModel> content = jdbc.query(sql,
            Map.of("search", searchPattern, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadImages(content);

        String countSql = """
            SELECT COUNT(*) FROM local_businesses
            WHERE active = true
            AND (LOWER(name) LIKE LOWER(:search) OR LOWER(description) LIKE LOWER(:search))
            """;
        Long total = jdbc.queryForObject(countSql, Map.of("search", searchPattern), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    @Transactional
    public LocalBusinessModel save(LocalBusinessModel business) {
        if (business.getId() == null) {
            return insert(business);
        } else {
            return update(business);
        }
    }

    private LocalBusinessModel insert(LocalBusinessModel business) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(business.getId(), business.getCreatedAt());
        business.setId(audit.id());
        business.setCreatedAt(audit.createdAt());
        business.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO local_businesses (id, name, description, category, phone, email, website_url,
                address, county, lat, lng, active, featured, created_at, updated_at)
            VALUES (:id, :name, :description, :category, :phone, :email, :websiteUrl,
                :address, :county, :lat, :lng, :active, :featured, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(business));
        saveImages(business);
        return business;
    }

    private LocalBusinessModel update(LocalBusinessModel business) {
        business.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE local_businesses SET
                name = :name, description = :description, category = :category, phone = :phone,
                email = :email, website_url = :websiteUrl, address = :address, county = :county,
                lat = :lat, lng = :lng, active = :active, featured = :featured, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(business));
        saveImages(business);
        return business;
    }

    @Transactional
    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM local_business_images WHERE local_business_id = :id", Map.of("id", id));
        jdbc.update("DELETE FROM local_businesses WHERE id = :id", Map.of("id", id));
    }

    private void loadImages(List<LocalBusinessModel> businesses) {
        if (businesses.isEmpty()) return;

        List<UUID> ids = businesses.stream().map(LocalBusinessModel::getId).toList();
        String sql = "SELECT local_business_id, image_url FROM local_business_images WHERE local_business_id IN (:ids)";

        Map<UUID, List<String>> imagesMap = new HashMap<>();
        jdbc.query(sql, Map.of("ids", ids), rs -> {
            UUID businessId = UUID.fromString(rs.getString("local_business_id"));
            String imageUrl = rs.getString("image_url");
            imagesMap.computeIfAbsent(businessId, k -> new ArrayList<>()).add(imageUrl);
        });

        businesses.forEach(b -> b.setImages(imagesMap.getOrDefault(b.getId(), List.of())));
    }

    @Transactional
    private void saveImages(LocalBusinessModel business) {
        UUID id = business.getId();
        jdbc.update("DELETE FROM local_business_images WHERE local_business_id = :id", Map.of("id", id));

        if (business.getImages() != null && !business.getImages().isEmpty()) {
            String sql = "INSERT INTO local_business_images (local_business_id, image_url) VALUES (:id, :imageUrl)";
            for (String imageUrl : business.getImages()) {
                jdbc.update(sql, Map.of("id", id, "imageUrl", imageUrl));
            }
        }
    }

    private MapSqlParameterSource toParameterSource(LocalBusinessModel business) {
        Location location = business.getLocation();

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", business.getId());
        params.addValue("name", business.getName());
        params.addValue("description", business.getDescription());
        params.addValue("category", business.getCategory() != null ? business.getCategory().name() : null);
        params.addValue("phone", business.getPhone());
        params.addValue("email", business.getEmail());
        params.addValue("websiteUrl", business.getWebsite());
        params.addValue("address", location != null ? location.getAddress() : null);
        params.addValue("county", location != null ? location.getCounty() : null);
        params.addValue("lat", location != null ? location.getLat() : null);
        params.addValue("lng", location != null ? location.getLng() : null);
        params.addValue("active", business.isActive());
        params.addValue("featured", business.isFeatured());
        params.addValue("createdAt", Timestamp.from(business.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(business.getUpdatedAt()));
        return params;
    }
}
