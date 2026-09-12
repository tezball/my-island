package island.catalog.bdd;

import island.catalog.support.CatalogPostgis;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@CucumberContextConfiguration
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class CucumberSpringConfig {

  @DynamicPropertySource
  static void datasource(DynamicPropertyRegistry registry) {
    CatalogPostgis.datasource(registry);
  }
}
