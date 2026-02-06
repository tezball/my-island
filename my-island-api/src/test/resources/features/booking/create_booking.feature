Feature: Create Booking
  As a Guest
  I want to create a booking for a specific lot
  So that I can reserve my stay at a campsite

  Scenario: Book a lot via search results
    Given I am logged in as guest
    And I am on the "home" page
    When I wait for the page to load
    And I enter "Kilkenny" in the search location field
    And I click the search button
    And I should see search results
    And I click on the first search result
    And I wait for the page to load
    And I click the first available "Book Now" button
    Then I should see the booking modal
    When I select a check-in date 30 days from now
    And I select a check-out date 33 days from now
    And I click the "Continue to Payment" button
    Then I should see the payment form
    When I click the "Authorize Payment" button
    Then I should see "Payment Authorized!" confirmation
    And I should see a booking ID
