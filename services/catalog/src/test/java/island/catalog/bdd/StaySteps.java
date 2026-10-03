package island.catalog.bdd;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import island.catalog.stay.StayService;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.UUID;
import javax.imageio.ImageIO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

public class StaySteps {

  private static final String STAY_TEXT =
      "A quiet campsite with pitches for tents. Guests stay overnight beside the lake and wake to birdsong.";

  @Autowired TestRestTemplate http;
  @Autowired ObjectMapper mapper;
  @Autowired StayService stays;

  @Given("a signed-in host {string}")
  public void signedInHost(String username) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    ResponseEntity<Void> signup =
        http.exchange(
            "/api/auth/signup",
            HttpMethod.POST,
            new HttpEntity<>(
                "{\"username\":\""
                    + username
                    + "\",\"email\":\""
                    + username
                    + "@example.com\",\"password\":\"password1\"}",
                headers),
            Void.class);
    assertThat(signup.getStatusCode().value()).isEqualTo(204);
    String setCookie = signup.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
    assertThat(setCookie).contains("SESSION");
    CatalogWorld.I.session = new HttpHeaders();
    CatalogWorld.I.session.add(HttpHeaders.COOKIE, setCookie.split(";", 2)[0]);
  }

  @When("the host submits a campsite Stay {string} at {double}, {double}")
  public void submitClean(String title, double latitude, double longitude) throws Exception {
    submit(title, latitude, longitude, STAY_TEXT, "+353 64 663 0000", "stay@example.com");
  }

  @When(
      "the host submits a campsite Stay {string} at {double}, {double} with description {string}")
  public void submitScript(String title, double latitude, double longitude, String description)
      throws Exception {
    submit(title, latitude, longitude, description, null, null);
  }

  @When("review runs for that Stay")
  public void review() {
    stays.reviewNow(UUID.fromString(CatalogWorld.I.stayId));
  }

  @Then("the Stay status is {string}")
  public void status(String expected) throws Exception {
    ResponseEntity<String> response =
        http.exchange(
            "/api/v1/host/stays/" + CatalogWorld.I.stayId,
            HttpMethod.GET,
            new HttpEntity<>(CatalogWorld.I.session),
            String.class);
    assertThat(response.getStatusCode().value()).isEqualTo(200);
    JsonNode body = mapper.readTree(response.getBody());
    assertThat(body.get("status").asText()).isEqualTo(expected);
  }

  @Then("the public Stay list does not include {string}")
  public void publicOmits(String title) throws Exception {
    assertThat(publicTitles()).doesNotContain(title);
  }

  @Then("the public Stay list includes {string}")
  public void publicIncludes(String title) throws Exception {
    assertThat(publicTitles()).contains(title);
  }

  @Then("the public Stay page shows phone and email")
  public void phoneAndEmail() throws Exception {
    ResponseEntity<String> response =
        http.getForEntity("/api/v1/stays/" + CatalogWorld.I.stayId, String.class);
    assertThat(response.getStatusCode().value()).isEqualTo(200);
    JsonNode body = mapper.readTree(response.getBody());
    assertThat(body.get("phone").asText()).isEqualTo("+353 64 663 0000");
    assertThat(body.get("email").asText()).isEqualTo("stay@example.com");
    assertThat(body.get("currency").asText()).isEqualTo("EUR");
  }

  @Then("the host is banned")
  public void banned() throws Exception {
    ResponseEntity<String> me =
        http.exchange(
            "/api/v1/me", HttpMethod.GET, new HttpEntity<>(CatalogWorld.I.session), String.class);
    JsonNode body = mapper.readTree(me.getBody());
    assertThat(body.get("banned").asBoolean()).isTrue();
    assertThat(body.get("banReason").asText()).contains("script or markup");
  }

  private void submit(
      String title, double latitude, double longitude, String description, String phone, String email)
      throws Exception {
    MultiValueMap<String, Object> form = new LinkedMultiValueMap<>();
    form.add("kind", "campsite");
    form.add("title", title);
    form.add("description", description);
    form.add("latitude", Double.toString(latitude));
    form.add("longitude", Double.toString(longitude));
    if (phone != null) {
      form.add("phone", phone);
    }
    if (email != null) {
      form.add("email", email);
    }
    form.add("images", jpeg());
    HttpHeaders headers = new HttpHeaders();
    headers.addAll(CatalogWorld.I.session);
    ResponseEntity<String> response =
        http.exchange(
            "/api/v1/host/stays",
            HttpMethod.POST,
            new HttpEntity<>(form, headers),
            String.class);
    assertThat(response.getStatusCode().value()).isEqualTo(201);
    JsonNode body = mapper.readTree(response.getBody());
    CatalogWorld.I.stayId = body.get("id").asText();
    CatalogWorld.I.stayBody = response.getBody();
  }

  private String publicTitles() throws Exception {
    ResponseEntity<String> response = http.getForEntity("/api/v1/stays", String.class);
    assertThat(response.getStatusCode().value()).isEqualTo(200);
    return response.getBody();
  }

  private static ByteArrayResource jpeg() throws Exception {
    BufferedImage image = new BufferedImage(30, 20, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = image.createGraphics();
    graphics.setColor(Color.BLUE);
    graphics.fillRect(0, 0, 30, 20);
    graphics.dispose();
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    ImageIO.write(image, "jpg", out);
    return new ByteArrayResource(out.toByteArray()) {
      @Override
      public String getFilename() {
        return "cover.jpg";
      }
    };
  }
}
