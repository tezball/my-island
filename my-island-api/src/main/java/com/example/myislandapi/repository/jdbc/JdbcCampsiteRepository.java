package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.enums.Facility;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.Location;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.repository.rowmapper.CampsiteRowMapper;
import com.example.myislandapi.repository.rowmapper.UserRowMapper;
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
import java.util.stream.Collectors;

@Repository
public class JdbcCampsiteRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final CampsiteRowMapper rowMapper;
    private final UserRowMapper userRowMapper;

    public JdbcCampsiteRepository(NamedParameterJdbcTemplate jdbc, CampsiteRowMapper rowMapper, UserRowMapper userRowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
        this.userRowMapper = userRowMapper;
    }

    public Optional<CampsiteModel> findById(UUID id) {
        String sql = "SELECT * FROM campsites WHERE id = :id";
        List<CampsiteModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        if (!results.isEmpty()) {
            loadCollections(results);
            loadOwners(results);
        }
        return results.stream().findFirst();
    }

    public Optional<CampsiteModel> findByIdAndOwnerId(UUID id, UUID ownerId) {
        String sql = "SELECT * FROM campsites WHERE id = :id AND owner_id = :ownerId";
        List<CampsiteModel> results = jdbc.query(sql, Map.of("id", id, "ownerId", ownerId), rowMapper);
        if (!results.isEmpty()) {
            loadCollections(results);
        }
        return results.stream().findFirst();
    }

    public Page<CampsiteModel> findByActiveTrue(Pageable pageable) {
        String sql = "SELECT * FROM campsites WHERE active = true ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<CampsiteModel> content = jdbc.query(sql,
            Map.of("limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadCollections(content);
        loadOwners(content);

        long total = countByActiveTrue();
        return new PageImpl<>(content, pageable, total);
    }

    public Page<CampsiteModel> findByActiveTrueAndFeaturedTrue(Pageable pageable) {
        String sql = "SELECT * FROM campsites WHERE active = true AND featured = true ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<CampsiteModel> content = jdbc.query(sql,
            Map.of("limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadCollections(content);
        loadOwners(content);

        long total = countByActiveTrueAndFeaturedTrue();
        return new PageImpl<>(content, pageable, total);
    }

    public Page<CampsiteModel> findByCounty(String county, Pageable pageable) {
        String sql = "SELECT * FROM campsites WHERE active = true AND county = :county ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<CampsiteModel> content = jdbc.query(sql,
            Map.of("county", county, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadCollections(content);
        loadOwners(content);

        String countSql = "SELECT COUNT(*) FROM campsites WHERE active = true AND county = :county";
        Long total = jdbc.queryForObject(countSql, Map.of("county", county), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<CampsiteModel> searchByText(String county, String search, Pageable pageable) {
        String searchPattern = search != null ? "%" + search.toLowerCase() + "%" : null;

        StringBuilder sql = new StringBuilder("SELECT * FROM campsites WHERE active = true");
        Map<String, Object> params = new HashMap<>();
        params.put("limit", pageable.getPageSize());
        params.put("offset", pageable.getOffset());

        if (county != null) {
            sql.append(" AND county = :county");
            params.put("county", county);
        }
        if (search != null) {
            sql.append(" AND (LOWER(name) LIKE :search OR LOWER(county) LIKE :search OR LOWER(address) LIKE :search OR LOWER(description) LIKE :search)");
            params.put("search", searchPattern);
        }
        sql.append(" ORDER BY created_at DESC LIMIT :limit OFFSET :offset");

        List<CampsiteModel> content = jdbc.query(sql.toString(), params, rowMapper);
        loadCollections(content);
        loadOwners(content);

        // Count query
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM campsites WHERE active = true");
        if (county != null) {
            countSql.append(" AND county = :county");
        }
        if (search != null) {
            countSql.append(" AND (LOWER(name) LIKE :search OR LOWER(county) LIKE :search OR LOWER(address) LIKE :search OR LOWER(description) LIKE :search)");
        }
        Long total = jdbc.queryForObject(countSql.toString(), params, Long.class);

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<CampsiteModel> searchWithFacilities(String county, String search, Set<Facility> facilities, long facilityCount, Pageable pageable) {
        String searchPattern = search != null ? "%" + search.toLowerCase() + "%" : null;
        List<String> facilityNames = facilities.stream().map(Enum::name).toList();

        StringBuilder sql = new StringBuilder("""
            SELECT DISTINCT c.* FROM campsites c
            WHERE c.active = true
            AND c.id IN (
                SELECT campsite_id FROM campsite_facilities
                WHERE facility IN (:facilities)
                GROUP BY campsite_id
                HAVING COUNT(DISTINCT facility) >= :facilityCount
            )
            """);

        Map<String, Object> params = new HashMap<>();
        params.put("facilities", facilityNames);
        params.put("facilityCount", facilityCount);
        params.put("limit", pageable.getPageSize());
        params.put("offset", pageable.getOffset());

        if (county != null) {
            sql.append(" AND c.county = :county");
            params.put("county", county);
        }
        if (search != null) {
            sql.append(" AND (LOWER(c.name) LIKE :search OR LOWER(c.county) LIKE :search OR LOWER(c.address) LIKE :search OR LOWER(c.description) LIKE :search)");
            params.put("search", searchPattern);
        }
        sql.append(" ORDER BY c.created_at DESC LIMIT :limit OFFSET :offset");

        List<CampsiteModel> content = jdbc.query(sql.toString(), params, rowMapper);
        loadCollections(content);
        loadOwners(content);

        // Simplified count for now
        long total = content.size();
        return new PageImpl<>(content, pageable, total);
    }

    public List<CampsiteModel> findByOwnerId(UUID ownerId) {
        String sql = "SELECT * FROM campsites WHERE owner_id = :ownerId ORDER BY created_at DESC";
        List<CampsiteModel> results = jdbc.query(sql, Map.of("ownerId", ownerId), rowMapper);
        loadCollections(results);
        loadOwners(results);
        return results;
    }

    public List<CampsiteModel> findInBoundingBox(double minLat, double maxLat, double minLng, double maxLng) {
        String sql = """
            SELECT * FROM campsites WHERE active = true
            AND latitude BETWEEN :minLat AND :maxLat
            AND longitude BETWEEN :minLng AND :maxLng
            """;
        List<CampsiteModel> results = jdbc.query(sql,
            Map.of("minLat", minLat, "maxLat", maxLat, "minLng", minLng, "maxLng", maxLng), rowMapper);
        loadCollections(results);
        loadOwners(results);
        return results;
    }

    public boolean existsById(UUID id) {
        String sql = "SELECT COUNT(*) FROM campsites WHERE id = :id";
        Integer count = jdbc.queryForObject(sql, Map.of("id", id), Integer.class);
        return count != null && count > 0;
    }

    @Transactional
    public CampsiteModel save(CampsiteModel campsite) {
        if (campsite.getId() == null) {
            return insert(campsite);
        } else {
            return update(campsite);
        }
    }

    private CampsiteModel insert(CampsiteModel campsite) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(campsite.getId(), campsite.getCreatedAt());
        campsite.setId(audit.id());
        campsite.setCreatedAt(audit.createdAt());
        campsite.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO campsites (id, name, description, address, county, latitude, longitude,
                rating, review_count, price_per_night, owner_id, featured, active, created_at, updated_at)
            VALUES (:id, :name, :description, :address, :county, :latitude, :longitude,
                :rating, :reviewCount, :pricePerNight, :ownerId, :featured, :active, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(campsite));
        saveCollections(campsite);
        return campsite;
    }

    private CampsiteModel update(CampsiteModel campsite) {
        campsite.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE campsites SET
                name = :name, description = :description, address = :address, county = :county,
                latitude = :latitude, longitude = :longitude, rating = :rating, review_count = :reviewCount,
                price_per_night = :pricePerNight, owner_id = :ownerId, featured = :featured, active = :active,
                updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(campsite));
        saveCollections(campsite);
        return campsite;
    }

    @Transactional
    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM campsite_images WHERE campsite_id = :id", Map.of("id", id));
        jdbc.update("DELETE FROM campsite_facilities WHERE campsite_id = :id", Map.of("id", id));
        jdbc.update("DELETE FROM campsites WHERE id = :id", Map.of("id", id));
    }

    private long countByActiveTrue() {
        String sql = "SELECT COUNT(*) FROM campsites WHERE active = true";
        Long count = jdbc.queryForObject(sql, Map.of(), Long.class);
        return count != null ? count : 0L;
    }

    private long countByActiveTrueAndFeaturedTrue() {
        String sql = "SELECT COUNT(*) FROM campsites WHERE active = true AND featured = true";
        Long count = jdbc.queryForObject(sql, Map.of(), Long.class);
        return count != null ? count : 0L;
    }

    private void loadCollections(List<CampsiteModel> campsites) {
        if (campsites.isEmpty()) return;

        List<UUID> ids = campsites.stream().map(CampsiteModel::getId).toList();

        // Load images
        Map<UUID, List<String>> imagesMap = loadImagesForCampsites(ids);
        // Load facilities
        Map<UUID, Set<Facility>> facilitiesMap = loadFacilitiesForCampsites(ids);

        campsites.forEach(c -> {
            c.setImages(imagesMap.getOrDefault(c.getId(), List.of()));
            c.setFacilities(facilitiesMap.getOrDefault(c.getId(), Set.of()));
        });
    }

    private Map<UUID, List<String>> loadImagesForCampsites(List<UUID> ids) {
        String sql = "SELECT campsite_id, image_url FROM campsite_images WHERE campsite_id IN (:ids)";
        Map<UUID, List<String>> result = new HashMap<>();
        jdbc.query(sql, Map.of("ids", ids), rs -> {
            UUID campsiteId = UUID.fromString(rs.getString("campsite_id"));
            String imageUrl = rs.getString("image_url");
            result.computeIfAbsent(campsiteId, k -> new ArrayList<>()).add(imageUrl);
        });
        return result;
    }

    private Map<UUID, Set<Facility>> loadFacilitiesForCampsites(List<UUID> ids) {
        String sql = "SELECT campsite_id, facility FROM campsite_facilities WHERE campsite_id IN (:ids)";
        Map<UUID, Set<Facility>> result = new HashMap<>();
        jdbc.query(sql, Map.of("ids", ids), rs -> {
            UUID campsiteId = UUID.fromString(rs.getString("campsite_id"));
            Facility facility = Facility.valueOf(rs.getString("facility"));
            result.computeIfAbsent(campsiteId, k -> new HashSet<>()).add(facility);
        });
        return result;
    }

    private void loadOwners(List<CampsiteModel> campsites) {
        if (campsites.isEmpty()) return;

        Set<UUID> ownerIds = campsites.stream()
            .map(CampsiteModel::getOwnerId)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

        if (ownerIds.isEmpty()) return;

        String sql = "SELECT * FROM users WHERE id IN (:ids)";
        Map<UUID, UserModel> ownersMap = new HashMap<>();
        jdbc.query(sql, Map.of("ids", ownerIds), rs -> {
            UserModel owner = userRowMapper.mapRow(rs, 0);
            ownersMap.put(owner.getId(), owner);
        });

        campsites.forEach(c -> {
            if (c.getOwnerId() != null) {
                c.setOwner(ownersMap.get(c.getOwnerId()));
            }
        });
    }

    @Transactional
    private void saveCollections(CampsiteModel campsite) {
        UUID id = campsite.getId();

        // Delete existing
        jdbc.update("DELETE FROM campsite_images WHERE campsite_id = :id", Map.of("id", id));
        jdbc.update("DELETE FROM campsite_facilities WHERE campsite_id = :id", Map.of("id", id));

        // Insert images
        if (campsite.getImages() != null) {
            for (String imageUrl : campsite.getImages()) {
                jdbc.update("INSERT INTO campsite_images (campsite_id, image_url) VALUES (:id, :url)",
                    Map.of("id", id, "url", imageUrl));
            }
        }

        // Insert facilities
        if (campsite.getFacilities() != null) {
            for (Facility facility : campsite.getFacilities()) {
                jdbc.update("INSERT INTO campsite_facilities (campsite_id, facility) VALUES (:id, :facility)",
                    Map.of("id", id, "facility", facility.name()));
            }
        }
    }

    private MapSqlParameterSource toParameterSource(CampsiteModel campsite) {
        Location loc = campsite.getLocation();

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", campsite.getId());
        params.addValue("name", campsite.getName());
        params.addValue("description", campsite.getDescription());
        params.addValue("address", loc != null ? loc.getAddress() : null);
        params.addValue("county", loc != null ? loc.getCounty() : null);
        params.addValue("latitude", loc != null ? loc.getLat() : null);
        params.addValue("longitude", loc != null ? loc.getLng() : null);
        params.addValue("rating", campsite.getRating());
        params.addValue("reviewCount", campsite.getReviewCount());
        params.addValue("pricePerNight", campsite.getPricePerNight());
        params.addValue("ownerId", campsite.getOwnerId());
        params.addValue("featured", campsite.isFeatured());
        params.addValue("active", campsite.isActive());
        params.addValue("createdAt", Timestamp.from(campsite.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(campsite.getUpdatedAt()));
        return params;
    }
}
