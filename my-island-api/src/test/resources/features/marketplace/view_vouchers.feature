Feature: View Vouchers
  As a Guest
  I want to view my claimed vouchers
  So that I can use them during my stay

  Scenario: View claimed vouchers and filter by status
    Given I am logged in as guest
    When I navigate to "/vouchers"
    And I wait for the page to load
    Then I should see the text "My Vouchers"
    And I should see at least one voucher card
    And I should see filter tabs for "All", "Ready to Use", and "Redeemed"
    When I click the "Redeemed" filter tab
    Then the vouchers should be filtered
