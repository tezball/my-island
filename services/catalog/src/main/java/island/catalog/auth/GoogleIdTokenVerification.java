package island.catalog.auth;

public interface GoogleIdTokenVerification {

  VerifiedGoogleIdentity verify(String idToken);
}
