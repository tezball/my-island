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
    }
}
