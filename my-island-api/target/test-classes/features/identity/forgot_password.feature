Feature: Forgot Password
  As a User
  I want to reset my password if I forget it
  So that I can regain access to my account

  Scenario: Request password reset link
    Given I am on the "forgot-password" page
    When I enter reset email "family@example.com"
    And I click the "Send Reset Link" button
    Then I should see the text "Check your email"
    And I should see the text "Back to Sign In"
