package island.catalog.auth;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({GoogleOAuthProperties.class, CatalogAuthProperties.class})
public class GoogleIdTokenVerificationConfig {

  @Bean
  GoogleIdTokenVerification googleIdTokenVerification(
      CatalogAuthProperties catalogAuth, GoogleOAuthProperties google) {
    if (catalogAuth.stubEnabled()) {
      return new StubGoogleIdTokenVerification();
    }
    return new GoogleApiClientIdTokenVerification(google);
  }
}
