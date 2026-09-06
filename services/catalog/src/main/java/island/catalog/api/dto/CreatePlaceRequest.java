package island.catalog.api.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record CreatePlaceRequest(
    @NotBlank String name,
    String slug,
    String description,
    @NotBlank String categoryId,
    @NotBlank String countyId,
    String town,
    Double latitude,
    Double longitude,
    Boolean published,
    String priceBand,
    String website,
    String phone,
    String sourceUrl,
    String sourceName,
    String licence,
    String leadDedupeKey,
    List<String> facilityIds) {

  public CreatePlaceRequest {
    facilityIds = facilityIds == null ? List.of() : List.copyOf(facilityIds);
  }
}
