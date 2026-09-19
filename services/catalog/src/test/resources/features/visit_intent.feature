Feature: VisitIntent contract
  Signed-in Guest marks been, want, or never. Lists are private.
  Place JSON exposes anonymous been count only.

  Scenario: anonymous cannot write VisitIntent
    When I create a published poi in kerry named "Tick Skellig" at 51.7708, -10.5406 with facility "parking"
    And I PUT visit-intent been on that place without a session
    Then the HTTP status is 401

  Scenario: password Guest upserts a mark and sees a private list
    When I create a published poi in kerry named "Intent Skellig" at 51.7708, -10.5406 with facility "parking"
    And I log in as password guest "guest" with password "guest"
    And I PUT visit-intent "been" on that place
    Then the HTTP status is 200
    And that place anonymous been count is 1
    And my visit-intent list for "been" includes that place
    When I PUT visit-intent "want" on that place
    Then that place anonymous been count is 0
    And my visit-intent list for "want" includes that place
    And my visit-intent list for "been" does not include that place

  Scenario: another Guest cannot read the first Guest list
    When I create a published poi in kerry named "Private Skellig" at 51.7708, -10.5406 with facility "parking"
    And I log in as password guest "guest" with password "guest"
    And I PUT visit-intent "never" on that place
    And I log in with stub Google token "stub:other-list:other-list@example.com:Other List"
    Then my visit-intent list for "never" does not include that place
    And that place anonymous been count is 0
