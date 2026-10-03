Feature: VisitIntent contract
  Signed-in Guest marks visited, next, or saved. Lists are private.
  Place JSON exposes an anonymous visited count only.

  Scenario: anonymous cannot write VisitIntent
    When I create a published poi in kerry named "Tick Skellig" at 51.7708, -10.5406 with facility "parking"
    And I PUT visit-intent visited on that place without a session
    Then the HTTP status is 401

  Scenario: password Guest upserts a mark and sees a private list
    When I create a published poi in kerry named "Intent Skellig" at 51.7708, -10.5406 with facility "parking"
    And I log in as password guest "guest" with password "guest"
    And I PUT visit-intent "visited" on that place
    Then the HTTP status is 200
    And that place anonymous visited count is 1
    And my visit-intent list for "visited" includes that place
    When I PUT visit-intent "next" on that place
    Then that place anonymous visited count is 0
    And my visit-intent list for "next" includes that place
    And my visit-intent list for "visited" does not include that place

  Scenario: another Guest cannot read the first Guest list
    When I create a published poi in kerry named "Private Skellig" at 51.7708, -10.5406 with facility "parking"
    And I log in as password guest "guest" with password "guest"
    And I PUT visit-intent "saved" on that place
    And I log in with stub Google token "stub:other-list:other-list@example.com:Other List"
    Then my visit-intent list for "saved" does not include that place
    And that place anonymous visited count is 0
