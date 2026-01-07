package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.enums.LotType;
import com.example.myislandapi.model.LotModel;
import com.example.myislandapi.repository.rowmapper.LotRowMapper;
import com.example.myislandapi.util.AuditingUtil;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;

@Repository
public class JdbcLotRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final LotRowMapper rowMapper;

    public JdbcLotRepository(NamedParameterJdbcTemplate jdbc, LotRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<LotModel> findById(UUID id) {
        String sql = "SELECT * FROM lots WHERE id = :id";
        List<LotModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        if (!results.isEmpty()) {
            loadCollections(results);
        }
        return results.stream().findFirst();
    }

    public List<LotModel> findByCampsiteId(UUID campsiteId) {
        String sql = "SELECT * FROM lots WHERE campsite_id = :campsiteId ORDER BY name";
        List<LotModel> results = jdbc.query(sql, Map.of("campsiteId", campsiteId), rowMapper);
        loadCollections(results);
        return results;
    }

    public List<LotModel> findByCampsiteIdAndAvailableTrue(UUID campsiteId) {
        String sql = "SELECT * FROM lots WHERE campsite_id = :campsiteId AND available = true ORDER BY name";
        List<LotModel> results = jdbc.query(sql, Map.of("campsiteId", campsiteId), rowMapper);
        loadCollections(results);
        return results;
    }

    public List<LotModel> findByCampsiteIdAndType(UUID campsiteId, LotType type) {
        String sql = "SELECT * FROM lots WHERE campsite_id = :campsiteId AND type = :type ORDER BY name";
        List<LotModel> results = jdbc.query(sql, Map.of("campsiteId", campsiteId, "type", type.name()), rowMapper);
        loadCollections(results);
        return results;
    }

    public List<LotModel> findByCampsiteIdAndTypeAndAvailableTrueOrderByPricePerNightAsc(UUID campsiteId, LotType type) {
        String sql = "SELECT * FROM lots WHERE campsite_id = :campsiteId AND type = :type AND available = true ORDER BY price_per_night ASC";
        List<LotModel> results = jdbc.query(sql, Map.of("campsiteId", campsiteId, "type", type.name()), rowMapper);
        loadCollections(results);
        return results;
    }

    @Transactional
    public LotModel save(LotModel lot) {
        if (lot.getId() == null) {
            return insert(lot);
        } else {
            return update(lot);
        }
    }

    private LotModel insert(LotModel lot) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(lot.getId(), lot.getCreatedAt());
        lot.setId(audit.id());
        lot.setCreatedAt(audit.createdAt());
        lot.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at)
            VALUES (:id, :campsiteId, :name, :type, :capacity, :pricePerNight, :available, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(lot));
        saveCollections(lot);
        return lot;
    }

    private LotModel update(LotModel lot) {
        lot.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE lots SET
                campsite_id = :campsiteId, name = :name, type = :type, capacity = :capacity,
                price_per_night = :pricePerNight, available = :available, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(lot));
        saveCollections(lot);
        return lot;
    }

    public boolean existsById(UUID id) {
        String sql = "SELECT COUNT(*) FROM lots WHERE id = :id";
        Integer count = jdbc.queryForObject(sql, Map.of("id", id), Integer.class);
        return count != null && count > 0;
    }

    @Transactional
    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM lot_images WHERE lot_id = :id", Map.of("id", id));
        jdbc.update("DELETE FROM lot_amenities WHERE lot_id = :id", Map.of("id", id));
        jdbc.update("DELETE FROM lots WHERE id = :id", Map.of("id", id));
    }

    private void loadCollections(List<LotModel> lots) {
        if (lots.isEmpty()) return;

        List<UUID> ids = lots.stream().map(LotModel::getId).toList();

        // Load images
        Map<UUID, List<String>> imagesMap = loadImagesForLots(ids);
        // Load amenities
        Map<UUID, List<String>> amenitiesMap = loadAmenitiesForLots(ids);

        lots.forEach(l -> {
            l.setImages(imagesMap.getOrDefault(l.getId(), List.of()));
            l.setAmenities(amenitiesMap.getOrDefault(l.getId(), List.of()));
        });
    }

    private Map<UUID, List<String>> loadImagesForLots(List<UUID> ids) {
        String sql = "SELECT lot_id, image_url FROM lot_images WHERE lot_id IN (:ids)";
        Map<UUID, List<String>> result = new HashMap<>();
        jdbc.query(sql, Map.of("ids", ids), rs -> {
            UUID lotId = UUID.fromString(rs.getString("lot_id"));
            String imageUrl = rs.getString("image_url");
            result.computeIfAbsent(lotId, k -> new ArrayList<>()).add(imageUrl);
        });
        return result;
    }

    private Map<UUID, List<String>> loadAmenitiesForLots(List<UUID> ids) {
        String sql = "SELECT lot_id, amenity FROM lot_amenities WHERE lot_id IN (:ids)";
        Map<UUID, List<String>> result = new HashMap<>();
        jdbc.query(sql, Map.of("ids", ids), rs -> {
            UUID lotId = UUID.fromString(rs.getString("lot_id"));
            String amenity = rs.getString("amenity");
            result.computeIfAbsent(lotId, k -> new ArrayList<>()).add(amenity);
        });
        return result;
    }

    @Transactional
    private void saveCollections(LotModel lot) {
        UUID id = lot.getId();

        // Delete existing
        jdbc.update("DELETE FROM lot_images WHERE lot_id = :id", Map.of("id", id));
        jdbc.update("DELETE FROM lot_amenities WHERE lot_id = :id", Map.of("id", id));

        // Insert images
        if (lot.getImages() != null) {
            for (String imageUrl : lot.getImages()) {
                jdbc.update("INSERT INTO lot_images (lot_id, image_url) VALUES (:id, :url)",
                    Map.of("id", id, "url", imageUrl));
            }
        }

        // Insert amenities
        if (lot.getAmenities() != null) {
            for (String amenity : lot.getAmenities()) {
                jdbc.update("INSERT INTO lot_amenities (lot_id, amenity) VALUES (:id, :amenity)",
                    Map.of("id", id, "amenity", amenity));
            }
        }
    }

    private MapSqlParameterSource toParameterSource(LotModel lot) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", lot.getId());
        params.addValue("campsiteId", lot.getCampsiteId());
        params.addValue("name", lot.getName());
        params.addValue("type", lot.getType() != null ? lot.getType().name() : null);
        params.addValue("capacity", lot.getCapacity());
        params.addValue("pricePerNight", lot.getPricePerNight());
        params.addValue("available", lot.isAvailable());
        params.addValue("createdAt", Timestamp.from(lot.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(lot.getUpdatedAt()));
        return params;
    }
}
