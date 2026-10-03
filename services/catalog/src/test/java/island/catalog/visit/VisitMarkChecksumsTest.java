package island.catalog.visit;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class VisitMarkChecksumsTest {

  @Test
  void repairsOnlyTheVisitMarkChecksumDrift() {
    assertThat(
            VisitMarkChecksums.visitMarkChecksumDrift(
                "Migration checksum mismatch for migration version 9"))
        .isTrue();
    assertThat(
            VisitMarkChecksums.visitMarkChecksumDrift(
                "Migration checksum mismatch for migration version 11"))
        .isTrue();
    assertThat(VisitMarkChecksums.visitMarkChecksumDrift("Migration checksum mismatch for migration version 5"))
        .isFalse();
    assertThat(VisitMarkChecksums.visitMarkChecksumDrift("Unable to connect")).isFalse();
    assertThat(VisitMarkChecksums.visitMarkChecksumDrift(null)).isFalse();
  }
}
