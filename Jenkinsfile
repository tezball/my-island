pipeline {
    agent any
    options {
        timeout(time: 5, unit: 'MINUTES')
    }
    stages {
        stage('test') {
            steps {
                sh './gradlew :server:test --no-daemon'
            }
        }
        stage('gatling') {
            when {
                expression { env.GATLING_BASE_URL }
            }
            steps {
                sh './gradlew :gatling:gatlingRun --no-daemon'
            }
        }
    }
}
