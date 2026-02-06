Feature: User Registration
  As a User
  I want to register using email
  So that I can create an account and explore campsites

  Scenario: Successful signup with valid details
    Given I am on the "signup" page
    When I enter full name "Test User"
    And I enter signup email with a unique address
    And I enter signup password "Password123!"
    And I click the "Continue" button
    Then I should be on the "personalization" page
    When I click the "Finish & Explore" button
    Then I should be on the "home" page
