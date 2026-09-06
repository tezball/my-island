package island.catalog.api;

import island.catalog.api.dto.CategoryResponse;
import island.catalog.api.dto.CountyResponse;
import island.catalog.place.LookupJdbc;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class LookupController {

  private final LookupJdbc lookups;

  public LookupController(LookupJdbc lookups) {
    this.lookups = lookups;
  }

  @GetMapping("/categories")
  public List<CategoryResponse> categories() {
    return lookups.categories();
  }

  @GetMapping("/counties")
  public List<CountyResponse> counties() {
    return lookups.counties();
  }
}
