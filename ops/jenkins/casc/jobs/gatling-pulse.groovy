// WF-056. On-demand 100-user pulse. No cron. No upstream. Someone starts it.
// Runs against fishing-journals.com. A red ball does not roll a deploy back.
// Archives the Gatling HTML report. Agents never SSH. Do not click Build from chat.
pipelineJob('gatling-pulse') {
  description('On-demand 100-user Gatling pulse on https://fishing-journals.com (10-minute hold, think time). No cron. Not downstream of deploy-mock-prod. Red does not change cutover. Gatling HTML report is a build artifact.')
  definition {
    cps {
      sandbox(true)
      script("""
pipeline {
  agent any
  options {
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds()
  }
  stages {
    stage('pulse') {
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
          export GATLING_BASE_URL="https://fishing-journals.com"
          chmod +x ./ops/scripts/gatling_pulse.sh
          ./ops/scripts/gatling_pulse.sh
        '''
      }
    }
  }
  post {
    always {
      sh '''#!/usr/bin/env bash
        set -euo pipefail
        src="\$HOST_REPO/ops/gatling/target/gatling"
        dest="\$WORKSPACE/gatling-report"
        rm -rf "\$dest"
        mkdir -p "\$dest"
        if [[ -d "\$src" ]]; then
          cp -a "\$src/." "\$dest/"
        else
          echo "No Gatling HTML report at \$src" >&2
        fi
      '''
      archiveArtifacts artifacts: 'gatling-report/**/*', allowEmptyArchive: true
    }
    failure {
      sh '''#!/usr/bin/env bash
        set -euo pipefail
        cd "\$HOST_REPO"
        export GATLING_JOB=gatling-pulse
        python3 ops/scripts/notify_house_alertmanager.py
      '''
    }
  }
}
""")
    }
  }
}
