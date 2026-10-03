package island.catalog.stay;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import org.springframework.stereotype.Component;

@Component
public class StayWebsite {

  private final StayProperties properties;
  private final HttpClient http;

  public StayWebsite(StayProperties properties) {
    this.properties = properties;
    this.http =
        HttpClient.newBuilder()
            .connectTimeout(Duration.ofMillis(Math.max(1000, properties.websiteTimeoutMs())))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();
  }

  public String load(String url) throws IOException {
    try {
      HttpRequest request =
          HttpRequest.newBuilder(URI.create(url))
              .timeout(Duration.ofMillis(Math.max(1000, properties.websiteTimeoutMs())))
              .header("User-Agent", "my-island-stay-review")
              .GET()
              .build();
      HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
      if (response.statusCode() < 200 || response.statusCode() >= 300) {
        throw new IOException("Website status " + response.statusCode());
      }
      String body = response.body();
      return body == null ? "" : body;
    } catch (InterruptedException ex) {
      Thread.currentThread().interrupt();
      throw new IOException("Website timed out", ex);
    } catch (IllegalArgumentException ex) {
      throw new IOException("Website did not load", ex);
    }
  }
}
