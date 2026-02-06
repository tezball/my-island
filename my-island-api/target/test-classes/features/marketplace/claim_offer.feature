Feature: Claim Offer
  As a Guest
  I want to claim offers to use during my stay
  So that I can get discounts from local suppliers

  Scenario: Claim an offer and see it in vouchers
    Given I am logged in as guest
    When I navigate to "/offers"
    And I wait for the page to load
    And I click the "Claim Offer" button on the first offer
    And I wait for the page to load
    Then I should be on the "vouchers" page
