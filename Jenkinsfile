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
          jenkins_status --context "jenkins/unit tests" --state pending --description "Jenkins unit"
          docker compose run --rm --no-deps workspace \
            bash -lc 'python3 -m pytest ops/tests -q -m "not stack"'
        '''
      }
      post {
        success {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "jenkins/unit tests" --state success --description "Jenkins unit ok"
          '''
        }
        failure {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "jenkins/unit tests" --state failure --description "Jenkins unit failed"
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
          jenkins_status --context "jenkins/catalog tests" --state pending --description "Jenkins catalog"
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
            jenkins_status --context "jenkins/catalog tests" --state success --description "Jenkins catalog ok"
          '''
        }
        failure {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "jenkins/catalog tests" --state failure --description "Jenkins catalog failed"
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
          jenkins_status --context "jenkins/web tests" --state pending --description "Jenkins web"
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
            jenkins_status --context "jenkins/web tests" --state success --description "Jenkins web ok"
          '''
        }
        failure {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "jenkins/web tests" --state failure --description "Jenkins web failed"
          '''
        }
      }
    }
    stage('zap') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          ROOT="${HOST_REPO:-$WORKSPACE}"
          cd "$ROOT"
          SKIP_JENKINS=1 SKIP_WEB=1 ./scripts/dev up
          # dev up waits for the in-container healthcheck, not for the URL
          # this process will scan. The controller shares the compose network:
          # catalog:8080 is catalog; 127.0.0.1:8081 is only the host publish.
          TARGET="http://127.0.0.1:8081"
          if curl -sf --max-time 2 http://catalog:8080/actuator/health/readiness >/dev/null 2>&1; then
            TARGET="http://catalog:8080"
          fi
          ready=0
          for _ in $(seq 1 30); do
            if curl -sf --max-time 2 "${TARGET}/api/v1/places" >/dev/null 2>&1; then
              ready=1
              break
            fi
            sleep 2
          done
          if [ "$ready" != "1" ]; then
            echo "catalog not accepting ${TARGET}/api/v1/places" >&2
            exit 1
          fi
          python3 ops/scripts/zap_style_scan.py "$TARGET"
        '''
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
          jenkins_status --context "jenkins/compose stack" --state pending --description "Jenkins stack"
          SKIP_JENKINS=1 SKIP_WEB=1 ./scripts/dev up
          REQUIRE_STACK=1 DEV_TEST_IN_WORKSPACE=1 SKIP_JENKINS=1 SKIP_WEB=1 ./scripts/dev test
        '''
      }
      post {
        success {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "jenkins/compose stack" --state success --description "Jenkins stack ok"
          '''
        }
        failure {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            source "${WORKSPACE}/ops/scripts/jenkins_ci.sh"
            jenkins_status --context "jenkins/compose stack" --state failure --description "Jenkins stack failed"
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
