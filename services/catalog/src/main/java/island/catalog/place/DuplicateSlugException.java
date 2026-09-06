package island.catalog.place;

public class DuplicateSlugException extends RuntimeException {

  public DuplicateSlugException(String slug) {
    super("Place slug already exists: " + slug);
  }
}
