package island.catalog.auth;

import org.springframework.util.StringUtils;

/** Test-only verifier: token format {@code stub:subject:email:displayName}. */
public class StubGoogleIdTokenVerification implements GoogleIdTokenVerification {

  @Override
  public VerifiedGoogleIdentity verify(String idToken) {
    if (!StringUtils.hasText(idToken) || !idToken.startsWith("stub:")) {
      throw new InvalidGoogleIdTokenException("Invalid stub token");
    }
    String[] parts = idToken.split(":", 4);
    if (parts.length != 4) {
      throw new InvalidGoogleIdTokenException("Invalid stub token format");
    }
    return new VerifiedGoogleIdentity(parts[1], parts[2], parts[3]);
  }
}
