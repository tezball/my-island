package island.catalog.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "catalog.mail.mode", havingValue = "log", matchIfMissing = true)
public class LogGuestMail implements GuestMail {

  private static final Logger log = LoggerFactory.getLogger(LogGuestMail.class);

  @Override
  public void send(String to, String subject, String text) {
    log.info("guest mail mode=log to={} subject={}", to, subject);
  }
}
