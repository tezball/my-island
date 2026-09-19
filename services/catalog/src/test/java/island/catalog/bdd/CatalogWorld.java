package island.catalog.bdd;

import island.catalog.api.dto.PlaceResponse;
import org.springframework.http.HttpHeaders;

final class CatalogWorld {
  static final CatalogWorld I = new CatalogWorld();

  int lastStatus;
  PlaceResponse lastPlace;
  HttpHeaders session = new HttpHeaders();
}
