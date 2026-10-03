package island.catalog.stay;

public class StayNotFoundException extends RuntimeException {

  public StayNotFoundException() {
    super("Stay not found");
  }
}
