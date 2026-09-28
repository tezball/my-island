// Seeded by JCasC (WF-031 / WF-032 / WF-040). Unattended: mock-prod signal after
// GHA success on main. The trigger lives in this Job DSL triggers block.
// A cron or GenericTrigger inside the pipeline script is registered only after a
// build, and the next JCasC re-seed clears it.
// Token value is Jenkins credential deploy-mock-prod-trigger (env JENKINS_ADMIN_PASSWORD).
// Do not commit the token or a webhook URL.
pipelineJob('deploy-mock-prod') {
  description('Green origin/main (GHA unit+catalog+web+stack) → fishing-journals.com. Started by mock-prod signal after CI succeeds on main. Agents never SSH. Key in Jenkins/.env. Not a GitHub production Environment.')
  triggers {
    genericTrigger {
      genericVariables {
        genericVariable {
          key('conclusion')
          value('$.conclusion')
          expressionType('JSONPath')
          regexpFilter('')
          defaultValue('')
        }
        genericVariable {
          key('ref')
          value('$.ref')
          expressionType('JSONPath')
          regexpFilter('')
          defaultValue('')
        }
      }
      genericRequestVariables {
        genericRequestVariable {
          key('signal')
          regexpFilter('')
        }
      }
      genericHeaderVariables {
        genericHeaderVariable {
          key('user-agent')
          regexpFilter('')
        }
      }
      tokenCredentialId('deploy-mock-prod-trigger')
      causeString('mock-prod signal: CI success on main')
      printContributedVariables(false)
      printPostContent(false)
      silentResponse(false)
      shouldNotFlatten(false)
      regexpFilterText('$conclusion $ref')
      regexpFilterExpression('^success refs/heads/main$')
    }
  }
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
          git fetch origin main
          git show origin/main:ops/scripts/gate_mock_prod_deploy.py > "\$WORKSPACE/gate_mock_prod_deploy.py"
          decision="\$(python3 "\$WORKSPACE/gate_mock_prod_deploy.py" --repo "\$HOST_REPO")"
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
          # Do not ff-only HOST_REPO. A dirty tree (local compose ports, Obsidian)
          # makes merge --ff-only abort before deploy. Ship a clean origin/main clone.
          deploy_tree="\${JENKINS_DEPLOY_TREE:-\$HOST_REPO/.jenkins-deploy-main}"
          if [[ ! -d "\$deploy_tree/.git" ]]; then
            rm -rf "\$deploy_tree"
            git clone --reference "\$HOST_REPO" --branch main https://github.com/tezball/my-island.git "\$deploy_tree"
          fi
          git -C "\$deploy_tree" remote set-url origin https://github.com/tezball/my-island.git
          git -C "\$deploy_tree" fetch origin main
          git -C "\$deploy_tree" checkout -f main
          git -C "\$deploy_tree" reset --hard origin/main
          git -C "\$deploy_tree" clean -fd
          printf '%s\n' "\$deploy_tree" > "\$WORKSPACE/deploy-tree.txt"
          echo "Deploy tree \$(git -C "\$deploy_tree" rev-parse --abbrev-ref HEAD) \$(git -C "\$deploy_tree" rev-parse HEAD)"
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
          deploy_tree="\$(tr -d '\\n' < "\$WORKSPACE/deploy-tree.txt")"
          cd "\$deploy_tree"
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
          deploy_tree="\$(tr -d '\\n' < "\$WORKSPACE/deploy-tree.txt")"
          cd "\$deploy_tree"
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
