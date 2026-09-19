// Seeded by JCasC (WF-031 / WF-032 / WF-040). Unattended: poll + GHA green on origin/main.
pipelineJob('deploy-mock-prod') {
  description('Green origin/main (GHA unit+catalog+web+stack) → fishing-journals.com. Agents never SSH. Key in Jenkins/.env. Not a GitHub production Environment.')
  definition {
    cps {
      sandbox(true)
      script("""
pipeline {
  agent any
  triggers { cron('H/5 * * * *') }
  options {
    timestamps()
    timeout(time: 90, unit: 'MINUTES')
    disableConcurrentBuilds()
  }
  stages {
    stage('gate-main-gha') {
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
          decision="\$(python3 ops/scripts/gate_mock_prod_deploy.py)"
          echo "\$decision"
          echo "\$decision" > "\$WORKSPACE/wf040-gate.txt"
          if [[ "\$decision" == SKIP* ]]; then
            echo "No deploy this cycle (feature branches never deploy; wait for green main)."
            exit 0
          fi
          if [[ "\$decision" != DEPLOY* ]]; then
            echo "Unexpected gate output" >&2
            exit 1
          fi
        '''
      }
    }
    stage('ff-main') {
      when {
        expression {
          def d = readFile('wf040-gate.txt').trim()
          return d.startsWith('DEPLOY')
        }
      }
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          cd "\$HOST_REPO"
          branch="\$(git rev-parse --abbrev-ref HEAD)"
          if [[ "\$branch" != "main" ]]; then
            echo "Refuse deploy from \$branch — main only" >&2
            exit 1
          fi
          git fetch origin main
          git merge --ff-only origin/main
        '''
      }
    }
    stage('deploy') {
      when {
        expression {
          def d = readFile('wf040-gate.txt').trim()
          return d.startsWith('DEPLOY')
        }
      }
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
          export MOCK_PROD_SSH_PORT="\${MOCK_PROD_SSH_PORT:-22}"
          export VITE_GOOGLE_CLIENT_ID="\${VITE_GOOGLE_CLIENT_ID:-\${GOOGLE_CLIENT_ID:-}}"
          if [[ -z "\${MOCK_PROD_HOST:-}" || "\${MOCK_PROD_HOST}" == changeme* ]]; then
            echo "Set MOCK_PROD_* in \$HOST_REPO/.env (see .env.example) and ensure the SSH key path is visible inside Jenkins." >&2
            exit 1
          fi
          chmod +x ./scripts/deploy-mock-prod.sh
          ./scripts/deploy-mock-prod.sh
        '''
      }
    }
    stage('http-api-smoke') {
      when {
        expression {
          def d = readFile('wf040-gate.txt').trim()
          return d.startsWith('DEPLOY')
        }
      }
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
          sha="\$(git rev-parse HEAD)"
          origin="\${MOCK_PROD_PUBLIC_ORIGIN:-https://fishing-journals.com}"
          python3 ops/scripts/smoke_mock_prod.py --origin "\$origin" --expect-commit "\$sha"
        '''
      }
    }
  }
}
""")
    }
  }
}
