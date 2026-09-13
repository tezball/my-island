package island.catalog.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class StubGoogleIdTokenVerificationTest {

  private final StubGoogleIdTokenVerification verifier = new StubGoogleIdTokenVerification();

  @Test
  void parsesStubToken() {
    VerifiedGoogleIdentity identity =
        verifier.verify("stub:google-sub-1:alice@example.com:Alice Example");
    assertThat(identity.subject()).isEqualTo("google-sub-1");
    assertThat(identity.email()).isEqualTo("alice@example.com");
    assertThat(identity.displayName()).isEqualTo("Alice Example");
  }

  @Test
  void rejectsBadToken() {
    assertThatThrownBy(() -> verifier.verify("not-a-stub"))
        .isInstanceOf(InvalidGoogleIdTokenException.class);
  }
}
