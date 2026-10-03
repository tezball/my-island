package island.catalog.stay;

public class ForbiddenException extends RuntimeException {

  public ForbiddenException() {
    super("This account cannot open the admin console.");
  }
}
