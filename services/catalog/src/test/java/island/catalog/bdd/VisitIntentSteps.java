package island.catalog.bdd;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import island.catalog.api.dto.PlaceResponse;
import island.catalog.api.dto.VisitIntentResponse;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

public class VisitIntentSteps {

  @Autowired TestRestTemplate http;
  @Autowired ObjectMapper mapper;

  @When("I PUT visit-intent been on that place without a session")
  public void putBeenAnon() {
    UUID id = CatalogWorld.I.lastPlace.id();
    ResponseEntity<String> response =
        http.exchange(
            "/api/v1/me/places/" + id + "/visit-intent",
            HttpMethod.PUT,
            new HttpEntity<>("{\"mark\":\"been\"}", json()),
            String.class);
    CatalogWorld.I.lastStatus = response.getStatusCode().value();
  }

  @When("I log in as password guest {string} with password {string}")
  public void passwordLogin(String username, String password) {
    ResponseEntity<Void> login =
        http.exchange(
            "/api/auth/login",
            HttpMethod.POST,
            new HttpEntity<>(
                "{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}", json()),
            Void.class);
    assertThat(login.getStatusCode().is2xxSuccessful()).isTrue();
    CatalogWorld.I.session = cookie(login);
  }

  @When("I log in with stub Google token {string}")
  public void googleLogin(String token) {
    ResponseEntity<Void> login =
        http.exchange(
            "/api/auth/google",
            HttpMethod.POST,
            new HttpEntity<>("{\"idToken\":\"" + token + "\"}", json()),
            Void.class);
    assertThat(login.getStatusCode().is2xxSuccessful()).isTrue();
    CatalogWorld.I.session = cookie(login);
  }

  @When("I PUT visit-intent {string} on that place")
  public void putMark(String mark) {
    UUID id = CatalogWorld.I.lastPlace.id();
    HttpHeaders headers = json();
    headers.putAll(CatalogWorld.I.session);
    ResponseEntity<String> response =
        http.exchange(
            "/api/v1/me/places/" + id + "/visit-intent",
            HttpMethod.PUT,
            new HttpEntity<>("{\"mark\":\"" + mark + "\"}", headers),
            String.class);
    CatalogWorld.I.lastStatus = response.getStatusCode().value();
  }

  @Then("that place anonymous been count is {int}")
  public void beenCount(int count) {
    PlaceResponse got =
        http.getForObject("/api/v1/places/" + CatalogWorld.I.lastPlace.id(), PlaceResponse.class);
    assertThat(got.beenCount()).isEqualTo(count);
    assertThat(got.toString()).doesNotContain("guest_id");
  }

  @Then("my visit-intent list for {string} includes that place")
  public void listIncludes(String mark) throws Exception {
    assertThat(listedIds(mark)).contains(CatalogWorld.I.lastPlace.id());
  }

  @Then("my visit-intent list for {string} does not include that place")
  public void listExcludes(String mark) throws Exception {
    assertThat(listedIds(mark)).doesNotContain(CatalogWorld.I.lastPlace.id());
  }

  private List<UUID> listedIds(String mark) throws Exception {
    ResponseEntity<String> response =
        http.exchange(
            "/api/v1/me/visit-intents?mark=" + mark,
            HttpMethod.GET,
            new HttpEntity<>(CatalogWorld.I.session),
            String.class);
    assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
    List<VisitIntentResponse> rows =
        mapper.readValue(response.getBody(), new TypeReference<>() {});
    return rows.stream().map(VisitIntentResponse::placeId).toList();
  }

  private static HttpHeaders json() {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    return headers;
  }

  private static HttpHeaders cookie(ResponseEntity<?> login) {
    HttpHeaders withCookie = new HttpHeaders();
    String setCookie = login.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
    assertThat(setCookie).isNotBlank();
    withCookie.add(HttpHeaders.COOKIE, setCookie.split(";", 2)[0]);
    return withCookie;
  }
}
