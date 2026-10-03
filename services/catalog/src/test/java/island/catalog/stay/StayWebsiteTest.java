package island.catalog.stay;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;

class StayWebsiteTest {

  @Test
  void redirectIsADownSiteAndIsNotFollowed() throws Exception {
    HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
    AtomicInteger secretHits = new AtomicInteger();
    server.createContext(
        "/secret",
        exchange -> {
          secretHits.incrementAndGet();
          byte[] body = "loopback".getBytes(StandardCharsets.UTF_8);
          exchange.sendResponseHeaders(200, body.length);
          exchange.getResponseBody().write(body);
          exchange.close();
        });
    server.createContext(
        "/go",
        exchange -> {
          int port = server.getAddress().getPort();
          exchange.getResponseHeaders().set("Location", "http://127.0.0.1:" + port + "/secret");
          exchange.sendResponseHeaders(302, -1);
          exchange.close();
        });
    ExecutorService executor = Executors.newSingleThreadExecutor();
    server.setExecutor(executor);
    server.start();
    try {
      StayWebsite website = new StayWebsite(new StayProperties(true, 0, 2000, true));
      int port = server.getAddress().getPort();
      assertThatThrownBy(() -> website.load("http://127.0.0.1:" + port + "/go"))
          .isInstanceOf(IOException.class);
      assertThat(secretHits).hasValue(0);
    } finally {
      server.stop(0);
      executor.shutdownNow();
    }
  }
}
