package island.catalog.auth;

public class InvalidTokenException extends RuntimeException {

  public InvalidTokenException() {
    super("Token is invalid or expired");
  }
}
