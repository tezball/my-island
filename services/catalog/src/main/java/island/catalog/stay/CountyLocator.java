package island.catalog.stay;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/**
 * County comes from the pin. Rings are simplified Natural Earth admin-1 (public domain), merged
 * to the 32 Irish counties.
 */
@Component
public class CountyLocator {

  private final Map<String, List<double[][]>> counties = new LinkedHashMap<>();

  @PostConstruct
  void load() throws IOException {
    ObjectMapper mapper = new ObjectMapper();
    try (InputStream in = new ClassPathResource("stay/irish-counties.json").getInputStream()) {
      JsonNode root = mapper.readTree(in);
      root.fieldNames()
          .forEachRemaining(
              id -> {
                List<double[][]> rings = new ArrayList<>();
                for (JsonNode ring : root.get(id)) {
                  double[][] points = new double[ring.size()][2];
                  for (int i = 0; i < ring.size(); i++) {
                    points[i][0] = ring.get(i).get(0).asDouble();
                    points[i][1] = ring.get(i).get(1).asDouble();
                  }
                  rings.add(points);
                }
                counties.put(id, rings);
              });
    }
    if (counties.size() != 32) {
      throw new IllegalStateException("Expected 32 Irish counties, found " + counties.size());
    }
  }

  public String id(double latitude, double longitude) {
    for (Map.Entry<String, List<double[][]>> county : counties.entrySet()) {
      for (double[][] ring : county.getValue()) {
        if (contains(longitude, latitude, ring)) {
          return county.getKey();
        }
      }
    }
    return null;
  }

  private static boolean contains(double x, double y, double[][] ring) {
    boolean inside = false;
    for (int i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      double xi = ring[i][0];
      double yi = ring[i][1];
      double xj = ring[j][0];
      double yj = ring[j][1];
      if ((yi > y) != (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  }
}
