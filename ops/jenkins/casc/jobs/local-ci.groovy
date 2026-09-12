// Seeded by JCasC (WF-031). Builds via docker compose using HOST_REPO (same path as host).
pipelineJob('local-ci') {
  description('Local clone→up CI: unit + catalog + stack (same commands as GHA).')
  definition {
    cps {
      sandbox(true)
      script("""
pipeline {
  agent any
  options {
    timestamps()
    timeout(time: 45, unit: 'MINUTES')
    disableConcurrentBuilds()
  }
  environment {
    REPO = "\${HOST_REPO}"
  }
  stages {
    stage('unit') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          cd "\$HOST_REPO"
          docker compose run --rm --no-deps workspace \\
            bash -lc 'python3 -m pytest ops/tests -q -m "not stack"'
        '''
      }
    }
    stage('catalog') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          cd "\$HOST_REPO"
          # Testcontainers needs the engine (same as GHA host Docker).
          docker compose run --rm --no-deps --user root \\
            -v /var/run/docker.sock:/var/run/docker.sock \\
            -e DOCKER_HOST=unix:///var/run/docker.sock \\
            -e TESTCONTAINERS_HOST_OVERRIDE=host.docker.internal \\
            workspace \\
            bash -lc 'cd services/catalog && ./mvnw -B test'
        '''
      }
    }
    stage('stack') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          cd "\$HOST_REPO"
          SKIP_JENKINS=1 ./scripts/dev up
          REQUIRE_STACK=1 DEV_TEST_IN_WORKSPACE=1 SKIP_JENKINS=1 ./scripts/dev test
        '''
      }
    }
  }
}
""")
    }
  }
}
