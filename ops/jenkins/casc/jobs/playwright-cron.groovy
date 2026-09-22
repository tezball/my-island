// WF-011. Playwright vs fishing-journals.com. Not a merge gate. Not inside unit/catalog.
pipelineJob('playwright-cron') {
  description('Playwright every 6 hours against https://fishing-journals.com/. Not automerge. Agents may also run Playwright MCP on demand.')
  definition {
    cps {
      sandbox(true)
      script("""
pipeline {
  agent any
  triggers { cron('H H/6 * * *') }
  options { timestamps(); timeout(time: 30, unit: 'MINUTES') }
  stages {
    stage('playwright') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          ROOT="\${HOST_REPO:-\$WORKSPACE}"
          docker run --rm -v "\$ROOT/web:/src" -w /src \\
            -e PLAYWRIGHT_BASE_URL=https://fishing-journals.com \\
            mcr.microsoft.com/playwright:v1.49.1-jammy \\
            bash -lc 'npm ci && npx playwright test'
        '''
      }
    }
  }
}
""")
    }
  }
}
