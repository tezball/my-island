Feature: Host Stay
  A Stay is a new place. Review is fail-closed. Public Place POST stays closed.

  Scenario: a clean Stay stays hidden until review passes
    Given a signed-in host "stay-clean"
    When the host submits a campsite Stay "Contract campsite" at 52.0599, -9.5044
    Then the Stay status is "submitted"
    And the public Stay list does not include "Contract campsite"
    When review runs for that Stay
    Then the Stay status is "public"
    And the public Stay page shows phone and email
    And the public Stay list includes "Contract campsite"

  Scenario: script in the description is rejected and the Stay stays hidden
    Given a signed-in host "stay-script"
    When the host submits a campsite Stay "Script campsite" at 52.0599, -9.5044 with description "<script>alert(1)</script>"
    And review runs for that Stay
    Then the Stay status is "hidden"
    And the host is banned
    And the public Stay list does not include "Script campsite"
