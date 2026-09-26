package island.catalog.auth;

public interface GuestMail {

  void send(String to, String subject, String text);

  record Sent(String to, String subject, String text) {}
}
