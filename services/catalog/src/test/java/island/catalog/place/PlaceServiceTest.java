package island.catalog.place;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class PlaceServiceTest {

  @Test
  void slugifyLowercasesAndHyphenates() {
    assertThat(PlaceService.slugify("Skellig Michael")).isEqualTo("skellig-michael");
    assertThat(PlaceService.slugify("  Dún Aonghasa  ")).isEqualTo("d-n-aonghasa");
  }
}
