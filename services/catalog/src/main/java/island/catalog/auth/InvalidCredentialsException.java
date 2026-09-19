package island.catalog.auth;

public class InvalidCredentialsException extends RuntimeException {

  public InvalidCredentialsException() {
    super("Invalid username or password");
  }
}
