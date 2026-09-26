// Seeded by JCasC (WF-045). Light trickle vs fishing-journals.com. Failures = red ball.
// Not weekly soak. Not merge load. Agents never SSH. Leftover FJ email stays muted.
pipelineJob('gatling-trickle') {
  description('Light Gatling Guest trickle on fishing-journals.com (login, places, VisitIntent). Non-zero fails the build (red). Not weekly perf. Not a GitHub production Environment.')
  definition {
    cps {
      sandbox(true)
      script("""
pipeline {
  agent any
  triggers { cron('H/15 * * * *') }
  options {
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds()
  }
  stages {
    stage('trickle') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          cd "\$HOST_REPO"
          if [[ -f "\$HOST_REPO/.env" ]]; then
            set -a
            # shellcheck disable=SC1091
            source "\$HOST_REPO/.env"
            set +a
          fi
          export GATLING_BASE_URL="\${GATLING_BASE_URL:-\${MOCK_PROD_PUBLIC_ORIGIN:-https://fishing-journals.com}}"
          chmod +x ./ops/scripts/gatling_trickle.sh
          ./scripts/dev traffic
        '''
      }
    }
  }
  post {
    failure {
      sh '''#!/usr/bin/env bash
        set -euo pipefail
        cd "\$HOST_REPO"
        export GATLING_JOB=gatling-trickle
        python3 ops/scripts/notify_house_alertmanager.py
      '''
    }
  }
}
""")
    }
  }
}
