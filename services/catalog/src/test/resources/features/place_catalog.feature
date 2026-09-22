Feature: Place catalog contract
  HTTP what for the listing stub. JSON uses categoryId / countyId / latitude / longitude.
  Runs on Testcontainers PostGIS (same engine as CatalogTest).

  Scenario: curator publishes a place and finds it again
    When I create a published poi in kerry named "Contract Skellig" at 51.7708, -10.5406 with facility "parking"
    Then the HTTP status is 201
    And the place category is "poi"
    And the place county is "kerry"
    And the place has facility "parking"
    And I can GET that place by id
    And I can GET that place by slug
    And listing kerry includes that place

  Scenario: anonymous place writes are denied
    When I POST "/api/v1/places" without an import key
    Then the HTTP status is 401
    When I PUT "/api/v1/places/missing" without a session
    Then the HTTP status is 401
    When I PATCH "/api/v1/places/missing" without a session
    Then the HTTP status is 401
    When I DELETE "/api/v1/places/missing" without a session
    Then the HTTP status is 401

  Scenario: unknown place is 404
    When I GET "/api/v1/places/does-not-exist"
    Then the HTTP status is 404

  Scenario: unknown category is 400
    When I create a draft place named "Nope" in kerry with category "campsite-only"
    Then the HTTP status is 400
