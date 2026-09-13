// Seeded by JCasC (WF-031 / WF-032). SSH deploy to mock-prod VPS via scripts/deploy-mock-prod.sh
pipelineJob('deploy-mock-prod') {
  description('Deploy main → mock-prod VPS at domain root (my-island). Secrets from repo .env — never git. Not a GitHub production Environment.')
  definition {
    cps {
      sandbox(true)
      script("""
pipeline {
  agent any
  options {
    timestamps()
    timeout(time: 90, unit: 'MINUTES')
    disableConcurrentBuilds()
  }
  stages {
    stage('deploy') {
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
  }
}
""")
    }
  }
}
