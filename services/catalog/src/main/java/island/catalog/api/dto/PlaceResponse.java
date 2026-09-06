package island.catalog.api.dto;

import java.util.List;
import java.util.UUID;

public record PlaceResponse(
    UUID id,
    String slug,
    String name,
    String description,
    CategoryRef category,
    CountyRef county,
    String town,
    Double latitude,
    Double longitude,
    boolean published,
    UUID partnerId,
    String priceBand,
    String website,
    String phone,
    List<String> facilities) {

  public record CategoryRef(String id, String label) {}

  public record CountyRef(String id, String name) {}
}
