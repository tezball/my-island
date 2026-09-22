package island.catalog.auth;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "catalog.mail.mode", havingValue = "memory")
public class MemoryGuestMail implements GuestMail {

  private final List<Sent> sent = new CopyOnWriteArrayList<>();

  @Override
  public void send(String to, String subject, String text) {
    sent.add(new Sent(to, subject, text));
  }

  public List<Sent> sent() {
    return List.copyOf(sent);
  }
}
