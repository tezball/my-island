package island.catalog.place;

import island.catalog.api.dto.PlaceResponse;
import island.catalog.api.dto.PlaceResponse.CategoryRef;
import island.catalog.api.dto.PlaceResponse.CountyRef;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class PlaceJdbc {

  private final JdbcClient jdbc;

  public PlaceJdbc(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  public boolean slugExists(String slug) {
    return jdbc.sql("select count(*) from place where slug = :slug")
            .param("slug", slug)
            .query(Integer.class)
            .single()
        > 0;
  }

  public void insert(
      UUID id,
      String slug,
      String name,
      String description,
      String categoryId,
      String countyId,
      String town,
      Double latitude,
      Double longitude,
      boolean published,
      String priceBand,
      String website,
      String phone,
      String sourceUrl,
      String sourceName,
      String licence,
      String leadDedupeKey,
      String imageUrl,
      String imageCredit,
      String imageLicence) {
    jdbc.sql(
            """
            insert into place (
              id, slug, name, description, category_id, county_id, town,
              latitude, longitude, published, partner_id, price_band, website, phone,
              source_url, source_name, licence, lead_dedupe_key,
              image_url, image_credit, image_licence
            ) values (
              :id, :slug, :name, :description, :categoryId, :countyId, :town,
              :latitude, :longitude, :published, null, :priceBand, :website, :phone,
              :sourceUrl, :sourceName, :licence, :leadDedupeKey,
              :imageUrl, :imageCredit, :imageLicence
            )
            """)
        .param("id", id)
        .param("slug", slug)
        .param("name", name)
        .param("description", description)
        .param("categoryId", categoryId)
        .param("countyId", countyId)
        .param("town", town)
        .param("latitude", latitude)
        .param("longitude", longitude)
        .param("published", published)
        .param("priceBand", priceBand)
        .param("website", website)
        .param("phone", phone)
        .param("sourceUrl", sourceUrl)
        .param("sourceName", sourceName)
        .param("licence", licence)
        .param("leadDedupeKey", leadDedupeKey)
        .param("imageUrl", imageUrl)
        .param("imageCredit", imageCredit)
        .param("imageLicence", imageLicence)
        .update();
  }

  public int updateUnpublishedByLeadKey(
      String leadDedupeKey,
      String name,
      String description,
      String categoryId,
      String countyId,
      String town,
      Double latitude,
      Double longitude,
      String priceBand,
      String website,
      String phone,
      String sourceUrl,
      String sourceName,
      String licence,
      String imageUrl,
      String imageCredit,
      String imageLicence,
      Boolean published) {
    return jdbc.sql(
            """
            update place set
              name = :name,
              description = :description,
              category_id = :categoryId,
              county_id = :countyId,
              town = :town,
              latitude = :latitude,
              longitude = :longitude,
              published = coalesce(:published, published),
              price_band = :priceBand,
              website = :website,
              phone = :phone,
              source_url = :sourceUrl,
              source_name = :sourceName,
              licence = :licence,
              image_url = :imageUrl,
              image_credit = :imageCredit,
              image_licence = :imageLicence
            where lead_dedupe_key = :leadDedupeKey
              and (:allowPublished = true or published = false)
            """)
        .param("leadDedupeKey", leadDedupeKey)
        .param("name", name)
        .param("description", description)
        .param("categoryId", categoryId)
        .param("countyId", countyId)
        .param("town", town)
        .param("latitude", latitude)
        .param("longitude", longitude)
        .param("published", published)
        .param("allowPublished", Boolean.TRUE.equals(published))
        .param("priceBand", priceBand)
        .param("website", website)
        .param("phone", phone)
        .param("sourceUrl", sourceUrl)
        .param("sourceName", sourceName)
        .param("licence", licence)
        .param("imageUrl", imageUrl)
        .param("imageCredit", imageCredit)
        .param("imageLicence", imageLicence)
        .update();
  }

  public void replaceFacilities(UUID placeId, List<String> facilityIds) {
    jdbc.sql("delete from place_facility where place_id = :id")
        .param("id", placeId)
        .update();
    for (String facilityId : facilityIds) {
      jdbc.sql(
              """
              insert into place_facility (place_id, facility_id)
              values (:placeId, :facilityId)
              """)
          .param("placeId", placeId)
          .param("facilityId", facilityId)
          .update();
    }
  }

  public Optional<PlaceResponse> findById(UUID id) {
    return jdbc.sql(PLACE_SELECT + " where p.id = :id")
        .param("id", id)
        .query(PlaceJdbc::mapPlace)
        .optional()
        .map(this::withFacilities);
  }

  public Optional<PlaceResponse> findBySlug(String slug) {
    return jdbc.sql(PLACE_SELECT + " where p.slug = :slug")
        .param("slug", slug)
        .query(PlaceJdbc::mapPlace)
        .optional()
        .map(this::withFacilities);
  }

  public Optional<PlaceResponse> findByLeadDedupeKey(String leadDedupeKey) {
    return jdbc.sql(PLACE_SELECT + " where p.lead_dedupe_key = :leadDedupeKey")
        .param("leadDedupeKey", leadDedupeKey)
        .query(PlaceJdbc::mapPlace)
        .optional()
        .map(this::withFacilities);
  }

  public List<PlaceResponse> list(String categoryId, String countyId, Boolean published) {
    StringBuilder sql = new StringBuilder(PLACE_SELECT);
    sql.append(" where 1=1");
    if (categoryId != null) {
      sql.append(" and p.category_id = :categoryId");
    }
    if (countyId != null) {
      sql.append(" and p.county_id = :countyId");
    }
    if (published != null) {
      sql.append(" and p.published = :published");
    }
    sql.append(" order by p.name");
    var spec = jdbc.sql(sql.toString());
    if (categoryId != null) {
      spec = spec.param("categoryId", categoryId);
    }
    if (countyId != null) {
      spec = spec.param("countyId", countyId);
    }
    if (published != null) {
      spec = spec.param("published", published);
    }
    List<PlaceResponse> rows = spec.query(PlaceJdbc::mapPlace).list();
    attachFacilities(rows);
    return rows;
  }

  private PlaceResponse withFacilities(PlaceResponse place) {
    List<String> facilities =
        jdbc.sql(
                """
                select facility_id from place_facility
                where place_id = :id
                order by facility_id
                """)
            .param("id", place.id())
            .query(String.class)
            .list();
    return copyFacilities(place, facilities);
  }

  private void attachFacilities(List<PlaceResponse> places) {
    if (places.isEmpty()) {
      return;
    }
    Map<UUID, List<String>> byPlace = new LinkedHashMap<>();
    for (PlaceResponse place : places) {
      byPlace.put(place.id(), new ArrayList<>());
    }
    UUID[] ids = places.stream().map(PlaceResponse::id).toArray(UUID[]::new);
    jdbc.sql(
            """
            select place_id, facility_id from place_facility
            where place_id = any(:ids)
            order by facility_id
            """)
        .param("ids", ids)
        .query(
            (rs, n) -> {
              UUID placeId = rs.getObject("place_id", UUID.class);
              byPlace
                  .computeIfAbsent(placeId, k -> new ArrayList<>())
                  .add(rs.getString("facility_id"));
              return 0;
            })
        .list();
    for (int i = 0; i < places.size(); i++) {
      PlaceResponse place = places.get(i);
      places.set(i, copyFacilities(place, byPlace.getOrDefault(place.id(), List.of())));
    }
  }

  private static PlaceResponse copyFacilities(PlaceResponse place, List<String> facilities) {
    return new PlaceResponse(
        place.id(),
        place.slug(),
        place.name(),
        place.description(),
        place.category(),
        place.county(),
        place.town(),
        place.latitude(),
        place.longitude(),
        place.published(),
        place.partnerId(),
        place.priceBand(),
        place.website(),
        place.phone(),
        place.sourceUrl(),
        place.sourceName(),
        place.licence(),
        place.leadDedupeKey(),
        List.copyOf(facilities),
        place.imageUrl(),
        place.imageCredit(),
        place.imageLicence(),
        place.beenCount());
  }

  private static final String PLACE_SELECT =
      """
      select p.id, p.slug, p.name, p.description, p.town, p.latitude, p.longitude,
             p.published, p.partner_id, p.price_band, p.website, p.phone,
             p.source_url, p.source_name, p.licence, p.lead_dedupe_key,
             p.image_url, p.image_credit, p.image_licence,
             c.id as category_id, c.label as category_label,
             y.id as county_id, y.name as county_name,
             (select count(*) from visit_intent vi
               where vi.place_id = p.id and vi.mark = 'been') as been_count
      from place p
      join category c on c.id = p.category_id
      join county y on y.id = p.county_id
      """;

  private static PlaceResponse mapPlace(ResultSet rs, int n) throws SQLException {
    BigDecimal lat = rs.getBigDecimal("latitude");
    BigDecimal lon = rs.getBigDecimal("longitude");
    return new PlaceResponse(
        rs.getObject("id", UUID.class),
        rs.getString("slug"),
        rs.getString("name"),
        rs.getString("description"),
        new CategoryRef(rs.getString("category_id"), rs.getString("category_label")),
        new CountyRef(rs.getString("county_id"), rs.getString("county_name")),
        rs.getString("town"),
        lat == null ? null : lat.doubleValue(),
        lon == null ? null : lon.doubleValue(),
        rs.getBoolean("published"),
        rs.getObject("partner_id", UUID.class),
        rs.getString("price_band"),
        rs.getString("website"),
        rs.getString("phone"),
        rs.getString("source_url"),
        rs.getString("source_name"),
        rs.getString("licence"),
        rs.getString("lead_dedupe_key"),
        List.of(),
        rs.getString("image_url"),
        rs.getString("image_credit"),
        rs.getString("image_licence"),
        rs.getInt("been_count"));
  }
}
