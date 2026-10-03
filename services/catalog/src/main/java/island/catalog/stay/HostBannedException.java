package island.catalog.stay;

public class HostBannedException extends RuntimeException {

  public HostBannedException(String reason) {
    super(reason == null || reason.isBlank() ? "This host is banned." : reason);
  }
}
