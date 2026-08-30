#!/usr/bin/env groovy
/**
 * My Island — build, test, deploy, confirm prod.
 *
 * Job parameters (Casc seed job):
 *   SOURCE, DEPLOY_PROD, RUN_E2E, WITH_OBSERVABILITY, WITH_AI, CONFIRM_URL, GIT_BRANCH
 */
pipeline {
  agent any

  parameters {
    choice(name: 'SOURCE', choices: ['local', 'scm'], description: 'local = /var/my-island bind mount; scm = git')
    booleanParam(name: 'DEPLOY_PROD', defaultValue: false, description: 'Deploy docker-compose.prod.yml after green tests')
    booleanParam(name: 'RUN_E2E', defaultValue: false, description: 'Run Playwright E2E against temporary compose stack')
    booleanParam(name: 'WITH_OBSERVABILITY', defaultValue: false, description: 'Include --profile observability on prod deploy')
    booleanParam(name: 'WITH_AI', defaultValue: false, description: 'Include --profile ai on prod deploy')
    string(name: 'CONFIRM_URL', defaultValue: '', description: 'Override confirm base URL (empty = CONFIRM_BASE_URL)')
    string(name: 'GIT_BRANCH', defaultValue: '', description: 'Override branch when SOURCE=scm')
  }

  options {
    timestamps()
    ansiColor('xterm')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timeout(time: 90, unit: 'MINUTES')
  }

  environment {
    COMPOSE_PROJECT_NAME = 'myisland'
    PROD_ENV_FILE = "${env.PROD_ENV_FILE ?: '/run/secrets/env.prod'}"
    CONFIRM_BASE_URL = "${env.CONFIRM_BASE_URL ?: 'http://host.docker.internal:80'}"
    LOCAL_REPO = "${env.LOCAL_REPO ?: '/var/my-island'}"
  }

  stages {
    stage('Checkout') {
      steps {
        script {
          def source = params.SOURCE ?: 'scm'
          if (source == 'local') {
            echo "Using bind-mounted repo at ${env.LOCAL_REPO}"
            sh """
              set -eux
              find . -mindepth 1 -maxdepth 1 -exec rm -rf {} +
              cp -a '${env.LOCAL_REPO}/.' .
            """
          } else if (params.GIT_BRANCH?.trim()) {
            def branch = params.GIT_BRANCH.trim()
            checkout([
              $class: 'GitSCM',
              branches: [[name: "*/${branch}"]],
              userRemoteConfigs: [[url: env.MY_ISLAND_GIT_URL ?: 'https://github.com/tezball/my-island.git']]
            ])
          } else {
            checkout scm
          }
        }
      }
    }

    stage('Backend Test') {
      agent {
        docker {
          image 'maven:3.9.9-eclipse-temurin-21'
          reuseNode true
          args '-v /var/run/docker.sock:/var/run/docker.sock -u root -e DOCKER_HOST=unix:///var/run/docker.sock -e TESTCONTAINERS_HOST_OVERRIDE=host.docker.internal --add-host=host.docker.internal:host-gateway'
        }
      }
      steps {
        dir('my-island-api') {
          sh './mvnw -B test'
        }
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'my-island-api/target/surefire-reports/*.xml'
        }
      }
    }

    stage('Backend Package') {
      agent {
        docker {
          image 'maven:3.9.9-eclipse-temurin-21'
          reuseNode true
          args '-u root'
        }
      }
      steps {
        dir('my-island-api') {
          sh './mvnw -B package -DskipTests'
        }
      }
    }

    stage('Frontend Lint & Build') {
      agent {
        docker {
          image 'node:22-bookworm'
          reuseNode true
          args '-u root'
        }
      }
      steps {
        dir('my-island-web') {
          sh '''
            set -eux
            npm ci
            npm run lint
            npm run build
          '''
        }
      }
    }

    stage('E2E Playwright') {
      when {
        expression { return params.RUN_E2E == true }
      }
      steps {
        sh '''
          set -eux
          docker compose -f docker-compose.yml up -d --build postgres mailpit api web
          for i in $(seq 1 60); do
            if curl -fsS http://host.docker.internal:8080/api/actuator/health >/dev/null; then
              echo "API healthy"
              break
            fi
            sleep 5
          done
          curl -fsS http://host.docker.internal:8080/api/actuator/health
        '''
        script {
          docker.image('mcr.microsoft.com/playwright:v1.58.2-jammy').inside('-u root --add-host=host.docker.internal:host-gateway') {
            dir('my-island-web') {
              sh '''
                set -eux
                npm ci
                npx playwright install --with-deps chromium
                PLAYWRIGHT_BASE_URL=http://host.docker.internal:5173 npm run test:e2e
              '''
            }
          }
        }
      }
      post {
        always {
          sh 'docker compose -f docker-compose.yml stop api web || true'
          archiveArtifacts artifacts: 'my-island-web/test-results/**,my-island-web/playwright-report/**', allowEmptyArchive: true
        }
      }
    }

    stage('Deploy Prod') {
      when {
        allOf {
          expression { return params.DEPLOY_PROD == true }
          anyOf {
            branch 'main'
            expression { return (params.SOURCE ?: 'scm') == 'local' }
          }
        }
      }
      steps {
        script {
          def profiles = []
          if (params.WITH_OBSERVABILITY == true) {
            profiles << '--profile observability'
          }
          if (params.WITH_AI == true) {
            profiles << '--profile ai'
          }
          def profileArgs = profiles.join(' ')
          sh """
            set -eux
            test -f "${env.PROD_ENV_FILE}"
            docker compose -f docker-compose.prod.yml --env-file "${env.PROD_ENV_FILE}" ${profileArgs} up -d --build
          """
        }
      }
    }

    stage('Confirm Prod') {
      when {
        expression { return params.DEPLOY_PROD == true }
      }
      steps {
        script {
          def url = params.CONFIRM_URL?.trim()
          if (!url) {
            url = env.CONFIRM_BASE_URL
          }
          sh """
            set -eux
            chmod +x scripts/confirm-prod.sh
            scripts/confirm-prod.sh '${url}'
          """
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline OK — build/test green${params.DEPLOY_PROD ? ' and prod confirmed' : ''}"
    }
    failure {
      echo 'Pipeline failed — see stage logs'
    }
    cleanup {
      cleanWs(deleteDirs: true, notFailBuild: true)
    }
  }
}
