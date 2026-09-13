package island.catalog.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import org.springframework.util.StringUtils;

public class GoogleApiClientIdTokenVerification implements GoogleIdTokenVerification {

  private final GoogleOAuthProperties google;

  public GoogleApiClientIdTokenVerification(GoogleOAuthProperties google) {
    this.google = google;
  }

  @Override
  public VerifiedGoogleIdentity verify(String idToken) {
    if (!StringUtils.hasText(idToken)) {
      throw new InvalidGoogleIdTokenException("Missing idToken");
    }
    if (!StringUtils.hasText(google.clientId())) {
      throw new InvalidGoogleIdTokenException("GOOGLE_CLIENT_ID is not configured");
    }
    GoogleIdTokenVerifier verifier =
        new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
            .setAudience(Collections.singletonList(google.clientId()))
            .build();
    GoogleIdToken token;
    try {
      token = verifier.verify(idToken);
    } catch (GeneralSecurityException | IOException ex) {
      throw new InvalidGoogleIdTokenException("Google ID token verification failed", ex);
    }
    if (token == null) {
      throw new InvalidGoogleIdTokenException("Invalid Google ID token");
    }
    GoogleIdToken.Payload payload = token.getPayload();
    String subject = payload.getSubject();
    String email = payload.getEmail();
    if (!StringUtils.hasText(subject) || !StringUtils.hasText(email)) {
      throw new InvalidGoogleIdTokenException("Google ID token missing subject or email");
    }
    if (Boolean.FALSE.equals(payload.getEmailVerified())) {
      throw new InvalidGoogleIdTokenException("Google email is not verified");
    }
    String displayName = payload.get("name") != null ? payload.get("name").toString() : email;
    return new VerifiedGoogleIdentity(subject, email, displayName);
  }
}
