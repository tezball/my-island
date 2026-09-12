// House CI pipeline for GitHub multibranch (WF-031).
// Checkout is into the agent workspace; compose needs the host path for volume mounts.
pipeline {
  agent any
  options {
    timestamps()
    timeout(time: 60, unit: 'MINUTES')
  }
  stages {
    stage('unit') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          # Multibranch checks out into the job workspace. Prefer HOST_REPO when
          # building the bind-mounted tree locally; otherwise use $WORKSPACE.
          ROOT="${HOST_REPO:-$WORKSPACE}"
          cd "$ROOT"
          docker compose run --rm --no-deps workspace \
            bash -lc 'python3 -m pytest ops/tests -q -m "not stack"'
        '''
      }
    }
    stage('catalog') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          ROOT="${HOST_REPO:-$WORKSPACE}"
          cd "$ROOT"
          docker compose run --rm --no-deps --user root \
            -v /var/run/docker.sock:/var/run/docker.sock \
            -e DOCKER_HOST=unix:///var/run/docker.sock \
            -e TESTCONTAINERS_HOST_OVERRIDE=host.docker.internal \
            workspace \
            bash -lc 'cd services/catalog && ./mvnw -B test'
        '''
      }
    }
    stage('stack') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          ROOT="${HOST_REPO:-$WORKSPACE}"
          cd "$ROOT"
          SKIP_JENKINS=1 ./scripts/dev up
          REQUIRE_STACK=1 DEV_TEST_IN_WORKSPACE=1 SKIP_JENKINS=1 ./scripts/dev test
        '''
      }
    }
  }
}
