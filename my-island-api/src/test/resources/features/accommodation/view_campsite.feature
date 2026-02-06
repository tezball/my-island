Feature: View Campsite Details
  As a Guest
  I want to view campsite details, facilities, and rules before booking
  So that I can choose the right campsite for my stay

  Scenario: View a featured campsite from the homepage
    Given I am on the "home" page
    When I wait for the page to load
    And I click on the first featured campsite
    And I wait for the page to load
    Then I should see the campsite name in the page header
    And I should see the "About the Campsite" section
    And I should see accommodation options listed
    And I should see at least one "Book Now" button
