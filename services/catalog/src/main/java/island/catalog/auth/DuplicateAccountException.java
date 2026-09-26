package island.catalog.auth;

public class DuplicateAccountException extends RuntimeException {

  public DuplicateAccountException() {
    super("Account already exists");
  }
}
