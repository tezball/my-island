package island.catalog.place;

public class PlaceNotFoundException extends RuntimeException {

  public PlaceNotFoundException(String idOrSlug) {
    super("Place not found: " + idOrSlug);
  }
}
