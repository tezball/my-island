package island.catalog.stay;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class CountyLocatorTest {

  static CountyLocator counties;

  @BeforeAll
  static void load() throws IOException {
    counties = new CountyLocator();
    counties.load();
  }

  @Test
  void pinResolvesToOneOfThe32Counties() {
    assertThat(counties.id(53.3498, -6.2603)).isEqualTo("dublin");
    assertThat(counties.id(53.2707, -9.0568)).isEqualTo("galway");
    assertThat(counties.id(51.8985, -8.4756)).isEqualTo("cork");
    assertThat(counties.id(52.0599, -9.5044)).isEqualTo("kerry");
    assertThat(counties.id(54.5973, -5.9301)).isEqualTo("antrim");
    assertThat(counties.id(54.9966, -7.3086)).isEqualTo("derry");
    assertThat(counties.id(54.3466, -7.6413)).isEqualTo("fermanagh");
    assertThat(counties.id(48.8566, 2.3522)).isNull();
  }
}
