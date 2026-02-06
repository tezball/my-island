Feature: Search Campsites
  As a Guest
  I want to search for available campsites by location
  So that I can find the right campsite for my trip

  Scenario: Search for campsites in Kilkenny
    Given I am on the "home" page
    When I wait for the page to load
    And I enter "Kilkenny" in the search location field
    And I click the search button
    Then the URL should contain "/search"
    And the URL should contain "location=Kilkenny"
    And I should see search results
    And I should see "Nore Valley Park" in the results
