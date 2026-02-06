Feature: View Trips
  As a Guest
  I want to view my bookings
  So that I can keep track of my trips

  Scenario: View past bookings on the trips page
    Given I am logged in as guest
    When I navigate to "/trips"
    And I wait for the page to load
    Then I should see the text "My Trips"
    And I should see my bookings listed
