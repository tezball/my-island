// WF-045. Weekly Gatling perf. Failures = red ball + house Alertmanager. Not merge load.
pipelineJob('gatling-weekly') {
  description('Weekly Gatling Guest perf on fishing-journals.com. Non-zero fails the build (red) and notifies house Alertmanager. Not a GitHub production Environment.')
  definition {
    cps {
      sandbox(true)
      script("""
pipeline {
  agent any
  triggers { cron('H 6 * * 0') }
  options {
    timestamps()
    timeout(time: 60, unit: 'MINUTES')
    disableConcurrentBuilds()
  }
  stages {
    stage('weekly') {
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
          chmod +x ./ops/scripts/gatling_weekly.sh
          ./ops/scripts/gatling_weekly.sh
        '''
      }
    }
  }
  post {
    failure {
      sh '''#!/usr/bin/env bash
        set -euo pipefail
        cd "\$HOST_REPO"
        export GATLING_JOB=gatling-weekly
        python3 ops/scripts/notify_house_alertmanager.py
      '''
    }
  }
}
""")
    }
  }
}
