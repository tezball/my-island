package island.catalog.bdd;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import island.catalog.api.dto.CreatePlaceRequest;
import island.catalog.api.dto.PlaceResponse;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;

public class PlaceSteps {

  @Autowired TestRestTemplate http;
  @Autowired ObjectMapper mapper;

  private int lastStatus;
  private PlaceResponse lastPlace;

  @When("I create a published poi in {word} named {string} at {double}, {double} with facility {string}")
  public void createPublished(
      String countyId, String name, double lat, double lon, String facility) {
    post(
        new CreatePlaceRequest(
            name,
            null,
            "contract stub",
            "poi",
            countyId,
            null,
            lat,
            lon,
            true,
            "FREE",
            null,
            null,
            null,
            null,
            null,
            null,
            List.of(facility)));
  }

  @When("I create a draft place named {string} in {word} with category {string}")
  public void createDraftBadCategory(String name, String countyId, String categoryId) {
    post(
        new CreatePlaceRequest(
            name,
            null,
            null,
            categoryId,
            countyId,
            null,
            null,
            null,
            false,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            List.of()));
  }

  @When("I GET {string}")
  public void getPath(String path) {
    ResponseEntity<String> response = http.getForEntity(path, String.class);
    lastStatus = response.getStatusCode().value();
    lastPlace = null;
  }

  @Then("the HTTP status is {int}")
  public void httpStatus(int status) {
    assertThat(lastStatus).isEqualTo(status);
  }

  @Then("the place category is {string}")
  public void category(String id) {
    assertThat(lastPlace).isNotNull();
    assertThat(lastPlace.category().id()).isEqualTo(id);
  }

  @Then("the place county is {string}")
  public void county(String id) {
    assertThat(lastPlace).isNotNull();
    assertThat(lastPlace.county().id()).isEqualTo(id);
  }

  @Then("the place has facility {string}")
  public void facility(String id) {
    assertThat(lastPlace).isNotNull();
    assertThat(lastPlace.facilities()).containsExactly(id);
  }

  @Then("I can GET that place by id")
  public void getById() {
    UUID id = lastPlace.id();
    ResponseEntity<PlaceResponse> got =
        http.getForEntity("/api/v1/places/" + id, PlaceResponse.class);
    assertThat(got.getStatusCode().value()).isEqualTo(200);
    assertThat(got.getBody().id()).isEqualTo(id);
  }

  @Then("I can GET that place by slug")
  public void getBySlug() {
    String slug = lastPlace.slug();
    ResponseEntity<PlaceResponse> got =
        http.getForEntity("/api/v1/places/" + slug, PlaceResponse.class);
    assertThat(got.getStatusCode().value()).isEqualTo(200);
    assertThat(got.getBody().id()).isEqualTo(lastPlace.id());
  }

  @Then("listing {word} includes that place")
  public void listIncludes(String countyId) {
    PlaceResponse[] listed =
        http.getForObject("/api/v1/places?countyId=" + countyId, PlaceResponse[].class);
    assertThat(listed).extracting(PlaceResponse::id).contains(lastPlace.id());
  }

  private void post(CreatePlaceRequest request) {
    ResponseEntity<String> response = http.postForEntity("/api/v1/places", request, String.class);
    lastStatus = response.getStatusCode().value();
    lastPlace = null;
    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
      try {
        lastPlace = mapper.readValue(response.getBody(), PlaceResponse.class);
      } catch (JsonProcessingException ex) {
        throw new IllegalStateException(ex);
      }
    }
  }
}
