Feature: User Login
  As a User
  I want to login using email
  So that I can access my account

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter email "norevalley@myisland.com" and password "password"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see "Nore Valley Park" in the header
