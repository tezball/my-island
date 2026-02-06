Feature: Browse Offers
  As a Guest
  I want to view local offers and experiences
  So that I can enhance my camping trip

  Scenario: Browse and filter offers
    Given I am logged in as guest
    When I navigate to "/offers"
    And I wait for the page to load
    Then I should see the text "Local Offers"
    And I should see at least one offer card
    When I click a category filter button
    Then the offers should be filtered
