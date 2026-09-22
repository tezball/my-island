// House CI pipeline for GitHub multibranch (WF-031 / WF-051).
// Copy $WORKSPACE to a host path so compose bind-mounts resolve on Docker Desktop.
pipeline {
  agent any
  options {
    timestamps()
    timeout(time: 60, unit: 'MINUTES')
  }
  stages {
    stage('prepare') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          # shellcheck source=ops/scripts/jenkins_ci.sh
          source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
          jenkins_ci_prepare
        '''
      }
    }
    stage('unit') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
          jenkins_ci_cd
          jenkins_status --context "unit tests" --state pending --description "Jenkins unit"
          docker compose run --rm --no-deps workspace \
            bash -lc 'python3 -m pytest ops/tests -q -m "not stack"'
        '''
      }
      post {
        success {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "unit tests" --state success --description "Jenkins unit ok"
          '''
        }
        failure {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "unit tests" --state failure --description "Jenkins unit failed"
          '''
        }
      }
    }
    stage('catalog') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
          jenkins_ci_cd
          jenkins_status --context "catalog tests" --state pending --description "Jenkins catalog"
          docker compose run --rm --no-deps --user root \
            -v /var/run/docker.sock:/var/run/docker.sock \
            -e DOCKER_HOST=unix:///var/run/docker.sock \
            -e TESTCONTAINERS_HOST_OVERRIDE=host.docker.internal \
            -e MAVEN_USER_HOME=/cache/m2 \
            workspace \
            bash -lc 'mkdir -p /cache/m2 && chmod -R a+rwx /cache/m2 || true; cd services/catalog && ./mvnw -B test'
        '''
      }
      post {
        success {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "catalog tests" --state success --description "Jenkins catalog ok"
          '''
        }
        failure {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "catalog tests" --state failure --description "Jenkins catalog failed"
          '''
        }
      }
    }
    stage('web') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
          jenkins_ci_cd
          jenkins_status --context "web tests" --state pending --description "Jenkins web"
          ROOT="$(pwd)"
          docker run --rm \
            -v "$ROOT/web:/src" \
            -v my-island_ops_npm:/root/.npm \
            -e npm_config_cache=/root/.npm \
            -w /src \
            node:22-bookworm \
            bash -lc 'npm ci && npm test && npm run build'
        '''
      }
      post {
        success {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "web tests" --state success --description "Jenkins web ok"
          '''
        }
        failure {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "web tests" --state failure --description "Jenkins web failed"
          '''
        }
      }
    }
    stage('chaos') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          ROOT="${HOST_REPO:-$WORKSPACE}"
          cd "$ROOT"
          docker compose run --rm --no-deps workspace \
            bash -lc 'cd services/catalog && ./mvnw -B -Dtest=RetryFallbackTest test'
        '''
      }
    }
    stage('stack') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
          jenkins_ci_cd
          jenkins_isolate_env
          jenkins_status --context "compose stack" --state pending --description "Jenkins stack"
          SKIP_JENKINS=1 SKIP_WEB=1 ./scripts/dev up
          REQUIRE_STACK=1 DEV_TEST_IN_WORKSPACE=1 SKIP_JENKINS=1 SKIP_WEB=1 ./scripts/dev test
        '''
      }
      post {
        success {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "compose stack" --state success --description "Jenkins stack ok"
          '''
        }
        failure {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "compose stack" --state failure --description "Jenkins stack failed"
          '''
        }
        always {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_ci_cd
            jenkins_isolate_env
            docker compose down || true
          '''
        }
      }
    }
  }
}
