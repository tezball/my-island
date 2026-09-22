package island.catalog.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "catalog.mail.mode", havingValue = "smtp")
public class SmtpGuestMail implements GuestMail {

  private static final Logger log = LoggerFactory.getLogger(SmtpGuestMail.class);

  private final JavaMailSender mail;
  private final CatalogMailProperties props;

  public SmtpGuestMail(JavaMailSender mail, CatalogMailProperties props) {
    this.mail = mail;
    this.props = props;
  }

  @Override
  public void send(String to, String subject, String text) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(props.from());
    message.setTo(to);
    message.setSubject(subject);
    message.setText(text);
    try {
      mail.send(message);
    } catch (RuntimeException ex) {
      log.warn("guest mail smtp failed to={} subject={}", to, subject);
    }
  }
}
