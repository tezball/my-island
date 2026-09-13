package island.catalog.auth;

public class InvalidGoogleIdTokenException extends RuntimeException {

  public InvalidGoogleIdTokenException(String message) {
    super(message);
  }

  public InvalidGoogleIdTokenException(String message, Throwable cause) {
    super(message, cause);
  }
}
