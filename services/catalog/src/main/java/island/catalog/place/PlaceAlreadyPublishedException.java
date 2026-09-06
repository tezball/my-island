package island.catalog.place;

public class PlaceAlreadyPublishedException extends RuntimeException {

  public PlaceAlreadyPublishedException(String leadDedupeKey) {
    super("Place already published for leadDedupeKey: " + leadDedupeKey);
  }
}
